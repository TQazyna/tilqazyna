using System;
using System.Collections;
using Development.Objects.BozokGames.Horse;
using Development.Objects.SevenTreasuresGame.Frisky;
using UnityEngine;

namespace Development.Managers.Bozok.HorseGame
{
    public sealed class HorseGameManager : MonoBehaviour
    {
        [SerializeField, Range(0, 100)] private float _gameSpeedChangePercent;
        [SerializeField] private float _secToNormalSpeed = 2;
        [SerializeField] private GameObject[] _quizObjects;

        public static event Action<float> OnGameSpeedChanged;

        public static event Action OnStartNewQuiz;
        public static event Action OnContinueQuiz;

        private void Awake() => _gameSpeedChangePercent /= 100;

        private void StartChangeSpeedCoroutine(float _) => StartCoroutine(ChangeHorseGameSpeed());

        public void StartNewGame()
        {
            OnStartNewQuiz?.Invoke();
            SetQuizActiveOff();
        }

        private IEnumerator ChangeHorseGameSpeed()
        {
            ChangeHorseGameSpeed(_gameSpeedChangePercent);
            yield return new WaitForSeconds(_secToNormalSpeed);
            ChangeHorseGameSpeed(1);
        }

        private void ChangeHorseGameSpeed(float percent) => OnGameSpeedChanged?.Invoke(percent);

        private void SetQuizActiveOn()
        {
            if (_quizObjects.Length.Equals(0))
            {
                return;
            }
            foreach (GameObject quizObject in _quizObjects)
            {
                quizObject.SetActive(true);
            }
            OnContinueQuiz?.Invoke();
        }

        private void SetQuizActiveOff()
        {
            if (_quizObjects.Length.Equals(0))
            {
                return;
            }
            foreach (GameObject quizObject in _quizObjects)
            {
                quizObject.SetActive(false);
            }
            ContinueMoving();
        }

        private void StopMoving() => OnGameSpeedChanged?.Invoke(0);
        private void ContinueMoving() => OnGameSpeedChanged?.Invoke(1);

        private void OnEnable()
        {
            Horse.OnRockTouched += StartChangeSpeedCoroutine;
            CoinInfoController.OnTargetReached += SetQuizActiveOn;
            CoinInfoController.OnTargetReached += StopMoving;
            BozokQuizManager.OnNextButtonTap += SetQuizActiveOff;
        }

        private void OnDisable()
        {
            Horse.OnRockTouched -= StartChangeSpeedCoroutine;
            CoinInfoController.OnTargetReached -= SetQuizActiveOn;
            CoinInfoController.OnTargetReached -= StopMoving;
            BozokQuizManager.OnNextButtonTap -= SetQuizActiveOff;
        }
    }
}