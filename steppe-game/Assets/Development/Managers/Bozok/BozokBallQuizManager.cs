using TMPro;
using UnityEngine;

class BozokBallQuizManager : BozokQuizManager
{
    [Header("Wrong answer")]
    [SerializeField] private GameObject wrongAnswerObject;

    [Header("Correct answer")]
    [SerializeField] private TextMeshProUGUI correctAnswerText;

    private bool gameEnded = false;

    private void ResetObjects()
    {
        gameEnded = false;
        wrongAnswerObject.SetActive(false);
    }

    public override void WrongAnswerChoosen(int buttonIndex)
    {
        gameEnded = true;

        wrongAnswerObject.SetActive(true);

        base.WrongAnswerChoosen(buttonIndex);
    }

    public override void RightAnswerChoosen(int buttonIndex)
    {
        correctAnswerText.text = quizInfo.questions[currentQuestionIndex].rightAnswerHintText;

        base.RightAnswerChoosen(buttonIndex);
    }

    public override void SetCurrentUI()
    {
        ResetObjects();

        base.SetCurrentUI();
    }

    public new void OnAnswerClick(int buttonIndex)
    {
        if (!gameEnded)
        {
            DisableButtons();

            if (!quizInfo.questions[currentQuestionIndex].isSequence)
            {
                // If question is not sequence

                if (quizInfo.questions[currentQuestionIndex].answers[buttonIndex].correct)
                {
                    // Question answered correctly
                    RightAnswerChoosen(buttonIndex);
                }
                else
                {
                    // Question answered incorrectly
                    WrongAnswerChoosen(buttonIndex);
                }
            }
        }
    }
}