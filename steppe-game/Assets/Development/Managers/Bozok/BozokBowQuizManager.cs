using TMPro;
using UnityEngine;
using UnityEngine.UI;

class BozokBowQuizManager : BozokQuizManager
{
    [Header("Question objects")]
    [SerializeField] private GameObject questionRegular;
    [SerializeField] private GameObject questionWithImage;
    [SerializeField] private TextMeshProUGUI questionWithImageText;

    [Header("Wrong answer")]
    [SerializeField] private GameObject wrongAnswerObject;

    [Header("Correct answer")]
    [SerializeField] private TextMeshProUGUI correctAnswerText;

    [Header("Additional Image Tip")]
    [SerializeField] private GameObject additionalImageObject;
    [SerializeField] private Image additionalImage;

    private bool gameEnded = false;

    private void ResetObjects()
    {
        gameEnded = false;
        wrongAnswerObject.SetActive(false);
        additionalImageObject.SetActive(false);
        questionRegular.SetActive(false);
        questionWithImage.SetActive(false);
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

        if (quizInfo.questions[currentQuestionIndex].additionalImage != null)
        {
            additionalImageObject.SetActive(true);
            additionalImage.sprite = quizInfo.questions[currentQuestionIndex].additionalImage;
            questionWithImage.SetActive(true);
            questionWithImageText.text = quizInfo.questions[currentQuestionIndex].description;
        }
        else
        {
            questionRegular.SetActive(true);
        }

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