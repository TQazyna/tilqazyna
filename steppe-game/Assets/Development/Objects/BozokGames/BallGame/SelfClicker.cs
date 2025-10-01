using UnityEngine;
using UnityEngine.UI;

namespace Development.Objects.BozokGames.BallGame
{
    public sealed class SelfClicker : MonoBehaviour
    {
        private void OnTriggerEnter2D(Collider2D other) => GetComponent<Button>().onClick?.Invoke();
    }
}