using Development.Objects.Utils;
using UnityEngine;
using UnityEngine.UI;

namespace Development.Managers.SevenTreasures
{
    public sealed class SevenTreasuresSoundManager : MonoBehaviour
    {
        private AudioSource _audioSource;
        private StateManager _stateManager;
        private SoundManager _soundManager;

        [Header("Brave")]
        [SerializeField] private AudioClip _braveSteppeAmbientAudioClip;
        [SerializeField] private AudioClip _braveVictoryAudioClip;
        [SerializeField] private AudioClip _braveOldmanHelpAudioClip;
        [SerializeField] private AudioClip _braveTapButtonAudioClip;
        [SerializeField] private AudioClip _braveYouSavedUsAudioClip;
        [SerializeField] private AudioClip _braveYouAreStrongAudioClip;
        [SerializeField] private Button _braveButton;
        [SerializeField] private OnEnableActionController _braveWinScreenActionController;
        [SerializeField] private OnEnableActionController _braveTazyTapButtonActionController;
        [SerializeField] private OnEnableActionController _braveWinOldmanActionController;
        [SerializeField] private OnEnableActionController _braveWinTazyActionController;

        [Header("Wise")]
        [SerializeField] private AudioClip _wiseYurtAmbienceAudioClip;
        [SerializeField] private AudioClip _wisePouringKymyzAudioClip;
        [SerializeField] private AudioClip _wiseStirringKymyzAudioClip;
        [SerializeField] private AudioClip _wiseKymyzIsHealthyAudioClip;
        [SerializeField] private AudioClip _wiseTapButtonAudioClip;
        [SerializeField] private AudioClip _wiseStirAndGiveAudioClip;
        [SerializeField] private AudioClip _wiseWomanWiseAudioClip;
        [SerializeField] private Button _wiseButton;
        [SerializeField] private OnEnableActionController _wiseQuickTapGameActionController;
        [SerializeField] private OnEnableActionController _wiseStartTazyActionController;
        [SerializeField] private OnEnableActionController _wiseEndTazyActionController;

        [Header("Frisky")]
        [SerializeField] private AudioClip _friskyGallopAudioClip;
        [SerializeField] private AudioClip _friskyJumpAudioClip;
        [SerializeField] private AudioClip _friskyYouMyFriendAudioClip;
        [SerializeField] private AudioClip _friskyTapButtonAudioClip;
        [SerializeField] private AudioClip _friskyFinishAudioClip;
        [SerializeField] private AudioClip _friskyHorseAllyAudioClip;
        [SerializeField] private Button _friskyButton;
        [SerializeField] private Button _friskyQuickTapButton;
        [SerializeField] private OnEnableActionController _friskyFirstTazyActionController;
        [SerializeField] private OnEnableActionController _friskyWinGigitActionController;
        [SerializeField] private OnEnableActionController _friskyEndTazyActionController;

        [Header("Tenacious")]
        [SerializeField] private AudioClip _tenaciousFlightAudioClip;
        [SerializeField] private AudioClip _tenaciousWindFlightAudioClip;
        [SerializeField] private AudioClip _tenaciousTapButtonAudioClip;
        [SerializeField] private AudioClip _tenaciousGoldenEagleIsAudioClip;
        [SerializeField] private Button _tenaciousButton;
        [SerializeField] private OnEnableActionController _tenaciousHunterActionController;

        [Header("SwiftFooted")]
        [SerializeField] private AudioClip _swiftFootedFastRunAudioClip;
        [SerializeField] private AudioClip _swiftFootedBushRustleAudioClip;
        [SerializeField] private AudioClip _swiftFootedSteppeWindAudioClip;
        [SerializeField] private AudioClip _swiftFootedWhoseTraceAudioClip;
        [SerializeField] private AudioClip _swiftFootedThreeAnswersAudioClip;
        [SerializeField] private AudioClip _swiftFootedWrongAnswerAudioClip;
        [SerializeField] private AudioClip _swiftFootedFoxIsAudioClip;
        [SerializeField] private AudioClip _swiftFootedCatchTheFoxAudioClip;
        [SerializeField] private AudioClip _swiftFootedImSoFastAudioClip;
        [SerializeField] private AudioClip _swiftFootedFoxHidingAudioClip;
        [SerializeField] private AudioClip _swiftFootedFoundAudioClip;
        [SerializeField] private Button _swiftFootedButton;
        [SerializeField] private Button _swiftFootedCorrectAnswerButton;
        [SerializeField] private OnEnableActionController _swiftFootedChasingActionController;
        [SerializeField] private OnEnableActionController _swiftFootedHunterFoxIsActionController;
        [SerializeField] private OnEnableActionController _swiftFootedHunterFoxFoundedActionController;
        [SerializeField] private OnEnableActionController _swiftFootedEndTazyActionController;
        [SerializeField] private OnEnableActionControllerWithTimer _swiftFootedThreeAnswersActionController;
        [SerializeField] private OnEnableActionControllerWithTimer _swiftFootedTazyFoxHidingActionController;
        [SerializeField] private OnEnableActionControllerWithTimer _swiftFootedTazyCatchFoxActionController;
        [SerializeField] private Button[] _swiftFootedWrongButtons;

