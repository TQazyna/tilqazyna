using System;
using UnityEngine;
using UnityEngine.EventSystems;

namespace Development.Objects.QuickTap
{
    public sealed class AimController : MonoBehaviour, IDragHandler
    {
        private RectTransform _rectTransform;
        private Vector2 _initPosition;
        
        public static event Action OnAimReachedTarget;
        
        private void Awake()
        {
            _rectTransform = GetComponent<RectTransform>();
            _initPosition = _rectTransform.anchoredPosition;
        }
        
        public void OnDrag(PointerEventData eventData)
        {
            RectTransformUtility.ScreenPointToLocalPointInRectangle(
                _rectTransform.parent as RectTransform,
                eventData.position,
                eventData.pressEventCamera,
                out Vector2 localPoint
            );
            _rectTransform.anchoredPosition = localPoint;
        }

        private void ResetPosition() => _rectTransform.anchoredPosition = _initPosition;

        private void OnDisable() => ResetPosition();

        private void OnTriggerEnter2D(Collider2D other)
        {
            OnAimReachedTarget?.Invoke();
            ResetPosition();
        }
    }
}