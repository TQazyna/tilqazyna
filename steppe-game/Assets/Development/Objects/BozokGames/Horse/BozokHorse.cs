using Development.Objects.QuickTap;
using UnityEngine;

namespace Development.Objects.BozokGames.Horse
{
    public sealed class BozokHorse : MonoBehaviour
    {
        [SerializeField] private GameObject _idleObject;
        [SerializeField] private GameObject _pickUpObject;

        private BoxCollider2D _collider;

        private void Awake()
        {
            _collider = GetComponent<BoxCollider2D>();
            _collider.enabled = false;
        }

        public void PickUpCoin()
        {
            _idleObject.SetActive(false);
            _pickUpObject.SetActive(true);
            _collider.enabled = true;
        }
        
        public void ResetHorse()
        {
            _idleObject.SetActive(true);
            _pickUpObject.SetActive(false);
            _collider.enabled = false;
        }

        private void OnEnable()
        {
            MiniGamesBackButton.OnBackButtonPressed += ResetHorse;
            PickUpAnimationController.OnAnimationFinished += ResetHorse;
        }

        private void OnDisable()
        {
            MiniGamesBackButton.OnBackButtonPressed -= ResetHorse;
            PickUpAnimationController.OnAnimationFinished -= ResetHorse;
        }
    }
}