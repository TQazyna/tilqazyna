using System;
using System.Collections;
using UnityEngine;

public class SharpGameSecondSceneManager : MonoBehaviour
{
    private bool leftAnswerCorrect = false;
    private bool rightAnswerCorrect = false;
    private bool featherAnimationStarted = false;

    public static event Action initFeatherMovment;
    public static event Action disableEnergyRefillOnHUD;
    public static event Action enableEnergyRefillOnHUD;

    [SerializeField] GameObject winScreen;
    [SerializeField] GameObject tazyIncorrectWordHint;

    [SerializeField] FeatherMoveManager featherMoveManager;

    [SerializeField] WordButtonManager wordButtonLeft1;
    [SerializeField] WordButtonManager wordButtonLeft2;
    [SerializeField] WordButtonManager wordButtonLeft3;

    [SerializeField] WordButtonManager wordButtonRight1;
    [SerializeField] WordButtonManager wordButtonRight2;
    [SerializeField] WordButtonManager wordButtonRight3;

    void Update()
    {
        if (leftAnswerCorrect && rightAnswerCorrect && !featherAnimationStarted)
        {
            featherAnimationStarted = true;
            initFeatherMovment?.Invoke();
            DisableButtons();
        }
    }

    void OnEnable()
    {
        // WordButtonManager.leftCorrectAnswerTapped += LeftCorrectAnswerTapped;
        // WordButtonManager.rightCorrectAnswerTapped += RightCorrectAnswerTapped;
        // WordButtonManager.worngAnswerTapped += WrongAnswerTapped;
        FeatherMoveManager.featherInitEndGame += EndGame;

        StartNewGame();
    }

    void OnDisable()
    {
        // WordButtonManager.leftCorrectAnswerTapped -= LeftCorrectAnswerTapped;
        // WordButtonManager.rightCorrectAnswerTapped -= RightCorrectAnswerTapped;
        // WordButtonManager.worngAnswerTapped -= WrongAnswerTapped;
        FeatherMoveManager.featherInitEndGame += EndGame;
    }

    private void StartNewGame()
    {
        disableEnergyRefillOnHUD?.Invoke();

        leftAnswerCorrect = false;
        rightAnswerCorrect = false;

        featherAnimationStarted = false;
        featherMoveManager.ResetFeatherButton();

        wordButtonLeft1.ResetWordButton();
        wordButtonLeft2.ResetWordButton();
        wordButtonLeft3.ResetWordButton();
        wordButtonRight1.ResetWordButton();
        wordButtonRight2.ResetWordButton();
        wordButtonRight3.ResetWordButton();

        EnableButtons();
    }

    private void DisableButtons()
    {
        wordButtonLeft1.disabled = true;
        wordButtonLeft2.disabled = true;
        wordButtonLeft3.disabled = true;
        wordButtonRight1.disabled = true;
        wordButtonRight2.disabled = true;
        wordButtonRight3.disabled = true;
    }

    private void EnableButtons()
    {
        wordButtonLeft1.disabled = false;
        wordButtonLeft2.disabled = false;
        wordButtonLeft3.disabled = false;
        wordButtonRight1.disabled = false;
        wordButtonRight2.disabled = false;
        wordButtonRight3.disabled = false;
    }

    private void LeftCorrectAnswerTapped()
    {
        leftAnswerCorrect = true;

        wordButtonLeft2.disabled = true;
    }

    private void RightCorrectAnswerTapped()
    {
        rightAnswerCorrect = true;

        wordButtonRight1.disabled = true;
    }

    private void WrongAnswerTapped()
    {
        tazyIncorrectWordHint.SetActive(true);

        DisableButtons();
    }

    private void EndGame()
    {
        StartCoroutine(WaitForThreeSecond());
    }

    private IEnumerator WaitForThreeSecond()
    {
        yield return new WaitForSeconds(1.5f);

        winScreen.SetActive(true);

        enableEnergyRefillOnHUD?.Invoke();
    }

    public void WrongHintNextTapped()
    {
        tazyIncorrectWordHint.SetActive(false);

        EnableButtons();
    }
}