        [Header("Accurate")]
        [SerializeField] private AudioClip _accurateShotAudioClip;
        [SerializeField] private AudioClip _accurateAimAudioClip;
        [SerializeField] private AudioClip _accurateVictoryAudioClip;
        [SerializeField] private AudioClip _accurateAtTheMiddleAudioClip;
        [SerializeField] private AudioClip _accurateOldmanTalkingAudioClip;
        [SerializeField] private AudioClip _accuratePatienceAudioClip;
        [SerializeField] private Button _accurateButton;
        [SerializeField] private OnEnableActionController _accurateGunFireActionController;
        [SerializeField] private OnEnableActionController _accurateWinScreenActionController;
        [SerializeField] private OnEnableActionController _accurateEndTazyActionController;

        [Header("Sharp")]
        [SerializeField] private AudioClip _sharpBackgroundAudioClip;
        [SerializeField] private AudioClip _sharpWritingAudioClip;
        [SerializeField] private AudioClip _sharpClassroomAudioClip;
        [SerializeField] private AudioClip _sharpVictoryAudioClip;
        [SerializeField] private Button _sharpButton;
        [SerializeField] private OnEnableActionController _sharpWinScreenActionController;

        [Header("Buttons")]
        [SerializeField] private Button _backButton;

        private void Awake()
        {
            _audioSource = GetComponent<AudioSource>();
            _stateManager = FindAnyObjectByType<StateManager>();
            _soundManager = FindAnyObjectByType<SoundManager>();
        }

        private void PlayBraveSteppeAmbient() => PlayMusic(_braveSteppeAmbientAudioClip);
        private void PlayBraveVictory() => PlaySound(_braveVictoryAudioClip);
        private void PlayBraveOldmanHelp() => PlayVoice(_braveOldmanHelpAudioClip);
        private void PlayBraveTapButton() => PlayVoice(_braveTapButtonAudioClip);
        private void PlayBraveYouSavedUs() => PlayVoice(_braveYouSavedUsAudioClip);
        private void PlayBraveYouAreStrong() => PlayVoice(_braveYouAreStrongAudioClip);

        private void PlayWiseYurtAmbience() => PlayMusic(_wiseYurtAmbienceAudioClip);
        private void PlayWisePouringKymyz() => PlaySound(_wisePouringKymyzAudioClip);
        private void PlayWiseStirringKymyz() => PlaySound(_wiseStirringKymyzAudioClip);
        private void PlayWiseKymyzIsHealthy() => PlayVoice(_wiseKymyzIsHealthyAudioClip);
        private void PlayWiseTapButton() => PlayVoice(_wiseTapButtonAudioClip);
        private void PlayWiseStirAndGive() => PlayVoice(_wiseStirAndGiveAudioClip);
        private void PlayWiseWomanWise() => PlayVoice(_wiseWomanWiseAudioClip);

        private void PlayFriskyGallop() => PlayMusic(_friskyGallopAudioClip);
        private void PlayFriskyJump() => PlaySound(_friskyJumpAudioClip);
        private void PlayFriskyYouMyFriend() => PlayVoice(_friskyYouMyFriendAudioClip);
        private void PlayFriskyTapButton() => PlayVoice(_friskyTapButtonAudioClip);
        private void PlayFriskyFinish() => PlayVoice(_friskyFinishAudioClip);
        private void PlayFriskyHorseAlly() => PlayVoice(_friskyHorseAllyAudioClip);

        private void PlayTenaciousFlight() => PlayMusic(_tenaciousFlightAudioClip);
        private void PlayTenaciousWindFlight() => PlayMusic(_tenaciousWindFlightAudioClip);
        private void PlayTenaciousTapButton() => PlayVoice(_tenaciousTapButtonAudioClip);
        private void PlayTenaciousGoldenEagleIs() => PlayVoice(_tenaciousGoldenEagleIsAudioClip);

