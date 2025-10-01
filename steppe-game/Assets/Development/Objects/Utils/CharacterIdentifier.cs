using UnityEngine;
using UnityEngine.UI;

namespace Development.Objects.Utils
{
    public sealed class CharacterIdentifier : MonoBehaviour
    {
        [SerializeField] private Sprite _boySprite;
        [SerializeField] private Sprite _girlSprite;
        
        private StateManager _stateManager;

        private void Awake()
        {
            _stateManager = FindAnyObjectByType<StateManager>();

            GetComponent<Image>().sprite = _stateManager.CharacterSex == CharacterSex.Boy ? _boySprite : _girlSprite;
        }
    }
}