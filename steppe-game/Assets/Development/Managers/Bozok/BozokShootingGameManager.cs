using System;
using System.Collections;
using UnityEngine;

public class BozokShootingGameManager : MonoBehaviour
{
    [SerializeField] private GameObject _tutorialIconObject;
    [SerializeField] private GameObject _tazyObject;
    [SerializeField] private GameObject _ballsObject;

    public static event Action OnStartNewQuiz;
    public static event Action OnContinueQuiz;

    [SerializeField] private GameObject[] _quizObjects;

    public void StartNewGame()
    {
        OnStartNewQuiz?.Invoke();
        StartCoroutine(EnableTutorialForThreeSecond(true));
    }

    private void ContinueTap()
    {
        OnContinueQuiz?.Invoke();
        StartCoroutine(EnableTutorialForThreeSecond(false));
    }

    private void OnEnable()
    {
        BozokQuizManager.OnNextButtonTap += ContinueTap;
    }

    private void OnDisable()
    {
        BozokQuizManager.OnNextButtonTap -= ContinueTap;
    }

    private IEnumerator EnableTutorialForThreeSecond(bool tutorialButtonEnabled)
    {
        if (tutorialButtonEnabled)
        {
            _tutorialIconObject.SetActive(true);
        }

        _tazyObject.SetActive(true);

        yield return new WaitForSeconds(3f);

        _tutorialIconObject.SetActive(false);
        _tazyObject.SetActive(false);
    }
}
