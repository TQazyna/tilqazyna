using System;
using System.Collections;
using UnityEngine;

namespace Development.Objects.BozokGames.BallGame
{
    public sealed class CharacterBallController : MonoBehaviour
    {
        private StateManager _stateManager;
        private CharacterSex _characterSex;

        [SerializeField] private GameObject _boy;
        [SerializeField] private GameObject _girl;
        [SerializeField] private GameObject _idleCharacter;
        [SerializeField] private GameObject _ball;
        [SerializeField] private GameObject _touchTranslatorPanel;
        [SerializeField] private float _showSecond = 5f;

        private void OnEnable()
        {
            _touchTranslatorPanel.SetActive(false);
            _idleCharacter.SetActive(false);
            _ball.SetActive(false);
            
            _stateManager = FindAnyObjectByType<StateManager>();
            _characterSex = _stateManager.CharacterSex;

            if (_characterSex == CharacterSex.Boy)
            {
                _boy.SetActive(true);
                _girl.SetActive(false);
            }
            else
            {
                _girl.SetActive(true);
                _boy.SetActive(false);
            }

            StartCoroutine(ShowKicking());
        }

        private IEnumerator ShowKicking()
        {
            yield return new WaitForSeconds(_showSecond);
            _boy.SetActive(false);
            _girl.SetActive(false);
            _idleCharacter.SetActive(true);
            _ball.SetActive(true);
            _touchTranslatorPanel.SetActive(true);
        }

        private void OnDisable() => StopAllCoroutines();
    }
}