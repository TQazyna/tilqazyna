using TMPro;
using UnityEngine;
using UnityEngine.UI;

class BozokHorseQuizManager : BozokQuizManager
{
    [Header("Pen Boards Objects")]
    [SerializeField] HorseBoardManager penBoard1;
    [SerializeField] HorseBoardManager penBoard2;
    [SerializeField] HorseBoardManager penBoard3;
    [SerializeField] HorseBoardManager penBoard4;
    [SerializeField] HorseBoardManager penBoard5;

    [Header("Cloud Boards Objects")]
    [SerializeField] HorseBoardManager cloudBoard1;
    [SerializeField] HorseBoardManager cloudBoard2;
    [SerializeField] HorseBoardManager cloudBoard3;
    [SerializeField] HorseBoardManager cloudBoard4;

    [Header("Additional Image")]
    [SerializeField] private Image additionalImage;

    [Header("Word constructor")]
    [SerializeField] private GameObject penWordObject;
    [SerializeField] private GameObject cloudWordObject;

    [Header("Quiz Objects")]
    [SerializeField] private GameObject allObjectsRegular;
    [SerializeField] private GameObject allObjectsWord;
    [SerializeField] private GameObject tablePen;
    [SerializeField] private GameObject tableCloud;
    [SerializeField] private GameObject wordNextButton;
    [SerializeField] private TextMeshProUGUI wordTitleText;
    [SerializeField] private TextMeshProUGUI wordQuestionText;
    [SerializeField] private GameObject thirdLevelTip;
    [SerializeField] private GameObject thirdLevelRightTip;
    [SerializeField] private GameObject thirdLevelWrongTip;

    [Header("Additional Image Hint")]
    [SerializeField] private GameObject additionalImageHintObject;
    [SerializeField] private GameObject additionalImageRightHintObject;
    [SerializeField] private TextMeshProUGUI additionalImageRightHintText;
    [SerializeField] private GameObject additionalImageWrongHintObject;

    private int correctButtonsTapped = 0;

    private void Update()
    {
        if (PenPassed() && !wordNextButton.activeSelf)
        {
            wordNextButton.SetActive(true);
        }

        if (CloudPassed() && !wordNextButton.activeSelf)
        {
            wordNextButton.SetActive(true);
        }
    }

    private void ResetObjects()
    {
        additionalImage.gameObject.SetActive(false);
        additionalImageHintObject.SetActive(false);
        additionalImageRightHintObject.SetActive(false);
        additionalImageWrongHintObject.SetActive(false);
        allObjectsRegular.SetActive(false);
        allObjectsWord.SetActive(false);
        penWordObject.SetActive(false);
        cloudWordObject.SetActive(false);
        tableCloud.SetActive(false);
        tablePen.SetActive(false);
        wordNextButton.SetActive(false);
        thirdLevelTip.SetActive(false);
        thirdLevelRightTip.SetActive(false);

        // Reset boards
        penBoard1.ResetBoard();
        penBoard2.ResetBoard();
        penBoard3.ResetBoard();
        penBoard4.ResetBoard();
        penBoard5.ResetBoard();
        cloudBoard1.ResetBoard();
        cloudBoard2.ResetBoard();
        cloudBoard3.ResetBoard();
        cloudBoard4.ResetBoard();
    }

    public new void OnAnswerClick(int buttonIndex)
    {
        additionalImageHintObject.SetActive(false);

        DisableButtons();

        if (quizInfo.questions[currentQuestionIndex].answers[buttonIndex].correct)
        {
            if (quizInfo.questions[currentQuestionIndex].additionalImage != null)
            {
                additionalImageRightHintText.text = quizInfo.questions[currentQuestionIndex].rightAnswerHintText;
                additionalImageRightHintObject.SetActive(true);
            }
            else
            {
                thirdLevelRightTip.SetActive(true);
            }

            // Question answered correctly
            RightAnswerChoosen(buttonIndex);
        }
        else
        {
            if (quizInfo.questions[currentQuestionIndex].additionalImage != null)
            {
                additionalImageWrongHintObject.SetActive(true);
            }
            else
            {
                thirdLevelWrongTip.SetActive(true);
            }

            // Question answered incorrectly
            WrongAnswerChoosen(buttonIndex);
        }
    }

