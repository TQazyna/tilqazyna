using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class DogMovement : MonoBehaviour
    {
        [SerializeField] private Transform _target;
        [SerializeField, Range(0, 1000)] private float _maxSpeed;
        [SerializeField, Range(-100, 0)] private float _maxBackSpeed;
        [SerializeField, Range(0, 100)] private float _acceleration;
        [SerializeField, Range(0, 100)] private float _deceleration;
        
        [SerializeField, Range(0, 1000)] private float minDistanceToTarget;
        private float _maxDistanceToTarget;
        private float _currentSpeed;
        private Vector3 _targetPosition;
        private float _distanceToTarget;

        private Vector3 _initPosition;

        private void Awake()
        {
            _targetPosition = _target.position;
            _maxDistanceToTarget = Vector3.Distance(transform.position, _targetPosition);
            _initPosition = transform.position;
        }

        private void FixedUpdate()
        {
            _currentSpeed -= _deceleration * Time.fixedDeltaTime;
            _currentSpeed = Mathf.Max(_currentSpeed, _maxBackSpeed);

            _distanceToTarget = Vector3.Distance(transform.position, _targetPosition);

            if (_distanceToTarget >= _maxDistanceToTarget && _currentSpeed < 0)
            {
                _currentSpeed = 0;
            }

            float approachModifier =
                Mathf.Clamp01((_distanceToTarget - minDistanceToTarget) / (_maxDistanceToTarget - minDistanceToTarget));

            Vector3 directionToTarget = (_targetPosition - transform.position).normalized;

            if (_currentSpeed > 0)
            {
                transform.position += directionToTarget * (_currentSpeed * approachModifier) * Time.fixedDeltaTime;
            }
            else
            {
                transform.position += directionToTarget * _currentSpeed * Time.fixedDeltaTime;
            }
        }

        public void MoveDog(float points)
        {
            _currentSpeed += points * _acceleration;
            _currentSpeed = Mathf.Min(_currentSpeed, _maxSpeed);
        }

        private void StopMoving() => _currentSpeed = 0;
        private void ResetPosition() => transform.position = _initPosition;

        private void OnEnable() => MiniGamesBackButton.OnBackButtonPressed += StopMoving;
        private void OnDisable()
        {
            MiniGamesBackButton.OnBackButtonPressed -= StopMoving;
            ResetPosition();
        }
    }
}