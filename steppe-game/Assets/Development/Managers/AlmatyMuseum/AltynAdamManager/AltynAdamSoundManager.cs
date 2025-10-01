using Development.Objects.Utils;
using UnityEngine;
using UnityEngine.UI;

namespace Development.Managers.AlmatyMuseum.AltynAdamManager
{
    public sealed class AltynAdamSoundManager : ParentSoundManager
    {
        [SerializeField] private AudioClip _thisIsAltynAdamAudioClip;
        [SerializeField] private AudioClip _findHelmetAudioClip;
        [SerializeField] private AudioClip _thisIsHelmetAudioClip;
        [SerializeField] private AudioClip _findVestAudioClip;
        [SerializeField] private AudioClip _thisIsVestAudioClip;
        [SerializeField] private AudioClip _findBootsAudioClip;
        [SerializeField] private AudioClip _thisIsBootsAudioClip;
        [SerializeField] private AudioClip _findJewelryAudioClip;
        [SerializeField] private AudioClip _thisIsJewelryAudioClip;
        [SerializeField] private AudioClip _doYouWantHistoryAudioClip;
        [SerializeField] private AudioClip _alytynAdamWarriorAudioClip;
        [SerializeField] private Button _thisIsAltynButton;
        [SerializeField] private Button _altynWarriorButton;
        [SerializeField] private OnEnableActionController _thisIsHelmetActionController;
        [SerializeField] private OnEnableActionController _findVestActionController;
        [SerializeField] private OnEnableActionController _thisIsVestActionController;
        [SerializeField] private OnEnableActionController _findBootsActionController;
        [SerializeField] private OnEnableActionController _thisIsBootsActionController;
        [SerializeField] private OnEnableActionController _findJewelryActionController;
        [SerializeField] private OnEnableActionController _thisIsJewelryActionController;
        [SerializeField] private OnEnableActionController _doYouWantActionController;

        private void PlayThisIsAltynAdam() => PlayVoice(_thisIsAltynAdamAudioClip);
        private void PlayFindHelmet() => PlayVoice(_findHelmetAudioClip);
        private void PlayThisIsHelmet() => PlayVoice(_thisIsHelmetAudioClip);
        private void PlayFindVest() => PlayVoice(_findVestAudioClip);
        private void PlayThisIsVest() => PlayVoice(_thisIsVestAudioClip);
        private void PlayFindBoots() => PlayVoice(_findBootsAudioClip);
        private void PlayThisIsBoots() => PlayVoice(_thisIsBootsAudioClip);
        private void PlayFindJewelry() => PlayVoice(_findJewelryAudioClip);
        private void PlayThisIsJewelry() => PlayVoice(_thisIsJewelryAudioClip);
        private void PlayDoYouWantHistory() => PlayVoice(_doYouWantHistoryAudioClip);
        private void PlayAlytynAdamWarrior() => PlayVoice(_alytynAdamWarriorAudioClip);

        protected override void OnEnable()
        {
            base.OnEnable();
            PlayThisIsAltynAdam();
            
            _thisIsAltynButton.onClick.AddListener(PlayFindHelmet);
            _thisIsHelmetActionController.OnEnableAction += PlayThisIsHelmet;
            _findVestActionController.OnEnableAction += PlayFindVest;
            _thisIsVestActionController.OnEnableAction += PlayThisIsVest;
            _findBootsActionController.OnEnableAction += PlayFindBoots;
            _thisIsBootsActionController.OnEnableAction += PlayThisIsBoots;
            _findJewelryActionController.OnEnableAction += PlayFindJewelry;
            _thisIsJewelryActionController.OnEnableAction += PlayThisIsJewelry;
            _doYouWantActionController.OnEnableAction += PlayDoYouWantHistory;
            _altynWarriorButton.onClick.AddListener(PlayAlytynAdamWarrior);
        }

        protected override void OnDisable()
        {
            base.OnDisable();
            
            _thisIsAltynButton.onClick.RemoveListener(PlayFindHelmet);
            _thisIsHelmetActionController.OnEnableAction -= PlayThisIsHelmet;
            _findVestActionController.OnEnableAction -= PlayFindVest;
            _thisIsVestActionController.OnEnableAction -= PlayThisIsVest;
            _findBootsActionController.OnEnableAction -= PlayFindBoots;
            _thisIsBootsActionController.OnEnableAction -= PlayThisIsBoots;
            _findJewelryActionController.OnEnableAction -= PlayFindJewelry;
            _thisIsJewelryActionController.OnEnableAction -= PlayThisIsJewelry;
            _doYouWantActionController.OnEnableAction -= PlayDoYouWantHistory;
            _altynWarriorButton.onClick.RemoveListener(PlayAlytynAdamWarrior);
        }
    }
}