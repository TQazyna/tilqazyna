using UnityEngine;

namespace Development.Objects.BozokGames.Horse
{
    public sealed class HorseCharacter : MonoBehaviour
    {
        private StateManager _stateManager;
        private CharacterSex _characterSex;

        [SerializeField] private GameObject _boy;
        [SerializeField] private GameObject _girl;

        private void OnEnable()
        {
            _stateManager = FindAnyObjectByType<StateManager>();
            _characterSex = _stateManager.CharacterSex;

            if (_characterSex == CharacterSex.Boy)
            {
                _boy.SetActive(true);
                _girl.SetActive(false);
            }
            else
            {
                _girl.SetActive(true);
                _boy.SetActive(false);
            }
        }
    }
}