using System;
using SkiaSharp.Unity;
using UnityEngine;

namespace Development.Objects.BozokGames.Horse
{
    public sealed class PickUpAnimationController : MonoBehaviour
    {
        private SkottiePlayerV2 _skottie;

        public static event Action OnAnimationFinished; 

        private void Awake() => _skottie = GetComponent<SkottiePlayerV2>();

        private void InvokeFinish(string _) => OnAnimationFinished?.Invoke();

        private void OnEnable()
        {
            _skottie.OnAnimationFinished += InvokeFinish;
            _skottie.PlayAnimation();
        }

        private void OnDisable() => _skottie.OnAnimationFinished -= InvokeFinish;
    }
}