using SkiaSharp.Unity;
using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class AnimationStarterOnEnable : MonoBehaviour
    {
        private SkottiePlayerV2 _skottie;

        private void Awake() => _skottie = GetComponent<SkottiePlayerV2>();

        private void OnEnable() => _skottie.PlayAnimation();
    }
}