using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ChooseCharacterManager : MonoBehaviour
{
    private const float Duration = 0.35f;

    [Header("Girl")] [SerializeField] private RectTransform _girlTransform;

    [SerializeField] private RectTransform _girlStartPosition;
    [SerializeField] private RectTransform _girlEndPosition;
    [SerializeField] private Image _girlImage;

    [Header("Boy")] [SerializeField] private RectTransform _boyTransform;

    [SerializeField] private RectTransform _boyStartPosition;
    [SerializeField] private RectTransform _boyEndPosition;
    [SerializeField] private Image _boyImage;

    [Header("Input Group")] [SerializeField]
    private GameObject _inputGroup;

    [SerializeField] private TMP_InputField _inputField;
    [SerializeField] private Button _submitButton;

    [Header("Other")] [SerializeField] private GameObject _textDescription;

    [SerializeField] private GameObject _backButton;

    private float _animationTime;

    private RectTransform _currentCharacter;
    private Vector3 _currentEndPosition;
    private Vector3 _currentStartPosition;
    private RectTransform _fadingCharacter;
    private float _fadingEndAlpha;
    private Vector3 _fadingEndPosition;
    private Image _fadingImage;
    private float _fadingStartAlpha;
    private Vector3 _fadingStartPosition;
    private bool _isAnimating;

    private bool _isBoySelected;

    private void Start()
    {
        Initialize();
    }

    private void Update()
    {
        if (_isAnimating)
        {
            AnimateCharacter();
        }
    }

    public event Action<bool> CharacterChoosen;
    public event Action<string> NameSubmitted;

    public void Initialize()
    {
        ResetCharacters();

        _textDescription.SetActive(true);
        _backButton.SetActive(false);
        _inputGroup.SetActive(false);
        _submitButton.interactable = false;
        _inputField.onValueChanged.AddListener(OnTextChanged);
    }

    public void OnClickBack()
    {
        if (_isAnimating) return;

        _animationTime = 0f;
        _isAnimating = true;

        if (_isBoySelected)
        {
            SetupAnimation(
                _boyTransform, _boyEndPosition.position, _boyStartPosition.position,
                _girlTransform, _girlEndPosition.position, _girlStartPosition.position, _girlImage, 0f, 1f);
        }
        else
        {
            SetupAnimation(
                _girlTransform, _girlEndPosition.position, _girlStartPosition.position,
                _boyTransform, _boyEndPosition.position, _boyStartPosition.position, _boyImage, 0f, 1f);
        }

        _currentCharacter.position = _currentStartPosition;
        _fadingCharacter.position = _fadingStartPosition;
        SetAlpha(_fadingImage, _fadingStartAlpha);

        _inputGroup.SetActive(false);
        _textDescription.SetActive(false);
    }

    public void ChooseCharacter(bool isBoy)
    {
        if (_isAnimating) return;

        _isBoySelected = isBoy;
        _animationTime = 0f;
        _isAnimating = true;

        if (isBoy)
        {
            SetupAnimation(
                _boyTransform, _boyStartPosition.position, _boyEndPosition.position,
                _girlTransform, _girlStartPosition.position, _girlEndPosition.position, _girlImage, 1f, 0f);
        }
        else
        {
            SetupAnimation(
                _girlTransform, _girlStartPosition.position, _girlEndPosition.position,
                _boyTransform, _boyStartPosition.position, _boyEndPosition.position, _boyImage, 1f, 0f);
        }

        _currentCharacter.position = _currentStartPosition;
        _fadingCharacter.position = _fadingStartPosition;
        SetAlpha(_fadingImage, _fadingStartAlpha);

        _textDescription.SetActive(false);
        _backButton.SetActive(true);

        CharacterChoosen?.Invoke(isBoy);
    }

    private void ResetCharacters()
    {
        SetCharacterPosition(_girlTransform, _girlStartPosition.position, _girlImage, 1f);
        SetCharacterPosition(_boyTransform, _boyStartPosition.position, _boyImage, 1f);

        _isAnimating = false;
        _animationTime = 0f;
    }

    private void SetCharacterPosition(RectTransform character, Vector3 position, Image image, float alpha)
    {
        character.position = position;
        SetAlpha(image, alpha);
    }

    private void SetAlpha(Image image, float alpha)
    {
        var color = image.color;
        color.a = alpha;
        image.color = color;
    }

    private void SetupAnimation(
        RectTransform current, Vector3 currentStart, Vector3 currentEnd,
        RectTransform fading, Vector3 fadingStart, Vector3 fadingEnd, Image fadingImage,
        float startAlpha, float endAlpha)
    {
        _currentCharacter = current;
        _currentStartPosition = currentStart;
        _currentEndPosition = currentEnd;

        _fadingCharacter = fading;
        _fadingStartPosition = fadingStart;
        _fadingEndPosition = fadingEnd;
        _fadingImage = fadingImage;
        _fadingStartAlpha = startAlpha;
        _fadingEndAlpha = endAlpha;
    }

    private void AnimateCharacter()
    {
        _animationTime += Time.deltaTime;
        var t = Mathf.Clamp01(_animationTime / Duration);

        _currentCharacter.position = Vector3.Lerp(_currentStartPosition, _currentEndPosition, t);
        if (_fadingCharacter != null)
        {
            _fadingCharacter.position = Vector3.Lerp(_fadingStartPosition, _fadingEndPosition, t);
            SetAlpha(_fadingImage, Mathf.Lerp(_fadingStartAlpha, _fadingEndAlpha, t));
        }

        if (_animationTime >= Duration)
        {
            _isAnimating = false;

            if (_currentEndPosition == (_isBoySelected ? _boyEndPosition.position : _girlEndPosition.position))
            {
                _inputGroup.SetActive(true);
            }
            else
            {
                ResetCharacters();
                _backButton.SetActive(false);
                _textDescription.SetActive(true);
            }
        }
    }

    public void OnTextChanged(string text)
    {
        _submitButton.interactable = !string.IsNullOrWhiteSpace(text);
    }

    public void OnSubmit()
    {
        var enteredName = _inputField.text;
        NameSubmitted?.Invoke(enteredName);
    }
}