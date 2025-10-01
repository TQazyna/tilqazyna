using Development.Managers.Bozok.BoneGame;
using UnityEngine;
using UnityEngine.UI;

namespace Development.Objects.BozokGames.BowGame
{
    public class Target : MonoBehaviour
    {
        [SerializeField] private Button _selfButton;
        private RectTransform _rectTransform;
        private Vector2 _initPosition;
        
        private void Awake()
        {
            _rectTransform = GetComponent<RectTransform>();
            _initPosition = _rectTransform.anchoredPosition;
        }

        private void ReturnToStartPosition() => _rectTransform.anchoredPosition = _initPosition;

        //private void OnCollisionEnter2D(Collision2D other) => _selfButton.onClick.Invoke();

        private void OnTriggerEnter2D(Collider2D other)
        {
            Debug.Log("TouchedArrow");
            _selfButton.onClick.Invoke();
        }

        private void OnEnable() => Bone.OnReturn += ReturnToStartPosition;

        private void OnDisable() => Bone.OnReturn -= ReturnToStartPosition;
    }
}