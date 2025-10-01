using System;
using Development.Managers.Bozok.HorseGame;
using Development.Objects.QuickTap;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Development.Managers.Bozok
{
    public sealed class BozokGameManager : MonoBehaviour
    {
        [SerializeField] private GameObject _tazyObject;

        public static event Action OnBackToMap;
        public static event Action OnBackToBozokMap;

        [SerializeField] private GameObject _endLevelCanvas;
        [SerializeField] private GameObject _endLevelWinTextObject;
        [SerializeField] private TextMeshProUGUI _endLevelWinText;
        [SerializeField] private GameObject _winScreenBallCanvas;
        [SerializeField] private GameObject _winScreenHorseCanvas;
        [SerializeField] private GameObject _winScreenBowCanvas;
        [SerializeField] private GameObject _winScreenBoneCanvas;
        [SerializeField] private TextMeshProUGUI _tazyText;
        private CurrentGame _currentGame;

        [Header("Stars Objects")]
        [SerializeField] private GameObject _oneStarGroup;
        [SerializeField] private GameObject _twoStarGroup;
        [SerializeField] private GameObject _threeStarGroup;

        [Header("Game win checks Objects")]
        [SerializeField] private GameObject _ballCheck;
        [SerializeField] private GameObject _horseCheck;
        [SerializeField] private GameObject _bowCheck;
        [SerializeField] private GameObject _boneCheck;

        [Header("Game Managers")]
        [SerializeField] private HorseGameManager _horseManager;
        [SerializeField] private BozokShootingGameManager _ballManager;
        [SerializeField] private BozokShootingGameManager _bowManager;
        [SerializeField] private BozokBoneShootingGameManager _boneManager;

        [SerializeField] private Button _backButton;

        private StateManager _stateManager;
        private SoundManager _soundManager;
        private HUDManager _hudManager;

        private void Awake()
        {
            _stateManager = FindAnyObjectByType<StateManager>();
            _soundManager = FindAnyObjectByType<SoundManager>();
            _hudManager = FindAnyObjectByType<HUDManager>();
        }

        // public void Initialize(StateManager stateManager, HUDManager hudManager)
        // {
        //     _stateManager = stateManager;
        //     _hudManager = hudManager;
        // }

        public void ChangeCurrentGame(string currentGame)
        {
            _hudManager.SetUpperRightGroupWithLeaderboardActive(false);

            _tazyObject.SetActive(false);

            _soundManager.StopVoice();

            switch (currentGame)
            {
                case "Ball":
                    _currentGame = CurrentGame.Ball;
                    _soundManager.PlayBozokGameAudio(1);
                    _ballManager.StartNewGame();
                    break;
                case "Horse":
                    Debug.Log("CurrentGame.Horse");
                    _currentGame = CurrentGame.Horse;
                    _soundManager.PlayBozokGameAudio(4);
                    _horseManager.StartNewGame();
                    break;
                case "Bow":
                    _currentGame = CurrentGame.Bow;
                    _soundManager.PlayBozokGameAudio(3);
                    _bowManager.StartNewGame();
                    break;
                case "Bone":
                    _currentGame = CurrentGame.Bone;
                    _soundManager.PlayBozokGameAudio(2);
                    _boneManager.StartNewGame();
                    break;
                default:
                    Debug.Log("Incorrect received game name");
                    break;
            }
        }

        private void SetActiveOnWinScreen() => SetActiveWinScreen(true);
        private void SetActiveOffWinScreen()
        {
            _hudManager.SetUpperRightGroupWithLeaderboardActive(true);

            SetActiveWinScreen(false);
        }

        private void SetActiveWinScreen(bool isActivated)
        {
            switch (_currentGame)
            {
                case CurrentGame.Ball:
                    //_winScreenBallCanvas.SetActive(isActivated);
                    break;
                case CurrentGame.Horse:
                    //_winScreenHorseCanvas.SetActive(isActivated);
                    // _horseManager.StartNewGame();
                    break;
                case CurrentGame.Bow:
                    //_winScreenBowCanvas.SetActive(isActivated);
                    break;
                case CurrentGame.Bone:
                    //_winScreenBoneCanvas.SetActive(isActivated);
                    break;
            }
        }

        private void SetFailScreenStarsOn(int starCount)
        {
            _oneStarGroup.SetActive(false);
            _twoStarGroup.SetActive(false);
            _threeStarGroup.SetActive(false);

            switch (starCount)
            {
                case 1:
                    _oneStarGroup.SetActive(true);
                    break;
                case 2:
                    _twoStarGroup.SetActive(true);
                    break;
                case 3:
                    _threeStarGroup.SetActive(true);
                    break;
            }
        }

        private void TurnOnEndLevelCanvas(bool winTextActive)
        {
            _endLevelCanvas.SetActive(true);

            if (winTextActive)
            {
                if (_currentGame == CurrentGame.Bone)
                {
                    _endLevelWinText.text = "Тамаша! Білімді әрі шебер екенсің! Тәнті болдым!";
                }
                else
                {
                    _endLevelWinText.text = "Тамаша! Білімді әрі шебер екенсің! Тәнті болдым!";
                }

                _endLevelWinTextObject.SetActive(true);
            }
        }

        private void TurnOffEndLevelCanvas()
        {
            _endLevelCanvas.SetActive(false);
            _endLevelWinTextObject.SetActive(false);
        }

        private void OnEnable()
        {
            //FillingImage.OnFieldFilled += SetActiveOnWinScreen;
            MiniGamesBackButton.OnBackButtonPressed += SetActiveOffWinScreen;
            BozokQuizManager.OnEndQuiz += TurnOnEndLevelCanvas;
            BozokQuizManager.OnStarAppear += SetFailScreenStarsOn;
            BozokQuizManager.GameCompleted += OnGameCompletion;

            if (_stateManager != null)
            {
                CheckGameCompletion();
            }

            if (_stateManager.BozokBallGameComplete && _stateManager.BozokBoneGameComplete && _stateManager.BozokBowGameComplete && _stateManager.BozokHorseGameComplete)
            {
                _tazyText.text = "Бәрекелді! Ойынның бәрінде жеңіп шықтың!";
            }
            else
            {
                _tazyText.text = "Қандай қызық ойындар барын қарашы! Кел, ұлттық ойындар ойнайық!";

                _soundManager.PlayTazyChooseGameAudio();
            }
        }

        private void OnDisable()
        {
            //FillingImage.OnFieldFilled -= SetActiveOnWinScreen;
            MiniGamesBackButton.OnBackButtonPressed += SetActiveOffWinScreen;
            BozokQuizManager.OnEndQuiz -= TurnOnEndLevelCanvas;
            BozokQuizManager.OnStarAppear -= SetFailScreenStarsOn;
            BozokQuizManager.GameCompleted -= OnGameCompletion;
        }

        private void CheckGameCompletion()
        {
            if (_stateManager.BozokBallGameComplete)
            {
                _ballCheck.SetActive(true);
            }

            if (_stateManager.BozokHorseGameComplete)
            {
                _horseCheck.SetActive(true);
            }

            if (_stateManager.BozokBowGameComplete)
            {
                _bowCheck.SetActive(true);
            }

            if (_stateManager.BozokBoneGameComplete)
            {
                _boneCheck.SetActive(true);
            }
        }

        private void OnGameCompletion()
        {
            switch (_currentGame)
            {
                case CurrentGame.Ball:
                    _stateManager.BozokBallGameComplete = true;
                    break;
                case CurrentGame.Horse:
                    _stateManager.BozokHorseGameComplete = true;
                    break;
                case CurrentGame.Bow:
                    _stateManager.BozokBowGameComplete = true;
                    break;
                case CurrentGame.Bone:
                    _stateManager.BozokBoneGameComplete = true;
                    break;
                default:
                    Debug.Log("Incorrect received game name");
                    break;
            }
        }

        public void OnBackToMapTap()
        {
            _hudManager.SetUpperRightGroupWithLeaderboardActive(true);

            SetActiveOffWinScreen();
            TurnOffEndLevelCanvas();

            _backButton.onClick.Invoke();

            OnBackToMap?.Invoke();

            _soundManager.StopVoice();
            _soundManager.StopEffects();
        }

        public void StopAudio()
        {
            _soundManager.StopVoice();
            _soundManager.StopEffects();
        }

        public void OnBackToBozokMapTap()
        {
            _hudManager.SetUpperRightGroupWithLeaderboardActive(true);

            SetActiveOffWinScreen();
            TurnOffEndLevelCanvas();

            OnBackToBozokMap?.Invoke();

            _soundManager.StopVoice();
            _soundManager.StopEffects();

            _backButton.onClick.Invoke();
        }
    }
}