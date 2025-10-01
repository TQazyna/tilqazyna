using System;
using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class LadleMovement : MonoBehaviour
    {
        [SerializeField, Range(0, 100)] private float _maxSpeed;
        [SerializeField, Range(0, 10)] private float _acceleration;
        [SerializeField, Range(0, 10)] private float _deceleration;
        [SerializeField] private Vector2 _orbitSize = new Vector2(2f, 1f);
        [SerializeField] private SplashController _splash;

        private RectTransform _rectTransform;

        private Vector3 _initPosition;
        
        private float _currentSpeed;
        private float _currentAngle;

        private void Awake()
        {
            _rectTransform = GetComponent<RectTransform>();
            _initPosition = GetComponent<RectTransform>().localPosition;
            _splash.ChangeLadleInitPosition(_initPosition);
        }

        private void FixedUpdate()
        {
            if (_currentSpeed > 0)
            {
                _currentSpeed -= _deceleration * Time.fixedDeltaTime;
                _currentSpeed = Mathf.Max(_currentSpeed, 0);
            }

            RotateLadle();
        }

        private void RotateLadle()
        {
            _currentAngle += _currentSpeed * Time.fixedDeltaTime;
            _currentAngle %= 2 * Mathf.PI;
            
            float x = _initPosition.x - Mathf.Cos(_currentAngle) * _orbitSize.x;
            float y = _initPosition.y + Mathf.Sin(_currentAngle) * _orbitSize.y;
            
            _rectTransform.localPosition = new Vector3(x, y, _rectTransform.localPosition.z);
        }

        public void MoveLadle(float points)
        {
            _currentSpeed += points * _acceleration;
            _currentSpeed = Mathf.Min(_currentSpeed, _maxSpeed);
        }

        public void StopMoving() => _currentSpeed = 0;

        private void OnEnable() => MiniGamesBackButton.OnBackButtonPressed += StopMoving;
        private void OnDisable() => MiniGamesBackButton.OnBackButtonPressed -= StopMoving;
    }
}