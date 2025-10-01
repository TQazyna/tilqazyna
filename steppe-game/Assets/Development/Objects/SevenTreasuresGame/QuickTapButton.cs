using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class QuickTapButton : MonoBehaviour
    {
        private FillingImage _fillingImage;
        [SerializeField, Range(0, 100)] private int _imageFillingPower;

        private void Awake() => _fillingImage = FindFirstObjectByType<FillingImage>();

        public void ChangeImageFill() => _fillingImage.ChangeImageFill(_imageFillingPower);
    }
}