using System;
using Development.Objects.SevenTreasuresGame.Frisky;
using UnityEngine;
using UnityEngine.UI;

namespace Development.Objects.QuickTap
{
    public sealed class FillingImage : MonoBehaviour
    {
        private Image _image;
        private float _fillAmount;

        private bool _canContinue;
        
        [SerializeField, Range(0, 60)] private float _secsToFill;
        
        [SerializeField] private FillingType _fillingType;
        private enum FillingType
        {
            Default,
            Reverse,
            Timer
        }

        public static event Action OnFieldFilled;
        
        private void Awake()
        {
            _image = gameObject.GetComponent<Image>();
            ResetFillAmount();
        }

        private void FixedUpdate()
        {
            _image.fillAmount = _fillAmount;
            switch (_fillingType)
            {
                case FillingType.Reverse:
                case FillingType.Timer:
                    if (!_canContinue) break;
                    Filling();
                    break;
                default:
                    Fading();
                    break;
            }
        }

        public void SetCanContinueTrue() => _canContinue = true;

        public void ChangeImageFill(float points)
        {
            points /= 100;
            switch (_fillingType)
            {
                case FillingType.Default:
                    if (_fillAmount + points > 1)
                    {
                        _fillAmount = 1;
                        OnFieldFilled?.Invoke();
                    }
                    else
                    {
                        _fillAmount += points;
                    }
                    break;
                case FillingType.Reverse:
                    if (_fillAmount - points < 0)
                    {
                        _fillAmount = 0;
                        OnFieldFilled?.Invoke();
                    }
                    else
                    {
                        _fillAmount -= points;
                    }
                    break;
                case FillingType.Timer:
                    if (_fillAmount - points < 0)
                    {
                        _fillAmount = 0;
                    }
                    else
                    {
                        _fillAmount -= points;
                    }
                    break;
            }
        }

        public void ResetFillAmount()
        {
            if(_image == null) return;
            
            switch (_fillingType)
            {
                case FillingType.Reverse:
                    _image.fillAmount = 1f;
                    _fillAmount = 1f;
                    break;
                default:
                    _image.fillAmount = 0f;
                    _fillAmount = 0f;
                    break;
            }
        }

        private void Fading()
        {
            _fillAmount -= Time.fixedDeltaTime / _secsToFill;
            _fillAmount = Mathf.Clamp01(_fillAmount);
        }

        private void Filling()
        {
            _fillAmount += Time.fixedDeltaTime / _secsToFill;
            _fillAmount = Mathf.Clamp01(_fillAmount);

            if (_fillingType == FillingType.Timer && Mathf.Approximately(_fillAmount, 1))
            {
                OnFieldFilled?.Invoke();
                ResetFillAmount();
                _canContinue = false;
            }
        }

        private void OnEnable()
        {
            MiniGamesBackButton.OnBackButtonPressed += ResetFillAmount;
            Horse.OnRockTouched += ChangeImageFill;
        }

        private void OnDisable()
        {
            MiniGamesBackButton.OnBackButtonPressed -= ResetFillAmount;
            Horse.OnRockTouched -= ChangeImageFill;
        }
    }
}