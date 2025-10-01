using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class BattleSoundPlayer : MonoBehaviour
    {
        private StateManager _stateManager;
        private AudioSource _audioSource;
        [SerializeField] private AudioClip _clip;
        
        private void Awake()
        {
            _stateManager = FindAnyObjectByType<StateManager>();
            _audioSource = GetComponent<AudioSource>();
            _audioSource.resource = _clip;
        }

        private void StopPlaying()
        {
            if (_audioSource.isPlaying)
            {
                _audioSource.Stop(); 
            }
        }

        private void PlaySound()
        {
            _audioSource.volume = Mathf.Clamp01(_stateManager.SoundVolume/10f);
            _audioSource.Play();
        }
        
        private void OnEnable()
        {
            PlaySound();
            FillingImage.OnFieldFilled += StopPlaying;
        }

        private void OnDisable()
        {
            StopPlaying();
            FillingImage.OnFieldFilled -= StopPlaying;
        }
    }
}