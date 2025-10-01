using System.Collections;
using UnityEngine;

namespace Development.Objects.Utils
{
    public sealed class OnEnableActionControllerWithTimer : OnEnableActionController
    {
        [SerializeField] private float _secsToWait = 5;
        private Coroutine _objectTimerCoroutine; 
        protected override void OnEnable() => StartTimer();

        private void OnDisable() => StopCoroutine(_objectTimerCoroutine);
        
        private void StartTimer() => _objectTimerCoroutine = StartCoroutine(ObjectTimer());

        private IEnumerator ObjectTimer()
        {
            yield return new WaitForSeconds(_secsToWait); 
            RaiseOnEnableAction();
        }
    }
}