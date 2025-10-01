using System.Collections;
using UnityEngine;

namespace Development.Objects.Utils
{
    public sealed class StartObjectsTimerOnEnable : MonoBehaviour
    {
        [SerializeField] private GameObject[] _objects;
        [SerializeField] private float _secsToWait = 2;
        private Coroutine _objectTimerCoroutine; 

        private void StartObjectTimer() => _objectTimerCoroutine = StartCoroutine(ObjectTimer());

        private IEnumerator ObjectTimer()
        {
            yield return new WaitForSeconds(_secsToWait);
            foreach (GameObject obj in _objects)
            {
                obj.SetActive(true);
            }
        }
        
        private void OnEnable() => StartObjectTimer();

        private void OnDisable() => StopCoroutine(_objectTimerCoroutine);
    }
}