        private void PlaySwiftFootedFastRun() => PlaySound(_swiftFootedFastRunAudioClip);
        private void PlaySwiftFootedBushRustle() => PlaySound(_swiftFootedBushRustleAudioClip);
        private void PlaySwiftFootedSteppeWind() => PlayMusic(_swiftFootedSteppeWindAudioClip);
        private void PlaySwiftFootedWhoseTrace() => PlayVoice(_swiftFootedWhoseTraceAudioClip);
        private void PlaySwiftFootedThreeAnswers() => PlayVoice(_swiftFootedThreeAnswersAudioClip);
        private void PlaySwiftFootedWrongAnswer() => PlayVoice(_swiftFootedWrongAnswerAudioClip);
        private void PlaySwiftFootedFoxIs() => PlayVoice(_swiftFootedFoxIsAudioClip);
        private void PlaySwiftFootedCatchTheFox() => PlayVoice(_swiftFootedCatchTheFoxAudioClip);
        private void PlaySwiftFootedImSoFast() => PlayVoice(_swiftFootedImSoFastAudioClip);
        private void PlaySwiftFootedFoxHiding() => PlayVoice(_swiftFootedFoxHidingAudioClip);
        private void PlaySwiftFootedFound() => PlayVoice(_swiftFootedFoundAudioClip);

        private void PlayAccurateShot() => PlaySound(_accurateShotAudioClip);
        private void PlayAccurateAim() => PlaySound(_accurateAimAudioClip);
        private void PlayAccurateVictory() => PlaySound(_accurateVictoryAudioClip);
        private void PlayAccurateAtTheMiddle() => PlayVoice(_accurateAtTheMiddleAudioClip);
        private void PlayAccurateOldmanTalking() => PlayVoice(_accurateOldmanTalkingAudioClip);
        private void PlayAccuratePatience() => PlayVoice(_accuratePatienceAudioClip);

        private void PlaySharpBackgroundAudioClip() => PlayMusic(_sharpBackgroundAudioClip);
        private void PlaySharpWriting() => PlaySound(_sharpWritingAudioClip);
        private void PlaySharpClassroom() => PlaySound(_sharpClassroomAudioClip);
        private void PlaySharpVictory() => PlaySound(_sharpVictoryAudioClip);

        private void PlaySound(AudioClip clip)
        {
            _audioSource.volume = Mathf.Clamp01(_stateManager.SoundVolume / 10f);
            _audioSource.PlayOneShot(clip);
        }

        private void PlayMusic(AudioClip clip)
        {
            StopPlayingMainMusic();
            _soundManager.PlayMusic(clip);
        }

        private void StopMusic() => _soundManager.StopMusic();

        private void PlayVoice(AudioClip clip)
        {
            StopVoice();
            _soundManager.VolumeVoicesSounds = _stateManager.SoundVolume;
            _soundManager.PlayVoice(clip);
        }

        public void StopVoice()
        {
            //_audioSource.Stop();
            _soundManager.StopVoice();
        }

        private void StopPlayingMainMusic() => _soundManager.StopMusic();

        private void ResumePlayingMainMusic() => _soundManager.PlayAstanaMusic();

        private void OnEnable()
        {
            BraveSubscriptions();
            WiseSubscriptions();
            FriskySubscriptions();
            TenaciousSubscriptions();
            SwiftFootedSubscriptions();
            AccurateSubscriptions();
            SharpSubscriptions();

            _backButton.onClick.AddListener(StopVoice);
        }

        private void OnDisable()
        {
            BraveUnsubscribes();
            WiseUnsubscribes();
            FriskyUnsubscribes();
            TenaciousUnsubscribes();
            SwiftFootedUnsubscribes();
            AccurateUnsubscribes();
            SharpUnsubscribes();

            _backButton.onClick.RemoveListener(StopVoice);
        }

