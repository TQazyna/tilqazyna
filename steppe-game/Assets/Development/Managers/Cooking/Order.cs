using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class Order : MonoBehaviour
{
    [Serializable]
    public class DishStatus
    {
        public LevelData.DishData DishData;
        public bool IsCompleted;
    }

    [SerializeField] private RectTransform _rectTransform;
    [SerializeField] private RectTransform _originRectTransfrom;
    [SerializeField] private Image[] _dishImages;
    [SerializeField] private Image[] _dishImagesCompleted;
    [SerializeField] private Slider _orderTimeSlider;
    [SerializeField] private TextMeshProUGUI _orderAmountText;

    public List<DishStatus> _dishStatuses = new();
    private int _currentBatchStartIndex;
    private int _completedDishCount;

    private float _orderTotalTime;
    private float _elapsedTime;
    private bool _isFailed;
    private LevelData.OrderData _orderData;

    private int CompletedDishCount
    {
        get => _completedDishCount;
        set
        {
            _completedDishCount = value;
            
            if (AreAllCurrentDishesCompleted())
            {
                ShowNextBatch();
            }
            
            if (CompletedDishCount == _dishStatuses.Count)
            {
                OnComplete?.Invoke();
            }
        }
    }

    public RectTransform RectTransform => _rectTransform;
    public bool IsCompleted => CompletedDishCount == _dishStatuses.Count;
    public event Action OnComplete;
    public event Action OnFailed;

    public void Initialize(LevelData.OrderData orderData)
    {
        _dishStatuses = new List<DishStatus>();
        foreach (var dish in orderData.dishes)
        {
            _dishStatuses.Add(new DishStatus { DishData = dish, IsCompleted = false });
        }

        foreach (var image in _dishImagesCompleted)
        {
            image.gameObject.SetActive(false);
        }
        
        _orderData = orderData;

        _orderTotalTime = orderData.waitingTime;
        _elapsedTime = 0f;

        _currentBatchStartIndex = 0;
        CompletedDishCount = 0;

        _orderAmountText.text = orderData.dishPrice.ToString();
        _orderAmountText.color = Color.black;
        
        _orderTimeSlider.maxValue = _orderTotalTime;
        _orderTimeSlider.value = _orderTotalTime;

        _orderTimeSlider.gameObject.SetActive(true);
        
        LoadCurrentBatch();
    }

    public IEnumerable<DishStatus> GetUncompletedDishes()
    {
        foreach (var dishStatus in _dishStatuses)
        {
            if (!dishStatus.IsCompleted)
            {
                yield return dishStatus;
            }
        }
    }
    
    public void MarkDishAsCompleted(IngredientType ingredientType)
    {
        for (var i = 0; i < _dishStatuses.Count; i++)
        {
            var dishStatus = _dishStatuses[i];
            if (dishStatus.DishData.dishType == ingredientType && !dishStatus.IsCompleted)
            {
                dishStatus.IsCompleted = true;
                CompletedDishCount++;
                
                var dishIndexInBatch = i - _currentBatchStartIndex;
                if (dishIndexInBatch >= 0 && dishIndexInBatch < _dishImagesCompleted.Length)
                {
                    _dishImagesCompleted[dishIndexInBatch].gameObject.SetActive(true);
                }

                break;
            }
        }
    }

    private void FixedUpdate()
    {
        _elapsedTime += Time.fixedDeltaTime;
        var remainingTime = Mathf.Max(0, _orderTotalTime - _elapsedTime);

        _orderTimeSlider.value = remainingTime;
        
        if (remainingTime <= 0 && !IsCompleted && !_isFailed)
        {
            HandleOrderFailed();
        }
    }

    private void LoadCurrentBatch()
    {
        for (var i = 0; i < _dishImages.Length; i++)
        {
            var dishIndex = _currentBatchStartIndex + i;

            if (dishIndex < _dishStatuses.Count)
            {
                _dishImages[i].gameObject.SetActive(true);
                _dishImages[i].sprite = _dishStatuses[dishIndex].DishData.dishPhoto;
                _dishImagesCompleted[i].gameObject.SetActive(_dishStatuses[dishIndex].IsCompleted);
            }
            else
            {
                _dishImages[i].gameObject.SetActive(false);
            }
        }

        AdjustOrderSize();
    }

    private void ShowNextBatch()
    {
        StartCoroutine(ShowNextBatchWithDelay());
    }

    private IEnumerator ShowNextBatchWithDelay()
    {
        yield return new WaitForSeconds(0.5f);
        
        _currentBatchStartIndex += _dishImages.Length;

        if (_currentBatchStartIndex < _dishStatuses.Count)
        {
            LoadCurrentBatch();
        }
        else
        {
            OnComplete?.Invoke();
        }
    }

    private bool AreAllCurrentDishesCompleted()
    {
        for (var i = 0; i < _dishImages.Length; i++)
        {
            var dishIndex = _currentBatchStartIndex + i;

            if (dishIndex < _dishStatuses.Count && !_dishStatuses[dishIndex].IsCompleted)
            {
                return false;
            }
        }

        return true;
    }

    private void AdjustOrderSize()
    {
        var activeImagesCount = 0;
        
        for (var i = 0; i < _dishImages.Length; i++)
        {
            if (_dishImages[i].gameObject.activeSelf)
            {
                activeImagesCount++;
            }
        }
        
        var imageHeight = _dishImages[0].rectTransform.rect.height;
        
        var padding = 60f;
        var spacing = 10f;
        var newHeight = padding + activeImagesCount * imageHeight + (activeImagesCount - 1) * spacing;
        
        _originRectTransfrom.sizeDelta = new Vector2(_originRectTransfrom.sizeDelta.x, newHeight);
    }

    private void HandleOrderFailed()
    {
        _isFailed = true;
        _orderTimeSlider.gameObject.SetActive(false);
        _orderAmountText.text = (_orderData.dishPrice - 2).ToString();
        _orderAmountText.color = Color.red;
        
        OnFailed?.Invoke();
    }
}
