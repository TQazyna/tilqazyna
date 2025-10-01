using UnityEngine;

namespace Development.Objects.Utils
{
    public sealed class SelfDeactivatorOnDisable : MonoBehaviour
    {
        private void OnDisable() => gameObject.SetActive(false);
    }
}