using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Development.Managers.AlmatyMuseum.AltynAdamManager
{
    public sealed class AltynAdamManager : MonoBehaviour
    {
        [Header("Info group text UI")]
        [SerializeField] private TextMeshProUGUI _coinsText;
        [SerializeField] private TextMeshProUGUI _leaderPointsText;
        [Header("Canvases")] 
        [SerializeField] private GameObject _endLevelCanvas;
        private StateManager _stateManager;

        [Header("Game objects")] 
        [SerializeField] private GameObject _darknedBackground;
        [SerializeField] private Button[] _buttons;
        [SerializeField] private GameObject _mainTazy;
        [SerializeField] private GameObject[] _tazys;
        [SerializeField] private GameObject[] _dressedObjects;
        [SerializeField] private GameObject[] _notDressedObjects;
        [SerializeField] private GameObject[] _notDressedArrows;
        [SerializeField] private GameObject _continueButton;
        [SerializeField] private GameObject _lastTazyScreen;

        private int _partCounter;

        private void Awake()
        {
            _stateManager = FindAnyObjectByType<StateManager>();
            SceneResetter();
        }

        public void GiveFinalPoints()
        {
            _coinsText.text = "4 тиын";
            _leaderPointsText.text = "60 ұпай";
            _stateManager.CurrencyAmount += 4;
            _stateManager.PointsAmount += 60;
            _stateManager.ExperienceAmount += 80;
        }

        public void TurnOnEndLevelCanvas() => _endLevelCanvas.SetActive(true);
        public void TurnOffEndLevelCanvas() => _endLevelCanvas.SetActive(false);

        public void SceneResetter()
        {
            _partCounter = 0;
            _darknedBackground.SetActive(true);
            SetObjectsActive(_notDressedArrows, false);
            _mainTazy.SetActive(true);
            TazyResetter();
            SetButtonsInteractable(false);
            SetObjectsActive(_dressedObjects, true);
            SetObjectsActive(_notDressedObjects, false);
            _continueButton.SetActive(false);
            _lastTazyScreen.SetActive(false);
        }

        public void TazyResetter() => SetObjectsActive(_tazys, false);

        public void HideDressedAndRevealNotDressedObjects()
        {
            SetObjectsActive(_dressedObjects, false);
            SetObjectsActive(_notDressedObjects, true);
        }

        private void SetObjectsActive(GameObject[] gameObjects, bool isActive)
        {
            foreach (GameObject go in gameObjects) 
                go.SetActive(isActive);
        }

        public void HideArrows() => SetObjectsActive(_notDressedArrows, false);
        
        public void SetButtonsInteractable(bool isActive)
        {
            foreach (Button button in _buttons) 
                button.interactable = isActive;
        }
        
        public void AddAndCheckPartCount()
        {
            _partCounter++;
            if (_partCounter == 4) _continueButton.SetActive(true);
        }

        private void OnDisable() => SceneResetter();
    }
}