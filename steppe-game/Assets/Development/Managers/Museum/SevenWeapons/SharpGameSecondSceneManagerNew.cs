using System;
using System.Collections;
using TMPro;
using UnityEngine;

public class SharpGameSecondSceneNewManager : MonoBehaviour
{
    private int rightAnswersCount = 0;

    public static event Action disableEnergyRefillOnHUD;
    public static event Action enableEnergyRefillOnHUD;

    [Header("Win screen")]
    [SerializeField] GameObject winScreen;
    [SerializeField] GameObject oldManTextBubble;
    [SerializeField] GameObject winTazy;
    [SerializeField] GameObject winNextButton;
    [SerializeField] GameObject tazyIncorrectWordHint;
    [SerializeField] GameObject endLevelCanvas;
    [SerializeField] TextMeshProUGUI tazyIncorrectWordHintText;

    [Header("Arrows")]
    [SerializeField] GameObject arrow1;
    [SerializeField] GameObject arrow2;
    [SerializeField] GameObject arrow3;

    [Header("Buttons groups")]
    [SerializeField] GameObject wordButtonsFirst;
    [SerializeField] GameObject wordButtonsSecond;
    [SerializeField] GameObject wordButtonsThird;

    [Header("Buttons managers first")]
    [SerializeField] WordButtonManager wordButtonFirst1;
    [SerializeField] WordButtonManager wordButtonFirst2;
    [SerializeField] WordButtonManager wordButtonFirst3;

    [Header("Buttons managers second")]
    [SerializeField] WordButtonManager wordButtonSecond1;
    [SerializeField] WordButtonManager wordButtonSecond2;
    [SerializeField] WordButtonManager wordButtonSecond3;

    [Header("Buttons managers third")]
    [SerializeField] WordButtonManager wordButtonThird1;
    [SerializeField] WordButtonManager wordButtonThird2;
    [SerializeField] WordButtonManager wordButtonThird3;

    [Header("Buttons texts")]
    [SerializeField] TextMeshProUGUI wordTextFirst1;
    [SerializeField] TextMeshProUGUI wordTextFirst2;
    [SerializeField] TextMeshProUGUI wordTextFirst3;

    [Header("Buttons texts")]
    [SerializeField] TextMeshProUGUI wordTextSecond1;
    [SerializeField] TextMeshProUGUI wordTextSecond2;
    [SerializeField] TextMeshProUGUI wordTextSecond3;

    [Header("Buttons texts")]
    [SerializeField] TextMeshProUGUI wordTextThird1;
    [SerializeField] TextMeshProUGUI wordTextThird2;
    [SerializeField] TextMeshProUGUI wordTextThird3;

    [Header("Win texts")]
    [SerializeField] TextMeshProUGUI coins;
    [SerializeField] TextMeshProUGUI points;

    [Header("Hints")]
    [SerializeField] GameObject oldManHint;

    private StateManager _stateManager;
    private SoundManager _soundManager;

    public void Initialize(StateManager stateManager, SoundManager soundManager)
    {
        _stateManager = stateManager;
        _soundManager = soundManager;
    }

    void OnEnable()
    {
        WordButtonManager.correctAnswerTapped += CorrectAnswerTapped;
        WordButtonManager.worngAnswerTapped += WrongAnswerTapped;

        StartNewGame();
    }

    void OnDisable()
    {
        WordButtonManager.correctAnswerTapped -= CorrectAnswerTapped;
        WordButtonManager.worngAnswerTapped -= WrongAnswerTapped;
    }

    private void StartNewGame()
    {
        _soundManager.PlayBlueTableHintAudio();

        rightAnswersCount = 0;

        SetButtons();

        disableEnergyRefillOnHUD?.Invoke();

        wordButtonFirst1.ResetWordButton();
        wordButtonFirst2.ResetWordButton();
        wordButtonFirst3.ResetWordButton();

        wordButtonSecond1.ResetWordButton();
        wordButtonSecond2.ResetWordButton();
        wordButtonSecond3.ResetWordButton();

        wordButtonThird1.ResetWordButton();
        wordButtonThird2.ResetWordButton();
        wordButtonThird3.ResetWordButton();

        winTazy.SetActive(false);
        oldManTextBubble.SetActive(false);
        winNextButton.SetActive(false);
        oldManHint.SetActive(false);
        endLevelCanvas.SetActive(false);

        EnableButtons();
    }

