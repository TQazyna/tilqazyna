using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class RifleMovement : MonoBehaviour
    {
        [SerializeField] private Transform _target;
        [SerializeField] private Transform _pivotPoint;
        [SerializeField, Range(0, 90)] private float _maxRotationAngle;
        [SerializeField, Range(0, 90)] private float _rotationStep = 10f;
        [SerializeField, Range(0, 10)] private float _backRotationSpeed;

        private float _currentSpeed;
        private float _currentAngle;
        private float _rotationModifier;

        private void Awake() => _currentAngle = transform.eulerAngles.z;

        private void FixedUpdate()
        {
            float rotationCalc = _rotationStep * _currentSpeed * Time.deltaTime;
            if (_currentAngle < _maxRotationAngle)
            {
                transform.RotateAround(_pivotPoint.position, Vector3.forward, rotationCalc);
                _currentAngle = transform.rotation.z;
                _currentSpeed = _backRotationSpeed;
            }
            else
            {
                _currentSpeed = 0;
            }

            _currentAngle = transform.eulerAngles.z;
        }

        public void MoveRifle(float adjustment)
        {
            _rotationModifier = Mathf.Clamp01(_currentAngle / _maxRotationAngle * 2);
            float angleToRotate = -adjustment * _rotationModifier;
            transform.RotateAround(_pivotPoint.position, Vector3.forward, angleToRotate);
        }

        private void ResetPosition()
        {
            transform.RotateAround(_pivotPoint.position, Vector3.forward, -_currentAngle);
            _currentAngle = 0;
        }

        private void OnEnable() => MiniGamesBackButton.OnBackButtonPressed += ResetPosition;

        private void OnDisable() => MiniGamesBackButton.OnBackButtonPressed -= ResetPosition;
    }
}