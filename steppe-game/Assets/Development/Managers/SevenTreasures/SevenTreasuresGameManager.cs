using Development.Objects.QuickTap;
using Development.Objects.QuickTap.Utils;
using TMPro;
using UnityEngine;

namespace Development.Managers.SevenTreasures
{
    public sealed class SevenTreasuresGameManager : MonoBehaviour
    {
        [Header("Info group text UI")]
        [SerializeField] private TextMeshProUGUI _coinsText;
        [SerializeField] private TextMeshProUGUI _leaderPointsText;
        [Header("Canvases")]
        [SerializeField] private GameObject _endLevelCanvas;
        [SerializeField] private GameObject _nextScreenBraveCanvas;
        [SerializeField] private GameObject _nextScreenWiseCanvas;
        [SerializeField] private GameObject _nextScreenFriskyCanvas;
        [SerializeField] private GameObject _nextScreenTenaciousCanvas;
        [SerializeField] private GameObject _nextScreenSwiftFootedCanvas;
        [SerializeField] private GameObject _nextScreenAccurateCanvas;
        [SerializeField] private GameObject _nextScreenSharpCanvas;

        [Header("GameObjects")] 
        [SerializeField] private GameObject _backButton;
        [SerializeField] private GameObject _tenaciousGameplayView;
        
        private CurrentGame _currentGame;
        private StateManager _stateManager;

        private void Awake() => _stateManager = FindAnyObjectByType<StateManager>();

        public void ChangeCurrentGame(string currentGame)
        {
            switch (currentGame)
            {
                case "Brave":
                    _currentGame = CurrentGame.Brave;
                    break;
                case "Wise":
                    _currentGame = CurrentGame.Wise;
                    break;
                case "Frisky":
                    _currentGame = CurrentGame.Frisky;
                    break;
                case "Tenacious":
                    _currentGame = CurrentGame.Tenacious;
                    break;
                case "SwiftFooted":
                    _currentGame = CurrentGame.SwiftFooted;
                    break;
                case "Accurate":
                    _currentGame = CurrentGame.Accurate;
                    break;
                case "Sharp":
                    _currentGame = CurrentGame.Sharp;
                    break;
                default:
                    Debug.Log("Incorrect received game name");
                    break;
            }
        }

        private void SetActiveOnNextScreen() => SetActiveNextScreen(true);
        private void SetActiveOffNextScreen() => SetActiveNextScreen(false);

        private void SetActiveNextScreen(bool isActivated)
        {
            switch (_currentGame)
            {
                case CurrentGame.Brave:
                    _nextScreenBraveCanvas.SetActive(isActivated);
                    break;
                case CurrentGame.Wise:
                    _nextScreenWiseCanvas.SetActive(isActivated);
                    break;
                case CurrentGame.Frisky:
                    _nextScreenFriskyCanvas.SetActive(isActivated);
                    break;
                case CurrentGame.Tenacious:
                    _nextScreenTenaciousCanvas.SetActive(isActivated);
                    _tenaciousGameplayView.SetActive(false);
                    SetBackButtonActiveOff();
                    break;
                case CurrentGame.SwiftFooted:
                    _nextScreenSwiftFootedCanvas.SetActive(isActivated);
                    break;
                case CurrentGame.Accurate:
                    _nextScreenAccurateCanvas.SetActive(isActivated);
                    break;
                case CurrentGame.Sharp:
                    _nextScreenSharpCanvas.SetActive(isActivated);
                    break;
            }
        }

        public void GiveFinalPoints()
        {
            _coinsText.text = "4 тиын";
            _leaderPointsText.text = "60 ұпай";
            _stateManager.CurrencyAmount += 4;
            _stateManager.PointsAmount += 60;
            _stateManager.ExperienceAmount += 80;
        }
        
        private void TurnOnEndLevelCanvas() => _endLevelCanvas.SetActive(true);

        private void SetBackButtonActiveOn() => _backButton.SetActive(true);
        private void SetBackButtonActiveOff() => _backButton.SetActive(false);

        private void OnEnable()
        {
            FillingImage.OnFieldFilled += SetActiveOnNextScreen;
            FillingImage.OnFieldFilled += GiveFinalPoints;
            MiniGamesBackButton.OnBackButtonPressed += SetActiveOffNextScreen;
            AimController.OnAimReachedTarget += SetActiveOnNextScreen;
            ShortLivedObject.OnAnimationEnded += SetBackButtonActiveOn;
            SFAnimationController.OnAnimFinished += SetBackButtonActiveOn;
        }

        private void OnDisable()
        {
            FillingImage.OnFieldFilled -= SetActiveOnNextScreen;
            FillingImage.OnFieldFilled -= GiveFinalPoints;
            MiniGamesBackButton.OnBackButtonPressed -= SetActiveOffNextScreen;
            AimController.OnAimReachedTarget -= SetActiveOnNextScreen;
            ShortLivedObject.OnAnimationEnded -= SetBackButtonActiveOn;
            SFAnimationController.OnAnimFinished -= SetBackButtonActiveOn;
        }
    }
}