        private void BraveSubscriptions()
        {
            _backButton.onClick.AddListener(ResumePlayingMainMusic);
            _braveButton.onClick.AddListener(PlayBraveSteppeAmbient);
            _braveWinScreenActionController.OnEnableAction += PlayBraveVictory;
            _braveButton.onClick.AddListener(PlayBraveOldmanHelp);
            _braveTazyTapButtonActionController.OnEnableAction += PlayBraveTapButton;
            _braveWinOldmanActionController.OnEnableAction += PlayBraveYouSavedUs;
            _braveWinTazyActionController.OnEnableAction += PlayBraveYouAreStrong;
        }
        private void BraveUnsubscribes()
        {
            _backButton.onClick.RemoveListener(ResumePlayingMainMusic);
            _braveButton.onClick.RemoveListener(PlayBraveSteppeAmbient);
            _braveWinScreenActionController.OnEnableAction -= PlayBraveVictory;
            _braveButton.onClick.RemoveListener(PlayBraveOldmanHelp);
            _braveTazyTapButtonActionController.OnEnableAction -= PlayBraveTapButton;
            _braveWinOldmanActionController.OnEnableAction -= PlayBraveYouSavedUs;
            _braveWinTazyActionController.OnEnableAction -= PlayBraveYouAreStrong;
        }
        private void WiseSubscriptions()
        {
            _wiseButton.onClick.AddListener(PlayWiseYurtAmbience);
            _wiseButton.onClick.AddListener(PlayWisePouringKymyz);
            _wiseButton.onClick.AddListener(PlayWiseKymyzIsHealthy);
            _wiseQuickTapGameActionController.OnEnableAction += PlayWiseStirringKymyz;
            _wiseStartTazyActionController.OnEnableAction += PlayWiseTapButton;
            _wiseQuickTapGameActionController.OnEnableAction += PlayWiseStirAndGive;
            _wiseEndTazyActionController.OnEnableAction += PlayWiseWomanWise;

        }
        private void WiseUnsubscribes()
        {
            _wiseButton.onClick.RemoveListener(PlayWiseYurtAmbience);
            _wiseButton.onClick.RemoveListener(PlayWisePouringKymyz);
            _wiseButton.onClick.RemoveListener(PlayWiseKymyzIsHealthy);
            _wiseQuickTapGameActionController.OnEnableAction -= PlayWiseStirringKymyz;
            _wiseStartTazyActionController.OnEnableAction -= PlayWiseTapButton;
            _wiseQuickTapGameActionController.OnEnableAction -= PlayWiseStirAndGive;
            _wiseEndTazyActionController.OnEnableAction -= PlayWiseWomanWise;
        }
        private void FriskySubscriptions()
        {
            _friskyButton.onClick.AddListener(PlayFriskyGallop);
            _friskyQuickTapButton.onClick.AddListener(PlayFriskyJump);
            _friskyButton.onClick.AddListener(PlayFriskyYouMyFriend);
            _friskyFirstTazyActionController.OnEnableAction += PlayFriskyTapButton;
            _friskyWinGigitActionController.OnEnableAction += PlayFriskyFinish;
            _friskyWinGigitActionController.OnEnableAction += StopMusic;
            _friskyEndTazyActionController.OnEnableAction += PlayFriskyHorseAlly;
        }
        private void FriskyUnsubscribes()
        {
            _friskyButton.onClick.RemoveListener(PlayFriskyGallop);
            _friskyQuickTapButton.onClick.RemoveListener(PlayFriskyJump);
            _friskyButton.onClick.RemoveListener(PlayFriskyYouMyFriend);
            _friskyFirstTazyActionController.OnEnableAction -= PlayFriskyTapButton;
            _friskyWinGigitActionController.OnEnableAction -= PlayFriskyFinish;
            _friskyWinGigitActionController.OnEnableAction -= StopMusic;
            _friskyEndTazyActionController.OnEnableAction -= PlayFriskyHorseAlly;
        }
        private void TenaciousSubscriptions()
        {
            _tenaciousButton.onClick.AddListener(PlayTenaciousFlight);
            _tenaciousButton.onClick.AddListener(PlayTenaciousTapButton);
            _tenaciousHunterActionController.OnEnableAction += PlayTenaciousGoldenEagleIs;
            _tenaciousHunterActionController.OnEnableAction += PlayTenaciousWindFlight;
        }
        private void TenaciousUnsubscribes()
        {
            _tenaciousButton.onClick.RemoveListener(PlayTenaciousFlight);
            _tenaciousButton.onClick.RemoveListener(PlayTenaciousTapButton);
            _tenaciousHunterActionController.OnEnableAction -= PlayTenaciousGoldenEagleIs;
            _tenaciousHunterActionController.OnEnableAction -= PlayTenaciousWindFlight;
        }
        private void SwiftFootedSubscriptions()
        {
            _swiftFootedButton.onClick.AddListener(PlaySwiftFootedSteppeWind);
            _swiftFootedCorrectAnswerButton.onClick.AddListener(PlaySwiftFootedBushRustle);
            _swiftFootedChasingActionController.OnEnableAction += PlaySwiftFootedFastRun;
            _swiftFootedChasingActionController.OnEnableAction += StopVoice;
            _swiftFootedButton.onClick.AddListener(PlaySwiftFootedWhoseTrace);
            _swiftFootedThreeAnswersActionController.OnEnableAction += PlaySwiftFootedThreeAnswers;
            foreach (Button button in _swiftFootedWrongButtons)
            {
                button.onClick.AddListener(PlaySwiftFootedWrongAnswer);
            }
            _swiftFootedHunterFoxIsActionController.OnEnableAction += PlaySwiftFootedFoxIs;
            _swiftFootedTazyFoxHidingActionController.OnEnableAction += PlaySwiftFootedFoxHiding;
            _swiftFootedHunterFoxFoundedActionController.OnEnableAction += PlaySwiftFootedFound;
            _swiftFootedTazyCatchFoxActionController.OnEnableAction += PlaySwiftFootedCatchTheFox;
            _swiftFootedEndTazyActionController.OnEnableAction += PlaySwiftFootedImSoFast;
        }
        private void SwiftFootedUnsubscribes()
        {
            _swiftFootedButton.onClick.RemoveListener(PlaySwiftFootedSteppeWind);
            _swiftFootedCorrectAnswerButton.onClick.RemoveListener(PlaySwiftFootedBushRustle);
            _swiftFootedChasingActionController.OnEnableAction -= PlaySwiftFootedFastRun;
            _swiftFootedChasingActionController.OnEnableAction -= StopVoice;
            _swiftFootedButton.onClick.RemoveListener(PlaySwiftFootedWhoseTrace);
            _swiftFootedThreeAnswersActionController.OnEnableAction -= PlaySwiftFootedThreeAnswers;
            foreach (Button button in _swiftFootedWrongButtons)
            {
                button.onClick.RemoveListener(PlaySwiftFootedWrongAnswer);
            }
            _swiftFootedHunterFoxIsActionController.OnEnableAction -= PlaySwiftFootedFoxIs;
            _swiftFootedTazyFoxHidingActionController.OnEnableAction -= PlaySwiftFootedFoxHiding;
            _swiftFootedHunterFoxFoundedActionController.OnEnableAction -= PlaySwiftFootedFound;
            _swiftFootedTazyCatchFoxActionController.OnEnableAction -= PlaySwiftFootedCatchTheFox;
            _swiftFootedEndTazyActionController.OnEnableAction -= PlaySwiftFootedImSoFast;
        }
        private void AccurateSubscriptions()
        {
            _accurateButton.onClick.AddListener(PlayAccurateAim);
            _accurateGunFireActionController.OnEnableAction += PlayAccurateShot;
            _accurateWinScreenActionController.OnEnableAction += PlayAccurateVictory;
            _accurateButton.onClick.AddListener(PlayAccurateAtTheMiddle);
            _accurateWinScreenActionController.OnEnableAction += PlayAccurateOldmanTalking;
            _accurateEndTazyActionController.OnEnableAction += PlayAccuratePatience;
        }
        private void AccurateUnsubscribes()
        {
            _accurateButton.onClick.RemoveListener(PlayAccurateAim);
            _accurateGunFireActionController.OnEnableAction -= PlayAccurateShot;
            _accurateWinScreenActionController.OnEnableAction -= PlayAccurateVictory;
            _accurateButton.onClick.RemoveListener(PlayAccurateAtTheMiddle);
            _accurateWinScreenActionController.OnEnableAction -= PlayAccurateOldmanTalking;
            _accurateEndTazyActionController.OnEnableAction -= PlayAccuratePatience;
        }
        private void SharpSubscriptions()
        {
            _sharpButton.onClick.AddListener(PlaySharpBackgroundAudioClip);
            _sharpButton.onClick.AddListener(PlaySharpClassroom);
            _sharpWinScreenActionController.OnEnableAction += PlaySharpVictory;
        }
        private void SharpUnsubscribes()
        {
            _sharpButton.onClick.RemoveListener(PlaySharpBackgroundAudioClip);
            _sharpButton.onClick.RemoveListener(PlaySharpClassroom);
            _sharpWinScreenActionController.OnEnableAction -= PlaySharpVictory;
        }
    }
}