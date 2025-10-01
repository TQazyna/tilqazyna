using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Localization.Components;
using UnityEngine.UI;

public class Guest : MonoBehaviour
{
    [SerializeField] private Image _image;
    [SerializeField] private Order _order;
    [SerializeField] private GameObject _speechBubble;
    [SerializeField] private LocalizeStringEvent _localizeStringEvent;
    [SerializeField] private AudioSource _audioSource;
    [SerializeField] private StateManager _stateManager;

    public bool IsProcessing { get; set; }
    public Order Order => _order;

    public static event Action OnComplete;
    public static event Action OnFailed;
    public static event Action OnGuestSoundComplete; 

    private void Awake()
    {
        _order.OnComplete += OrderCompleted;
        _order.OnFailed += OrderFailed;
    }

    private void OrderFailed()
    {
        OnFailed?.Invoke();
    }

    private void OrderCompleted()
    {
        _order.gameObject.SetActive(false);
        OnComplete?.Invoke();
        IsProcessing = false;
    }

    public void Initialize(Sprite guestSprite, LevelData.OrderData orderData, int queuePlace)
    {
        StartCoroutine(InitializeGuest(guestSprite, orderData, queuePlace));
    }

    private IEnumerator InitializeGuest(Sprite guestSprite, LevelData.OrderData orderData, int queuePlace)
    {
        _order.gameObject.SetActive(true);
        _image.sprite = guestSprite;
        _order.Initialize(orderData);

        if (!orderData.OrderPhrase.IsEmpty)
        {
            _speechBubble.SetActive(true);
            _localizeStringEvent.StringReference = orderData.OrderPhrase;

            if (orderData.orderSound != null && _stateManager.Language == Language.Kazakh)
            {
                _audioSource.volume = Mathf.Clamp(_stateManager.SoundVolume, 0f, 1f);
                yield return new WaitForSeconds(2 * queuePlace);
                _audioSource.PlayOneShot(orderData.orderSound);
                yield return new WaitForSeconds(2 * (queuePlace + 1));
            }
            OnGuestSoundComplete?.Invoke();

            StartCoroutine(DisableSpeechBubbleAfterDelay(5f));
        }
        else
        {
            _speechBubble.SetActive(false);
        }

        IsProcessing = true;
    }

    private IEnumerator DisableSpeechBubbleAfterDelay(float delay)
    {
        yield return new WaitForSeconds(delay);

        _speechBubble.SetActive(false);
    }

    private void OnDisable()
    {
        StopAllCoroutines();
    }
}