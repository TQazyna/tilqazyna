using UnityEngine;
using UnityEngine.UI;

namespace Development.Managers.Bozok.BoneGame
{
    public sealed class BoneNonInteractable : MonoBehaviour
    {
        [SerializeField] private float _deceleration = 2f;

        [SerializeField] private Button _selfButton;
        private RectTransform _rectTransform;
        private Vector2 _initPosition;

        private Vector2 _velocity;
        private bool _isFlying;

        private RectTransform _startBoneRectTransform;
        private Vector2 _startBoneInitPosition;

        private void Awake()
        {
            _startBoneRectTransform = GameObject.FindWithTag("BozokStartBone").GetComponent<RectTransform>();
            _startBoneInitPosition = _startBoneRectTransform.anchoredPosition;
            _rectTransform = GetComponent<RectTransform>();
            _initPosition = _rectTransform.anchoredPosition;
        }

        public void Launch(Vector2 direction, float speed)
        {
            _velocity = direction.normalized * speed;
            _isFlying = true;
        }

        private void Update()
        {
            if (_isFlying)
            {
                _rectTransform.anchoredPosition += _velocity * Time.deltaTime;
                _velocity = Vector2.Lerp(_velocity, Vector2.zero, _deceleration * Time.deltaTime);
            }

            if (_startBoneRectTransform.anchoredPosition == _startBoneInitPosition)
            {
                ResetObject();
            }
        }

        public void ResetObject()
        {
            _velocity = Vector2.zero;
            _rectTransform.anchoredPosition = _initPosition;
        }

        private void OnCollisionEnter2D(Collision2D other) => _selfButton.onClick.Invoke();

        private void OnEnable() => Bone.OnReturn += ResetObject;

        private void OnDisable() => Bone.OnReturn -= ResetObject;
    }
}