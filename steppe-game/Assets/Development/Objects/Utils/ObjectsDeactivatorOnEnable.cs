using UnityEngine;

namespace Development.Objects.Utils
{
    public sealed class ObjectsDeactivatorOnEnable : MonoBehaviour
    {
        [SerializeField] private GameObject[] _gameObjects;
        private void OnEnable()
        {
            foreach (GameObject gameObject in _gameObjects)
            {
                gameObject.SetActive(false);
            }
        }
    }
}