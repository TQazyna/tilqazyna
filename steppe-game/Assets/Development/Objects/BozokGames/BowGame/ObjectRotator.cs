using UnityEngine;

namespace Development.Objects.BozokGames.BowGame
{
    public sealed class ObjectRotator : MonoBehaviour
    {
        private StateManager _stateManager;
        private Quaternion _initRotation;
        private RectTransform _rectTransform;

        [SerializeField] private bool _isNotACharacter;
        
        private void Start()
        {
            _stateManager = FindAnyObjectByType<StateManager>();
            _rectTransform = GetComponent<RectTransform>();
            _initRotation = transform.rotation;
        }

        private void RotateSelf(byte k) =>
            _rectTransform.rotation = _stateManager.CharacterSex == CharacterSex.Boy || _isNotACharacter
                ? Quaternion.Euler(0, (_initRotation.eulerAngles.y + 180) * k, 0)
                : Quaternion.Euler(0, (_initRotation.eulerAngles.y) + (180*k), 0);

        public void ResetRotation()
        {
            if (!_rectTransform) return;
            _rectTransform.rotation =
                _stateManager.CharacterSex == CharacterSex.Boy || _isNotACharacter
                    ? Quaternion.identity
                    : Quaternion.Euler(0, 180, 0);
        }

        private void OnEnable()
        {
            Arrow.OnRotate += RotateSelf;
            Arrow.OnReturn += ResetRotation;
        }

        private void OnDisable()
        {
            ResetRotation();
            Arrow.OnRotate -= RotateSelf;
            Arrow.OnReturn -= ResetRotation;
        }
    }
}