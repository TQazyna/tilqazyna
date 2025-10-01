using System;
using System.Collections;
using JetBrains.Annotations;
using SkiaSharp.Unity;
using UnityEngine;

namespace Development.Objects.QuickTap.Utils
{
    public sealed class ShortLivedObject : MonoBehaviour
    {
        [SerializeField] [CanBeNull] private GameObject _next;
        [SerializeField] private float _liveSeconds;
        [SerializeField] private bool _isNeedDeactivate = true;
        private SkottiePlayerV2 _skottie;

        public static event Action OnAnimationEnded;
        public static event Action OnLifeEnded;

        private void Awake() => TryGetComponent(out _skottie);

        private IEnumerator Live()
        {
            yield return new WaitForSeconds(_liveSeconds);
            EndLife();
            OnLifeEnded?.Invoke();
        }

        private void ActivateNextDeactivateSelfIfNeed(string arg0)
        {
            EndLife();
            OnAnimationEnded?.Invoke();
        }

        private void EndLife()
        {
            if (_next) _next.SetActive(true);
            OnLifeEnded?.Invoke();
            if (_isNeedDeactivate)
            {
                gameObject.SetActive(false);
            }
        }
        
        private void OnEnable()
        {
            if (_skottie) _skottie.OnAnimationFinished += ActivateNextDeactivateSelfIfNeed;
            else StartCoroutine(Live());
        }


        private void OnDisable()
        {
            if (_skottie) _skottie.OnAnimationFinished -= ActivateNextDeactivateSelfIfNeed;
            StopAllCoroutines();
        }
    }
}