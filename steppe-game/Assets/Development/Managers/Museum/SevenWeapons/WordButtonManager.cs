using System;
using UnityEngine;
using UnityEngine.UI;

public class WordButtonManager : MonoBehaviour
{
    private Vector3? initialPosition;
    [SerializeField] private Transform targetDestination;

    [SerializeField] Image back;
    [SerializeField] Sprite backRegular;
    [SerializeField] Sprite backWrong;
    [SerializeField] string wrongText;
    [SerializeField] string answerAudioName;

    public bool disabled = false;

    public static event Action correctAnswerTapped;
    public static event Action<String, String> worngAnswerTapped;

    public bool isMoving = false;
    public float speed = 1700;

    // Update is called once per frame
    void Update()
    {
        if (isMoving)
        {
            InitializeMovment();

            if (WordButtonIsInPlace())
            {
                OnWordButtonInPlace();
            }
        }
    }

    public void OnClick(bool isCorrect)
    {
        if (!disabled)
        {
            if (isCorrect)
            {
                // Move
                InitializeMovment();
            }
            else
            {
                back.sprite = backWrong;

                worngAnswerTapped?.Invoke(wrongText, answerAudioName);
            }
        }
    }

    private void InitializeMovment()
    {
        isMoving = true;

        // Move Object
        if (targetDestination != null)
        {
            if (initialPosition == null)
            {
                initialPosition = transform.position;
            }

            transform.position = Vector3.MoveTowards(transform.position, targetDestination.position, speed * Time.deltaTime);
        }
    }

    public bool WordButtonIsInPlace()
    {
        return Vector3.Distance(a: transform.position, b: targetDestination.position) < .02f;
    }

    private void OnWordButtonInPlace()
    {
        isMoving = false;

        correctAnswerTapped?.Invoke();
    }

    public void ResetWordButton()
    {
        if (initialPosition != null)
        {
            transform.position = initialPosition ?? Vector3.zero;
        }

        back.sprite = backRegular;

        isMoving = false;
    }
}
