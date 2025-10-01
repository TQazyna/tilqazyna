using System;
using UnityEngine;

namespace Development.Objects.Utils
{
    public sealed class SelfDeactivatorOnAwake : MonoBehaviour
    {
        private void Awake() => gameObject.SetActive(false);
    }
}