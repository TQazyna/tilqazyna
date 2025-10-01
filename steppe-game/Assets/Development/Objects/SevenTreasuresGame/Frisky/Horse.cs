using System;
using Development.Managers.Bozok.HorseGame;
using Development.Objects.QuickTap;
using UnityEngine;

namespace Development.Objects.SevenTreasuresGame.Frisky
{
    public sealed class Horse : MonoBehaviour
    {
        [SerializeField] private GameObject _idleObject;
        [SerializeField] private GameObject _jumpObject;
        [SerializeField] private GameObject _stackObject;
        [SerializeField] private float _jumpHeight = 5f;
        [SerializeField] private float _jumpSpeed = 5f;
        [SerializeField] private int _jupmsToComplexity = 4;
        [SerializeField] private float _pointsToReduceImageFill = 30f;

        private bool _isJumping;
        private float _startY;
        private float _jumpTime;
        private float _jumpDuration;
        private int _jumpsCount;
        public static event Action<float> OnRockTouched;
        public static event Action OnChangeDifficulty;

        private void Awake()
        {
            _startY = transform.position.y;
            _jumpDuration = _jumpHeight / _jumpSpeed;
            if (_stackObject == null)
            {
                _stackObject = new GameObject();
            }
        }

        private void Update()
        {
            if (_isJumping)
            {
                ContinueJump();
            }
        }

        public void Jump()
        {
            if (!_isJumping)
            {
                _isJumping = true;
                _jumpTime = 0f;
                _idleObject.SetActive(false);
                _stackObject?.SetActive(false);
                _jumpObject.SetActive(true);
                _jumpsCount++;
                if (_jumpsCount == _jupmsToComplexity)
                {
                    OnChangeDifficulty?.Invoke();
                }
            }
        }

        private void ContinueJump()
        {
            _jumpTime += Time.deltaTime;
            float t = Mathf.Clamp01(_jumpTime / _jumpDuration);
            float newY = _startY + _jumpHeight * 0.5f * (1 - Mathf.Cos(2 * Mathf.PI * t));
            transform.position = new Vector3(transform.position.x, newY, transform.position.z);

            if (t >= 1f)
            {
                ResetHorse();
            }
        }

        private void OnTriggerEnter2D(Collider2D other)
        {
            if (other.CompareTag("Rock"))
            {
                OnRockTouched?.Invoke(_pointsToReduceImageFill);
            }
        }

        private void ResetHorse()
        {
            _idleObject.SetActive(true);
            _jumpObject.SetActive(false);
            _stackObject?.SetActive(false);
            transform.position = new Vector3(transform.position.x, _startY, transform.position.z);
            _isJumping = false;
        }

        private void ChangeHorseObjectOnGameSpeedChange(float speed)
        {
            if (speed <= 0)
            {
                _idleObject.SetActive(false);
                _jumpObject.SetActive(false);
                _stackObject?.SetActive(true);
            }
            else
            {
                _idleObject.SetActive(true);
                _jumpObject.SetActive(false);
                _stackObject?.SetActive(false);
            }
        }

        private void ResetJumps() => _jumpsCount = 0;

        private void ChangeJumpSpeed(float percent) => _jumpSpeed *= percent;

        private void OnEnable()
        {
            MiniGamesBackButton.OnBackButtonPressed += ResetHorse;
            MiniGamesBackButton.OnBackButtonPressed += ResetJumps;
            HorseGameManager.OnGameSpeedChanged += ChangeJumpSpeed;
            HorseGameManager.OnGameSpeedChanged += ChangeHorseObjectOnGameSpeedChange;
        }

        private void OnDisable()
        {
            MiniGamesBackButton.OnBackButtonPressed -= ResetHorse;
            MiniGamesBackButton.OnBackButtonPressed -= ResetJumps;
            HorseGameManager.OnGameSpeedChanged -= ChangeJumpSpeed;
            HorseGameManager.OnGameSpeedChanged -= ChangeHorseObjectOnGameSpeedChange;
        }
    }
}