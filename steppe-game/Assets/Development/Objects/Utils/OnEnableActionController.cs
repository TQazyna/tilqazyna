using System;
using UnityEngine;

namespace Development.Objects.Utils
{
    public class OnEnableActionController : MonoBehaviour
    {
        public event Action OnEnableAction;
        protected virtual void OnEnable() => RaiseOnEnableAction();
        protected void RaiseOnEnableAction() => OnEnableAction?.Invoke();
    }
}