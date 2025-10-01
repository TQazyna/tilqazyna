using System;
using Development.Managers.Bozok.BoneGame;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

class BozokBoneQuizManager : BozokQuizManager
{
    [Header("Kirpi Boards Objects")]
    [SerializeField] BoneBoardManager kirpiBoard1;
    [SerializeField] BoneBoardManager kirpiBoard2;
    [SerializeField] BoneBoardManager kirpiBoard3;
    [SerializeField] BoneBoardManager kirpiBoard4;
    [SerializeField] BoneBoardManager kirpiBoard5;
    [SerializeField] private Transform kirpiTargetDestination2;
    [SerializeField] private Transform kirpiTargetDestination5;
    [SerializeField] private Image kirpiDot2;
    [SerializeField] private Image kirpiDot5;

    [Header("Koy Boards Objects")]
    [SerializeField] BoneBoardManager koyBoard1;
    [SerializeField] BoneBoardManager koyBoard2;
    [SerializeField] BoneBoardManager koyBoard3;

    [Header("Tables initial positions")]
    [SerializeField] private GameObject answersKoyInitialPos;
    [SerializeField] private GameObject answersKirpiInitialPos;

    [Header("Additional Image Tip")]
    [SerializeField] private GameObject additionalImageObject;
    [SerializeField] private Image additionalImage;

    [Header("Question objects")]
    [SerializeField] private GameObject questionRegular;
    [SerializeField] private GameObject questionWithImage;
    [SerializeField] private TextMeshProUGUI questionWithImageText;

    [Header("Answers objects")]
    [SerializeField] private GameObject answersRegular;
    [SerializeField] private GameObject answersKirpi;
    [SerializeField] private GameObject answersKoy;
    [SerializeField] private GameObject answersKoyDestination;
    [SerializeField] private GameObject answersKirpiDestination;

    [SerializeField] private GameObject wordNextButton;

    [Header("Correct answer")]
    [SerializeField] private TextMeshProUGUI correctAnswerText;

    [Header("Start bone object")]
    [SerializeField] private GameObject startBoneObject;
    [SerializeField] private Bone boneObject;

    [Header("End level win text")]
    [SerializeField] private TextMeshProUGUI winText;

    [SerializeField] private GameObject tazyObject;

    public static event Action<bool> ChangeGameModeToDefault;

    private int correctButtonsTapped = 0;

    private void Update()
    {
        if (KirpiPassed() && !wordNextButton.activeSelf)
        {
            startBoneObject.SetActive(false);
            answersKirpi.transform.position = answersKirpiDestination.transform.position;
            wordNextButton.SetActive(true);
            tazyObject.SetActive(false);
        }

        if (KoyPassed() && !wordNextButton.activeSelf)
        {
            startBoneObject.SetActive(false);
            answersKoy.transform.position = answersKoyDestination.transform.position;
            wordNextButton.SetActive(true);
            tazyObject.SetActive(false);
        }
    }

    private void ResetObjects()
    {
        additionalImage.gameObject.SetActive(false);
        questionRegular.SetActive(false);
        questionWithImage.SetActive(false);
        answersRegular.SetActive(false);
        answersKirpi.SetActive(false);
        answersKoy.SetActive(false);
        wordNextButton.SetActive(false);
        startBoneObject.SetActive(false);

        answersKirpi.transform.position = answersKirpiInitialPos.transform.position;
        answersKoy.transform.position = answersKoyInitialPos.transform.position;

        // Reset boards
        kirpiBoard1.ResetBoard();
        kirpiBoard2.ResetBoard();
        kirpiBoard3.ResetBoard();
        kirpiBoard4.ResetBoard();
        kirpiBoard5.ResetBoard();
        koyBoard1.ResetBoard();
        koyBoard2.ResetBoard();
        koyBoard3.ResetBoard();
    }

    public new void OnAnswerClick(int buttonIndex)
    {
        if (quizInfo.questions[currentQuestionIndex].answers[buttonIndex].correct)
        {
            // startBoneObject.SetActive(false);

            correctAnswerText.text = quizInfo.questions[currentQuestionIndex].rightAnswerHintText;

            // Question answered correctly
            base.OnAnswerClick(buttonIndex);
        }
        else
        {
            // Question answered incorrectly
            base.OnAnswerClick(buttonIndex);
        }
    }

