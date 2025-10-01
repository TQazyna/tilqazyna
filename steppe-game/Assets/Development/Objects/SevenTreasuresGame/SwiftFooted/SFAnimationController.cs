using System;
using SkiaSharp.Unity;
using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class SFAnimationController : MonoBehaviour
    {
        private SkottiePlayerV2 _skottie;
        [SerializeField] private GameObject _winScreen;

        public static event Action OnAnimFinished;

        private void Awake() => _skottie = GetComponent<SkottiePlayerV2>();

        private void OnAnimationFinishedHandler(string arg0) => OnAnimationFinishedHandler();
        private void OnAnimationFinishedHandler()
        {
            OnAnimFinished?.Invoke();
            _winScreen.SetActive(true);
        }

        private void OnEnable()
        {
            _skottie.PlayAnimation();
            _skottie.OnAnimationFinished += OnAnimationFinishedHandler;
        }


        private void OnDisable()
        {
            _skottie.OnAnimationFinished -= OnAnimationFinishedHandler;
        }
    }
}