using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class SwordMovement : MonoBehaviour
    {
        [SerializeField, Range(0, 360)] private float _swingAngle;
        [SerializeField] private Transform _referencePivotPoint;
        private Vector3 _pivotPoint;
        [SerializeField] private Vector2 _pivotOffset;
        [SerializeField, Range(0, 100)] private float _maxSpeed;
        [SerializeField, Range(0, 10)] private float _acceleration;
        [SerializeField, Range(0, 10)] private float _deceleration;

        private float _currentSpeed;
        private float _currentAngle;
        private int _direction = 1;

        private void Awake()
        {
            _pivotPoint = new Vector3(
                _referencePivotPoint.position.x + _pivotOffset.x,
                _referencePivotPoint.position.y + _pivotOffset.y,
                _referencePivotPoint.position.z);
        }

        private void FixedUpdate()
        {
            if (_currentSpeed > 0)
            {
                _currentSpeed -= _deceleration * Time.fixedDeltaTime;
                _currentSpeed = Mathf.Max(_currentSpeed, 0f);

                float rotationStep = _currentSpeed * Time.fixedDeltaTime * 360 * _direction;

                _currentAngle += rotationStep;
                
                if (_currentAngle >= 0)
                {
                    _currentAngle = 0;
                    _direction = -1;
                }
                else if (_currentAngle <= -_swingAngle)
                {
                    _currentAngle = -_swingAngle;
                    _direction = 1;
                }

                transform.RotateAround(_pivotPoint, Vector3.forward, rotationStep);
            }
        }

        public void SwingSword(float points)
        {
            _currentSpeed += points * _acceleration;
            _currentSpeed = Mathf.Min(_currentSpeed, _maxSpeed);
        }

        void StopMoving() => _currentSpeed = 0;
        private void OnEnable() => MiniGamesBackButton.OnBackButtonPressed += StopMoving;
        private void OnDisable() => MiniGamesBackButton.OnBackButtonPressed -= StopMoving;
    }
}