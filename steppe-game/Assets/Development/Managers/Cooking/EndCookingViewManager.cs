using TMPro;
using UnityEngine;
using UnityEngine.Localization.Components;
using UnityEngine.UI;

public class EndCookingViewManager : MonoBehaviour
{
    [Space, SerializeField] private Image _starImage1;
    [SerializeField] private Image _starImage2;
    [SerializeField] private Image _starImage3;
    [SerializeField] private Sprite _fullStarSprite;
    [SerializeField] private Sprite _emptyStarSprite;

    [Space, SerializeField] private Image _avatarImage;
    [SerializeField] private Sprite _boySprite;
    [SerializeField] private Sprite _girlSprite;

    [Space, SerializeField] private Slider _expSlider;
    [SerializeField] private TextMeshProUGUI _expText;
    [SerializeField] private LocalizeStringEvent _currencyText;
    [SerializeField] private LocalizeStringEvent _pointsText;
    [SerializeField] private LocalizeStringEvent _levelText;

    public void SetActive(bool isActive)
    {
        gameObject.SetActive(isActive);
    }

    public void Initialize(bool isBoy, LevelData levelData, int currencyAmount, int starCount)
    {
        if (starCount == 3)
        {
            _starImage1.sprite = _fullStarSprite;
            _starImage2.sprite = _fullStarSprite;
            _starImage3.sprite = _fullStarSprite;   
        }
        else if (starCount == 2)
        {
            _starImage1.sprite = _fullStarSprite;
            _starImage2.sprite = _fullStarSprite;
            _starImage3.sprite = _emptyStarSprite;   
        }
        else if (starCount == 1)
        {
            _starImage1.sprite = _fullStarSprite;
            _starImage2.sprite = _emptyStarSprite;
            _starImage3.sprite = _emptyStarSprite;   
        }
        else
        {
            _starImage1.sprite = _emptyStarSprite;
            _starImage2.sprite = _emptyStarSprite;
            _starImage3.sprite = _emptyStarSprite;  
        }
        
        _avatarImage.sprite = isBoy ? _boySprite : _girlSprite;

        _currencyText.StringReference.Arguments = new object[] { currencyAmount };
        _currencyText.RefreshString();

        _pointsText.StringReference.Arguments = new object[] { levelData.pointsAmount };
        _pointsText.RefreshString();

        _expText.text = levelData.expAmount.ToString();

        _levelText.StringReference.Arguments = new object[] { $"{levelData.sublevelNumber} / 6" };
        _levelText.RefreshString();
    }
}