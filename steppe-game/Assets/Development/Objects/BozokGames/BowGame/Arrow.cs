using System;
using System.Collections;
using Development.Managers.Bozok.BoneGame;
using UnityEngine;
using UnityEngine.EventSystems;

namespace Development.Objects.BozokGames.BowGame
{
    public sealed class Arrow : Bone
    {
        private Vector2 _lookDirection;
        
        public static event Action<byte> OnRotate;
        public static event Action OnArrowMoveStarted;
        public static event Action OnArrowReleased;
        public static event Action<float> OnRotateAngle;
        
        protected override void Update()
        {
            if (_isFlying)
            {
                _rectTransform.anchoredPosition += _velocity * Time.deltaTime;

                _velocity = Vector2.Lerp(_velocity, Vector2.zero, _deceleration * Time.deltaTime);
            }
        }

        public override void OnBeginDrag(PointerEventData eventData)
        {
            if (!_canDrag)
            {
                return;
            }
            
            _lookDirection = _rectTransform.anchoredPosition - _initPosition;
            if (_lookDirection.x < 0)
            {
                OnRotate?.Invoke(1);
            }
            else if (_lookDirection.x > 0)
            {
                OnRotate?.Invoke(0);
            }
            
            float angle = Mathf.Atan2(_lookDirection.y, _lookDirection.x) * Mathf.Rad2Deg + 35;
            _rectTransform.rotation = Quaternion.Euler(0, 0, angle);
            OnArrowMoveStarted?.Invoke();
            OnRotateAngle?.Invoke(angle);
        }

        public override void OnDrag(PointerEventData eventData)
        {
            if (!_canDrag)
            {
                return;
            }
            base.OnDrag(eventData);
            _lookDirection = _rectTransform.anchoredPosition - _initPosition;
            if (_lookDirection.x < 0)
            {
                OnRotate?.Invoke(1);
            }
            else if (_lookDirection.x > 0)
            {
                OnRotate?.Invoke(0);
            }
            
            float angle = Mathf.Atan2(_lookDirection.y, _lookDirection.x) * Mathf.Rad2Deg + 35;
            _rectTransform.rotation = Quaternion.Euler(0, 0, angle);
            OnRotateAngle?.Invoke(angle);
        }

        public override void OnEndDrag(PointerEventData eventData)
        {
            if (!_canDrag)
            {
                return;
            }
            base.OnEndDrag(eventData);
            OnArrowReleased?.Invoke();
        }
        
        private void OnTriggerEnter2D(Collider2D other)
        {
            _canDrag = false;
            _velocity = Vector2.zero;
            StopCoroutine(_autoReturnCoroutine);
        }
    }
}