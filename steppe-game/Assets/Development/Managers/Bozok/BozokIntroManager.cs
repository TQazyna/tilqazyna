using System;
using System.Collections;
using TMPro;
using UnityEngine;

public class BozokIntroManager : MonoBehaviour
{
    [Header("Boards Objects")]
    [SerializeField] BoardManager board1;
    [SerializeField] BoardManager board2;
    [SerializeField] BoardManager board3;
    [SerializeField] BoardManager board4;
    [SerializeField] BoardManager board5;

    [Header("Other Objects")]
    [SerializeField] GameObject enterButton;
    [SerializeField] GameObject tutorialObject;
    [SerializeField] TextMeshProUGUI oldManText;

    bool startOldManHints = false;

    private int correctButtonsTapped = 0;

    public bool tutorialEnded = false;
    public static event Action OnEnterButtonAction;

    private StateManager _stateManager;
    private SoundManager _soundManager;

    private void Awake()
    {
        _stateManager = FindAnyObjectByType<StateManager>();
        _soundManager = FindAnyObjectByType<SoundManager>();

        StartCoroutine(EnableTutorialSound());
    }

    private IEnumerator EnableTutorialSound()
    {
        if (!startOldManHints)
        {
            _soundManager.PlayTazyStartTipAudio();
        }

        yield return new WaitForSeconds(7f);

        if (!startOldManHints)
        {
            _soundManager.PlayToEnterTipAudio();
        }
    }

    // public void Initialize(StateManager stateManager)
    // {
    //     _stateManager = stateManager;
    // }

    private void Update()
    {
        if (startOldManHints)
        {
            ChangeOldManHintText();
        }

        if (GamePassed())
        {
            enterButton.SetActive(true);
        }
    }

    private void ChangeOldManHintText()
    {
        String currentOldManHintText = "Ең бірінші күн таңбасын тап.";

        if (correctButtonsTapped == 1)
        {
            currentOldManHintText = "Енді көшпенділер белгісін тап";
        }
        else if (correctButtonsTapped == 2)
        {
            currentOldManHintText = "Келесі – аңшылық белгісі";
        }
        else if (correctButtonsTapped == 3)
        {
            currentOldManHintText = "Табиғат белгісін тауып қой.";
        }
        else if (correctButtonsTapped >= 4)
        {
            currentOldManHintText = "Соңғы таңба – еркіндік пен жылдамдық белгісі.";
        }

        oldManText.text = currentOldManHintText;
    }

    public void OnEnterButtonTap()
    {
        _stateManager.IsIntroBozokComplete = true;
        OnEnterButtonAction?.Invoke();
    }

    public void OnNextButtonTap()
    {
        _soundManager.StopVoice();
        _soundManager.PlayBozokIntroCardAudio(1);

        tutorialEnded = true;
        tutorialObject.SetActive(false);
        startOldManHints = true;
    }

    public bool CheckIfButtonSequenceIsCorrect(int newIndex)
    {
        bool returnValue = false;

        if (newIndex == 3 && correctButtonsTapped == 0)
        {
            returnValue = true;
        }
        else if (newIndex == 0 && correctButtonsTapped == 1)
        {
            returnValue = true;
        }
        else if (newIndex == 4 && correctButtonsTapped == 2)
        {
            returnValue = true;
        }
        else if (newIndex == 1 && correctButtonsTapped == 3)
        {
            returnValue = true;
        }
        else if (newIndex == 2 && correctButtonsTapped == 4)
        {
            returnValue = true;
        }

        return returnValue;
    }

    public void ButtonByIndexStartedMovment(int newIndex)
    {
        correctButtonsTapped++;

        if (correctButtonsTapped == 1)
        {
            _soundManager.PlayBozokIntroCardAudio(2);
        }
        else if (correctButtonsTapped == 2)
        {
            _soundManager.PlayBozokIntroCardAudio(3);
        }
        else if (correctButtonsTapped == 3)
        {
            _soundManager.PlayBozokIntroCardAudio(4);
        }
        else if (correctButtonsTapped == 4)
        {
            _soundManager.PlayBozokIntroCardAudio(5);
        }
    }

    public bool SomeBoardIsMoving()
    {
        return board1.isMoving
        || board2.isMoving
        || board3.isMoving
        || board4.isMoving
        || board5.isMoving;
    }

    public bool GamePassed()
    {
        return board1.BoardIsInPlace()
        && board2.BoardIsInPlace()
        && board3.BoardIsInPlace()
        && board4.BoardIsInPlace()
        && board5.BoardIsInPlace();
    }
}
