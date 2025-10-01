using System;
using UnityEngine;

namespace Development.Objects.QuickTap
{
    public class FeatherMovement : MonoBehaviour
    {
        [SerializeField, Range(0, 1000)] private float _maxSpeed;
        [SerializeField, Range(0, 100)] private float _acceleration;
        [SerializeField, Range(0, 100)] private float _deceleration;
        [SerializeField, Range(0, 1920)] private float _distance;
        [SerializeField, Range(1, 20)] private int _lineCount;
        [SerializeField, Range(1, 500)] private int _distanceBetweenLines;
        
        private float _currentSpeed;
        private Vector3 _initPosition;
        private int _currentLine = 1;
        
        public int CurrentLine => _currentLine;
        public float CurrentLineProgress => Mathf.Clamp01((transform.localPosition.x - _initPosition.x) / _distance);

        private void Awake()
        {
            _initPosition = transform.localPosition;
        }

        private void FixedUpdate()
        {
            _currentSpeed -= _deceleration * Time.fixedDeltaTime;
            _currentSpeed = Mathf.Max(_currentSpeed, 0);
            
            if(Mathf.Abs(transform.localPosition.x - _initPosition.x) >= _distance)
            {
                if (_currentLine < _lineCount)
                {
                    _currentLine++;
                    transform.localPosition = new Vector3(_initPosition.x, 
                        _initPosition.y - _distanceBetweenLines * (_currentLine - 1), 
                        _initPosition.z);
                }
                else
                {
                    transform.localPosition = _initPosition;
                    _currentLine = 1;
                }
            }
            
            transform.localPosition += Vector3.right * (_currentSpeed * Time.fixedDeltaTime);
        }

        public void MoveFeather(float points)
        {
            _currentSpeed += points * _acceleration;
            _currentSpeed = Mathf.Min(_currentSpeed, _maxSpeed);
        }

        private void StopMoving() => _currentSpeed = 0;
        private void ResetPosition()
        {
            transform.localPosition = _initPosition;
            _currentLine = 1;
        }

        private void OnEnable()
        {
            MiniGamesBackButton.OnBackButtonPressed += StopMoving;
            MiniGamesBackButton.OnBackButtonPressed += ResetPosition;
        }

        private void OnDisable()
        {
            MiniGamesBackButton.OnBackButtonPressed -= StopMoving;
            MiniGamesBackButton.OnBackButtonPressed -= ResetPosition;
        }
    }
}