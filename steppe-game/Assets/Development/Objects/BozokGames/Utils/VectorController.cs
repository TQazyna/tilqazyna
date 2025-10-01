using System;
using Development.Objects.BozokGames.BowGame;
using UnityEngine;

namespace Development.Objects.BozokGames.Utils
{
    public sealed class VectorController : MonoBehaviour
    {
        private RectTransform _rectTransform;
        
        private void Awake() => _rectTransform = GetComponent<RectTransform>();

        private void Rotate(float angle) => _rectTransform.rotation = Quaternion.Euler(0, 0, angle+7);
        
        private void OnEnable() => Arrow.OnRotateAngle += Rotate;

        private void OnDisable() => Arrow.OnRotateAngle -= Rotate;
    }
}