    public override void SetCurrentUI()
    {
        ResetObjects();

        bool wordByCharacterQuizShouldBeOn = false;

        if (quizInfo.questions[currentQuestionIndex].additionalImage != null)
        {
            additionalImage.sprite = quizInfo.questions[currentQuestionIndex].additionalImage;
            additionalImage.gameObject.SetActive(true);
            additionalImageHintObject.SetActive(true);
        }
        else if (quizInfo.questions[currentQuestionIndex].wordByCharacter != "")
        {
            wordByCharacterQuizShouldBeOn = true;
        }
        else
        {
            thirdLevelTip.SetActive(true);
        }

        if (wordByCharacterQuizShouldBeOn)
        {
            allObjectsWord.SetActive(true);

            if (quizInfo.questions[currentQuestionIndex].wordByCharacter == "қалам")
            {
                penWordObject.SetActive(true);
                tablePen.SetActive(true);
            }
            else if (quizInfo.questions[currentQuestionIndex].wordByCharacter == "бұлт")
            {
                cloudWordObject.SetActive(true);
                tableCloud.SetActive(true);
            }

            wordTitleText.text = "Сұрақ " + (currentQuestionIndex + 1) + " / " + quizInfo.questions.Length;
            wordQuestionText.text = quizInfo.questions[currentQuestionIndex].description;
        }
        else
        {
            allObjectsRegular.SetActive(true);
        }

        base.SetCurrentUI();
    }

    public void NextWordButtonTapped()
    {
        RightAnswerChoosen(0);

        correctButtonsTapped = 0;

        base.NextButtonTapped();
    }

    public bool CheckIfButtonSequenceIsCorrect(int newIndex)
    {
        bool returnValue = false;

        if (quizInfo.questions[currentQuestionIndex].wordByCharacter == "қалам")
        {
            if (newIndex == 0 && correctButtonsTapped == 0)
            {
                returnValue = true;
            }
            else if ((newIndex == 3 || newIndex == 4) && correctButtonsTapped == 1)
            {
                returnValue = true;
            }
            else if (newIndex == 1 && correctButtonsTapped == 2)
            {
                returnValue = true;
            }
            else if ((newIndex == 3 || newIndex == 4) && correctButtonsTapped == 3)
            {
                returnValue = true;
            }
            else if (newIndex == 2 && correctButtonsTapped == 4)
            {
                returnValue = true;
            }
        }
        else if (quizInfo.questions[currentQuestionIndex].wordByCharacter == "бұлт")
        {
            if (newIndex == 1 && correctButtonsTapped == 0)
            {
                returnValue = true;
            }
            else if (newIndex == 0 && correctButtonsTapped == 1)
            {
                returnValue = true;
            }
            else if (newIndex == 3 && correctButtonsTapped == 2)
            {
                returnValue = true;
            }
            else if (newIndex == 2 && correctButtonsTapped == 3)
            {
                returnValue = true;
            }
        }

        return returnValue;
    }

    public void ButtonByIndexStartedMovment(int newIndex)
    {
        correctButtonsTapped++;
    }

    public bool PenBoardIsMoving()
    {
        return penBoard1.isMoving
        || penBoard2.isMoving
        || penBoard3.isMoving
        || penBoard4.isMoving
        || penBoard5.isMoving;
    }

    public bool CloudBoardIsMoving()
    {
        return cloudBoard1.isMoving
        || cloudBoard2.isMoving
        || cloudBoard3.isMoving
        || cloudBoard4.isMoving;
    }

    public bool PenPassed()
    {
        return penBoard1.BoardIsInPlace()
        && penBoard2.BoardIsInPlace()
        && penBoard3.BoardIsInPlace()
        && penBoard4.BoardIsInPlace()
        && penBoard5.BoardIsInPlace() && quizInfo.questions[currentQuestionIndex].wordByCharacter == "қалам";
    }

    public bool CloudPassed()
    {
        return cloudBoard1.BoardIsInPlace()
        && cloudBoard2.BoardIsInPlace()
        && cloudBoard3.BoardIsInPlace()
        && cloudBoard4.BoardIsInPlace() && quizInfo.questions[currentQuestionIndex].wordByCharacter == "бұлт";
    }
}