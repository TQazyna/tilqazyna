using SkiaSharp.Unity;
using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class SplashController : MonoBehaviour
    {
        [SerializeField] private RectTransform _ladle;
        private Vector3 _ladleInitPosition;
        private SkottiePlayerV2 _skottie;
        private bool _isAlreadyPlayed;

        private void Awake() => _skottie = GetComponent<SkottiePlayerV2>();

        private void Update()
        {
            if (_ladle.localPosition.y < _ladleInitPosition.y && !_isAlreadyPlayed)
            {
                _skottie.PlayAnimation();
                _isAlreadyPlayed = true;
            }
            else if(_ladle.localPosition.y >= _ladleInitPosition.y)
            {
                _isAlreadyPlayed = false;
            }
        }

        public void ChangeLadleInitPosition(Vector3 pos) => _ladleInitPosition = pos;
    }
}