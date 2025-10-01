using System;
using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class MiniGamesBackButton : MonoBehaviour
    {
        public static event Action OnBackButtonPressed;

        public void InvokeOnBackButtonPressed() => OnBackButtonPressed?.Invoke();
    }
}