    public override void SetCurrentUI()
    {
        ResetObjects();

        startBoneObject.SetActive(true);

        if (quizInfo.questions[currentQuestionIndex].additionalImage != null)
        {
            additionalImageObject.SetActive(true);
            additionalImage.gameObject.SetActive(true);
            additionalImage.sprite = quizInfo.questions[currentQuestionIndex].additionalImage;
            questionWithImage.SetActive(true);
            questionWithImageText.text = quizInfo.questions[currentQuestionIndex].description;

            if (quizInfo.questions[currentQuestionIndex].wordByCharacter == "кірпі")
            {
                ChangeGameModeToDefault?.Invoke(false);

                answersKirpi.SetActive(true);
            }
            else if (quizInfo.questions[currentQuestionIndex].wordByCharacter == "қой")
            {
                ChangeGameModeToDefault?.Invoke(false);

                answersKoy.SetActive(true);
            }
        }
        else
        {
            ChangeGameModeToDefault?.Invoke(true);
            questionRegular.SetActive(true);
            answersRegular.SetActive(true);
        }

        base.SetCurrentUI();
    }

    public void NextWordButtonTapped()
    {
        correctAnswerText.text = quizInfo.questions[currentQuestionIndex].rightAnswerHintText;

        RightAnswerChoosen(0);

        correctButtonsTapped = 0;

        if (rightAnswers >= quizInfo.questions.Length)
        {
            winText.text = "Жарайсың! Қанша асық ұтып алғаныңды қарашы. Керемет ойнадың!";
        }

        base.NextButtonTapped();
    }

    public bool CheckIfButtonSequenceIsCorrect(int newIndex)
    {
        bool returnValue = false;

        if (quizInfo.questions[currentQuestionIndex].wordByCharacter == "кірпі")
        {
            if (newIndex == 1 && correctButtonsTapped == 0)
            {
                returnValue = true;
            }
            else if ((newIndex == 0 || newIndex == 2) && correctButtonsTapped == 1)
            {
                if (newIndex == 0)
                {
                    kirpiBoard1.ChangeDestination(kirpiTargetDestination2);
                    kirpiBoard1.ChangeDotObject(kirpiDot2);
                }
                else if (newIndex == 2)
                {
                    kirpiBoard3.ChangeDestination(kirpiTargetDestination2);
                    kirpiBoard3.ChangeDotObject(kirpiDot2);
                }

                returnValue = true;
            }
            else if (newIndex == 4 && correctButtonsTapped == 2)
            {
                returnValue = true;
            }
            else if (newIndex == 3 && correctButtonsTapped == 3)
            {
                returnValue = true;
            }
            else if ((newIndex == 0 || newIndex == 2) && correctButtonsTapped == 4)
            {
                if (newIndex == 0)
                {
                    kirpiBoard1.ChangeDestination(kirpiTargetDestination5);
                    kirpiBoard1.ChangeDotObject(kirpiDot5);
                }
                else if (newIndex == 2)
                {
                    kirpiBoard3.ChangeDestination(kirpiTargetDestination5);
                    kirpiBoard3.ChangeDotObject(kirpiDot5);
                }

                returnValue = true;
            }
        }
        else if (quizInfo.questions[currentQuestionIndex].wordByCharacter == "қой")
        {
            if (newIndex == 1 && correctButtonsTapped == 0)
            {
                returnValue = true;
            }
            else if (newIndex == 0 && correctButtonsTapped == 1)
            {
                returnValue = true;
            }
            else if (newIndex == 2 && correctButtonsTapped == 2)
            {
                returnValue = true;
            }
        }

        if (!returnValue)
        {
            boneObject.ResetObject();
        }

        return returnValue;
    }

    public void ButtonByIndexStartedMovment(int newIndex)
    {
        correctButtonsTapped++;
    }

    public bool KirpiBoardIsMoving()
    {
        return kirpiBoard1.isMoving
        || kirpiBoard2.isMoving
        || kirpiBoard3.isMoving
        || kirpiBoard4.isMoving
        || kirpiBoard5.isMoving;
    }

    public bool KoyBoardIsMoving()
    {
        return koyBoard1.isMoving
        || koyBoard2.isMoving
        || koyBoard3.isMoving;
    }

    public bool KirpiPassed()
    {
        return kirpiBoard1.BoardIsInPlace()
        && kirpiBoard2.BoardIsInPlace()
        && kirpiBoard3.BoardIsInPlace()
        && kirpiBoard4.BoardIsInPlace()
        && kirpiBoard5.BoardIsInPlace() && quizInfo.questions[currentQuestionIndex].wordByCharacter == "кірпі";
    }

    public bool KoyPassed()
    {
        return koyBoard1.BoardIsInPlace()
        && koyBoard2.BoardIsInPlace()
        && koyBoard3.BoardIsInPlace() && quizInfo.questions[currentQuestionIndex].wordByCharacter == "қой";
    }
}