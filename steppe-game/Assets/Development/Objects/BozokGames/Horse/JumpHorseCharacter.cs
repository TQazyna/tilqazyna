using UnityEngine;
using UnityEngine.UI;

namespace Development.Objects.BozokGames.Horse
{
    public sealed class JumpHorseCharacter : MonoBehaviour
    {
        private StateManager _stateManager;
        private CharacterSex _characterSex;
        
        [SerializeField] private Sprite _boySprite;
        [SerializeField] private Sprite _girlSprite;

        private void Awake()
        {
            _stateManager = FindAnyObjectByType<StateManager>();
            _characterSex = _stateManager.CharacterSex;

            if (_characterSex == CharacterSex.Boy)
            {
                GetComponent<Image>().sprite = _boySprite;
            }
            else
            {
                GetComponent<Image>().sprite = _girlSprite;
            }
        }
    }
}