    private void SetButtons()
    {
        if (rightAnswersCount == 0)
        {
            wordButtonsFirst.SetActive(true);
            wordButtonFirst1.gameObject.SetActive(true);
            wordButtonFirst2.gameObject.SetActive(true);
            wordButtonFirst3.gameObject.SetActive(true);

            wordButtonsSecond.SetActive(false);
            wordButtonsThird.SetActive(false);

            arrow1.SetActive(true);
            arrow2.SetActive(false);
            arrow3.SetActive(false);
        }
        else if (rightAnswersCount == 1)
        {
            wordButtonsFirst.SetActive(true);
            wordButtonFirst1.gameObject.SetActive(false);
            wordButtonFirst3.gameObject.SetActive(false);

            wordButtonsSecond.SetActive(true);
            wordButtonSecond1.gameObject.SetActive(true);
            wordButtonSecond2.gameObject.SetActive(true);
            wordButtonSecond3.gameObject.SetActive(true);

            wordButtonsThird.SetActive(false);

            arrow1.SetActive(false);
            arrow2.SetActive(true);
            arrow3.SetActive(false);
        }
        else if (rightAnswersCount == 2)
        {
            wordButtonsFirst.SetActive(true);
            wordButtonFirst1.gameObject.SetActive(false);
            wordButtonFirst3.gameObject.SetActive(false);

            wordButtonsSecond.SetActive(true);
            wordButtonSecond2.gameObject.SetActive(false);
            wordButtonSecond3.gameObject.SetActive(false);

            wordButtonsThird.SetActive(true);
            wordButtonThird1.gameObject.SetActive(true);
            wordButtonThird2.gameObject.SetActive(true);
            wordButtonThird3.gameObject.SetActive(true);

            arrow1.SetActive(false);
            arrow2.SetActive(false);
            arrow3.SetActive(true);
        }
    }

    private void DisableButtons()
    {
        wordButtonFirst1.disabled = true;
        wordButtonFirst2.disabled = true;
        wordButtonFirst3.disabled = true;

        wordButtonSecond1.disabled = true;
        wordButtonSecond2.disabled = true;
        wordButtonSecond3.disabled = true;

        wordButtonThird1.disabled = true;
        wordButtonThird2.disabled = true;
        wordButtonThird3.disabled = true;
    }

    private void EnableButtons()
    {
        wordButtonFirst1.disabled = false;
        wordButtonFirst2.disabled = false;
        wordButtonFirst3.disabled = false;

        wordButtonSecond1.disabled = false;
        wordButtonSecond2.disabled = false;
        wordButtonSecond3.disabled = false;

        wordButtonThird1.disabled = false;
        wordButtonThird2.disabled = false;
        wordButtonThird3.disabled = false;
    }

    private void CorrectAnswerTapped()
    {
        _soundManager.PlaySharpOldManRightAnswerSound();

        rightAnswersCount++;

        if (rightAnswersCount == 3)
        {
            EndGame();
        }
        else
        {
            StartCoroutine(WaitForTwoSecondsToChangeAnswers());
        }
    }

    private IEnumerator WaitForTwoSecondsToChangeAnswers()
    {
        oldManHint.SetActive(true);

        yield return new WaitForSeconds(2f);

        oldManHint.SetActive(false);

        SetButtons();
    }

    private void WinGameSetText()
    {
        coins.text = "4 тиын";
        points.text = "60 ұпай";
    }

    private void ProcessQuizWin()
    {
        _stateManager.EnergyAmount = _stateManager.MaxEnergyValue;

        _stateManager.CurrencyAmount += 4;
        _stateManager.PointsAmount += 60;
        _stateManager.ExperienceAmount += 100;
    }

    private void WrongAnswerTapped(String wrongText, String answerAudioName)
    {
        if (answerAudioName == "aksha")
        {
            _soundManager.PlaySharpAnswerAudio(1);
        }
        else if (answerAudioName == "bailyk")
        {
            _soundManager.PlaySharpAnswerAudio(2);
        }
        else if (answerAudioName == "tamak")
        {
            _soundManager.PlaySharpAnswerAudio(3);
        }
        else if (answerAudioName == "kysmet")
        {
            _soundManager.PlaySharpAnswerAudio(4);
        }
        else if (answerAudioName == "iz")
        {
            _soundManager.PlaySharpAnswerAudio(5);
        }
        else if (answerAudioName == "zhyz")
        {
            _soundManager.PlaySharpAnswerAudio(6);
        }

        tazyIncorrectWordHintText.text = wrongText;

        tazyIncorrectWordHintText.gameObject.SetActive(true);

        tazyIncorrectWordHint.SetActive(true);

        DisableButtons();
    }

    private void EndGame()
    {
        StartCoroutine(WaitForThreeSecond());

        ProcessQuizWin();
        WinGameSetText();
    }

    private IEnumerator WaitForThreeSecond()
    {
        yield return new WaitForSeconds(1f);

        winScreen.SetActive(true);

        yield return new WaitForSeconds(2f);

        if (_stateManager.CharacterSex == CharacterSex.Boy)
        {
            _soundManager.PlaySharpBoyEndPhraseAudio();
        }
        else
        {
            _soundManager.PlaySharpGirlEndPhraseAudio();
        }

        yield return new WaitForSeconds(5.2f);

        oldManTextBubble.SetActive(true);

        _soundManager.PlaySharpOldManEndPhraseAudio();

        yield return new WaitForSeconds(6.2f);

        endLevelCanvas.SetActive(true);

        enableEnergyRefillOnHUD?.Invoke();
    }

    public void WrongHintNextTapped()
    {
        _soundManager.StopVoice();

        tazyIncorrectWordHint.SetActive(false);

        EnableButtons();
    }
}
