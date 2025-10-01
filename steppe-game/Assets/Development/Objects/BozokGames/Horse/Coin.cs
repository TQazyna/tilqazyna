using System;
using UnityEngine;

namespace Development.Objects.BozokGames.Horse
{
    public sealed class Coin : MonoBehaviour
    {
        public static event Action OnCoinCollected; 
        private void OnTriggerEnter2D(Collider2D other)
        {
            OnCoinCollected?.Invoke();
            Destroy(gameObject);
        }

        private void OnDisable() => Destroy(gameObject);
    }
}