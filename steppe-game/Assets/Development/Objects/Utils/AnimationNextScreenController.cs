using SkiaSharp.Unity;
using UnityEngine;

namespace Development.Objects.Utils
{
    public sealed class AnimationNextScreenController : MonoBehaviour
    {
        private SkottiePlayerV2 _skottie;
        [SerializeField] private GameObject _nextScreen;
        
        private void Awake() => _skottie = GetComponent<SkottiePlayerV2>();
        private void OnAnimationFinishedHandler(string arg0) => OnAnimationFinishedHandler();
        private void OnAnimationFinishedHandler() => _nextScreen.SetActive(true);
        private void OnEnable() => _skottie.OnAnimationFinished += OnAnimationFinishedHandler;
        private void OnDisable() => _skottie.OnAnimationFinished -= OnAnimationFinishedHandler;
    }
}