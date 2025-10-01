using System;
using UnityEngine;

public class TutorialManager : MonoBehaviour
{
    [SerializeField] private GameObject[] _startTutorials;
    [SerializeField] private GameObject _quizTutorial;

    private int _currentTutorial;

    public event Action StartTutorialComplete;
    public event Action QuizTutorialComplete;
    public event Action<int> OnTutorialStarted;

    private SoundManager _soundManager;

    public void Initialize(SoundManager soundManager)
    {
        _soundManager = soundManager;
    }

    public void StartTutorial()
    {
        _startTutorials[0].SetActive(true);
        OnTutorialStarted?.Invoke(1);
        _soundManager.PlayTipAppearSound();
    }

    public void NextTutorial()
    {
        _startTutorials[_currentTutorial].SetActive(false);
        _currentTutorial++;
        _startTutorials[_currentTutorial].SetActive(true);
        _soundManager.PlayTipAppearSound();
        OnTutorialStarted?.Invoke(_currentTutorial + 1);
    }

    public void EndTutorial()
    {
        _soundManager.StopVoice();
        _startTutorials[_currentTutorial].SetActive(false);
        StartTutorialComplete?.Invoke();
    }

    public void QuizTutorial()
    {
        _quizTutorial.SetActive(true);
        OnTutorialStarted?.Invoke(4);
        _soundManager.PlayTipAppearSound();
    }

    public void EndQuizTutorial()
    {
        _soundManager.StopVoice();
        _quizTutorial.SetActive(false);
        QuizTutorialComplete?.Invoke();
    }
}