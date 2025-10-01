using System;
using UnityEngine;

namespace Development.Objects.Utils
{
    public sealed class ObjectsActivatorOnEnable : MonoBehaviour
    {
        [SerializeField] private GameObject[] _gameObjects;
        private void OnEnable()
        {
            foreach (GameObject gameObject in _gameObjects)
            {
                gameObject.SetActive(true);
            }
        }
    }
}