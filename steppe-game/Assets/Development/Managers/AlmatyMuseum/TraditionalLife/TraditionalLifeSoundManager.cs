using Development.Objects.Utils;
using UnityEngine;
using UnityEngine.Serialization;
using UnityEngine.UI;

namespace Development.Managers.AlmatyMuseum.TraditionalLife
{
    public sealed class TraditionalLifeSoundManager : ParentSoundManager
    {
        [SerializeField] private AudioClip _thisIsTradAudioClip;
        [SerializeField] private AudioClip _thisIsKeregeAudioClip;
        [SerializeField] private AudioClip _thisIsShanyrakAudioClip;
        [SerializeField] private AudioClip _thisIsUykAudioClip;
        [SerializeField] private AudioClip _greatAudioClip;
        [SerializeField] private AudioClip _thisIsFeltTradAudioClip;
        [SerializeField] private AudioClip _beforeKiruAudioClip;
        [SerializeField] private AudioClip _letsArrangeAudioClip;
        [SerializeField] private AudioClip _yurtMusicAudioClip;
        [SerializeField] private AudioClip _tapTableAudioClip;
        [SerializeField] private AudioClip _kazakhsAudioClip;
        [SerializeField] private AudioClip _hangUpInstrumentsAudioClip;
        [SerializeField] private AudioClip _dombyraAudioClip;
        [SerializeField] private AudioClip _beautifulAudioClip;
        [SerializeField] private Button _toKeregeButton;
        [SerializeField] private Button _toShanyrakButton;
        [SerializeField] private Button _toUykButton;
        [SerializeField] private Button _toFeltButton;
        [SerializeField] private Button _toTradButton;
        [SerializeField] private Button _toKiruButton;
        [SerializeField] private Button _toArrangeButton;
        [SerializeField] private Button _toTableButton;
        [SerializeField] private Button _toKazakhsButton;
        [SerializeField] private Button _toHangUpInstrumentsButton;
        [SerializeField] private Button _toDombyraButton;
        [SerializeField] private Button _toBeautifulButton;
        [SerializeField] private OnEnableActionController _greatActionController;
        
        private void PlayThisIsTrad() => PlayVoice(_thisIsTradAudioClip);
        private void PlayThisIsKerege() => PlayVoice(_thisIsKeregeAudioClip);
        private void PlayThisIsShanyrak() => PlayVoice(_thisIsShanyrakAudioClip);
        private void PlayThisIsUyk() => PlayVoice(_thisIsUykAudioClip);
        private void PlayGreat() => PlayVoice(_greatAudioClip);
        private void PlayThisIsFeltTrad() => PlayVoice(_thisIsFeltTradAudioClip);
        private void PlayBeforeKiru() => PlayVoice(_beforeKiruAudioClip);
        private void PlayLetsArrange() => PlayVoice(_letsArrangeAudioClip);
        private void PlayYurtMusic() => PlayMusic(_yurtMusicAudioClip);
        private void PlayTapTable() => PlayVoice(_tapTableAudioClip);
        private void PlayKazakhs() => PlayVoice(_kazakhsAudioClip);
        private void PlayHangUpInstruments() => PlayVoice(_hangUpInstrumentsAudioClip);
        private void PlayDombyra() => PlayVoice(_dombyraAudioClip);
        private void PlayBeautiful() => PlayVoice(_beautifulAudioClip);
        
        protected override void OnEnable()
        {
            base.OnEnable();
            PlayThisIsKerege();
            
            //_toKeregeButton.onClick.AddListener(PlayThisIsKerege);
            _toShanyrakButton.onClick.AddListener(PlayThisIsShanyrak);
            _toUykButton.onClick.AddListener(PlayThisIsUyk);
            _greatActionController.OnEnableAction += PlayGreat;
            _toFeltButton.onClick.AddListener(PlayThisIsFeltTrad);
            _toTradButton.onClick.AddListener(PlayThisIsTrad);
            _toKiruButton.onClick.AddListener(PlayBeforeKiru);
            _toArrangeButton.onClick.AddListener(PlayLetsArrange);
            _toArrangeButton.onClick.AddListener(PlayYurtMusic);
            _toTableButton.onClick.AddListener(PlayTapTable);
            _toKazakhsButton.onClick.AddListener(PlayKazakhs);
            _toHangUpInstrumentsButton.onClick.AddListener(PlayHangUpInstruments);
            _toDombyraButton.onClick.AddListener(PlayDombyra);
            _toBeautifulButton.onClick.AddListener(PlayBeautiful);
        }

        protected override void OnDisable()
        {
            base.OnDisable();
            
            //_toKeregeButton.onClick.RemoveListener(PlayThisIsKerege);
            _toShanyrakButton.onClick.RemoveListener(PlayThisIsShanyrak);
            _toUykButton.onClick.RemoveListener(PlayThisIsUyk);
            _greatActionController.OnEnableAction -= PlayGreat;
            _toFeltButton.onClick.RemoveListener(PlayThisIsFeltTrad);
            _toTradButton.onClick.RemoveListener(PlayThisIsTrad);
            _toKiruButton.onClick.RemoveListener(PlayBeforeKiru);
            _toArrangeButton.onClick.RemoveListener(PlayLetsArrange);
            _toArrangeButton.onClick.RemoveListener(PlayYurtMusic);
            _toTableButton.onClick.RemoveListener(PlayTapTable);
            _toKazakhsButton.onClick.RemoveListener(PlayKazakhs);
            _toHangUpInstrumentsButton.onClick.RemoveListener(PlayHangUpInstruments);
            _toDombyraButton.onClick.RemoveListener(PlayDombyra);
            _toBeautifulButton.onClick.RemoveListener(PlayBeautiful);
        }
    }
}