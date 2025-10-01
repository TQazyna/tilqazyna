using UnityEngine;

namespace Development.Managers.AlmatyMuseum
{
    public sealed class AlmatyMuseumSoundManager : ParentSoundManager
    {
        [SerializeField] private AudioClip _tazyAudioClip;
        
        private void PlayTazy() => PlayVoice(_tazyAudioClip);
        protected override void OnEnable()
        {
            base.OnEnable();
            PlayTazy();
        }
    }
}