using System;
using UnityEngine;
using UnityEngine.UI;

namespace Development.Objects.Cooking
{
    public class Kumis : MonoBehaviour
    {
        [SerializeField] private Sprite _kumisWithLid;
        [SerializeField] private Sprite _kumisWithoutLid;

        private Image _image;
        
        private void Awake() => _image = GetComponent<Image>();

        public void SetLidOn() => _image.sprite = _kumisWithLid;
        public void SetLidOff() => _image.sprite = _kumisWithoutLid;
    }
}