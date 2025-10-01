using UnityEngine;
using UnityEngine.UI;

namespace Development.Objects.BozokGames.BallGame
{
    public sealed class CharacterPoseController : MonoBehaviour
    {
        private StateManager _stateManager;
        private CharacterSex _characterSex;

        [SerializeField] private Sprite _idleBoySprite;
        [SerializeField] private Sprite _idleGirlSprite;
        [SerializeField] private Sprite _kickedBoySprite;
        [SerializeField] private Sprite _kickedGirlSprite;
        private void Awake() => _stateManager = FindAnyObjectByType<StateManager>();

        private void ChangePose(int direction)
        {
            if (direction > 0)
            {
                if (_characterSex == CharacterSex.Girl) transform.localRotation = Quaternion.Euler(0, 180, 0);
                GetComponent<Image>().sprite = _characterSex == CharacterSex.Boy ? _kickedBoySprite : _kickedGirlSprite;
            }
            else
            {
                if (_characterSex == CharacterSex.Boy) transform.localRotation = Quaternion.Euler(0, 180, 0);
                else transform.localRotation = Quaternion.Euler(0, 0, 0);
                GetComponent<Image>().sprite = _characterSex == CharacterSex.Boy ? _kickedBoySprite : _kickedGirlSprite;
            }
        }

        private void ResetPose()
        {
            transform.localRotation =
                _characterSex == CharacterSex.Boy ? Quaternion.identity : Quaternion.Euler(0, 180, 0);
            GetComponent<Image>().sprite = _characterSex == CharacterSex.Boy ? _idleBoySprite : _idleGirlSprite;
        }

        private void SetCharacter()
        {
            _characterSex = _stateManager.CharacterSex;
            ResetPose();
        }

        private void OnEnable()
        {
            SetCharacter();
            Ball.OnBallThrown += ChangePose;
            Ball.OnReturn += ResetPose;
        }

        private void OnDisable()
        {
            ResetPose();
            Ball.OnBallThrown -= ChangePose;
            Ball.OnReturn -= ResetPose;
        }
    }
}