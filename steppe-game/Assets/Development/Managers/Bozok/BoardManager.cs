using UnityEngine;
using UnityEngine.UI;

public class BoardManager : MonoBehaviour
{
    [SerializeField] private int boardIndex;
    [SerializeField] private BozokIntroManager bozokIntroManager;
    [SerializeField] private Transform targetDestination;

    [Header("Dot Objects")]
    [SerializeField] Image dot;
    [SerializeField] Sprite greenDot;

    public bool isMoving = false;

    public float speed = 1700;

    public void OnBoardTap()
    {
        if (bozokIntroManager.tutorialEnded && bozokIntroManager.CheckIfButtonSequenceIsCorrect(boardIndex) && !bozokIntroManager.SomeBoardIsMoving())
        {
            InitializeMovment();
            bozokIntroManager.ButtonByIndexStartedMovment(boardIndex);
        }
    }

    // Update is called once per frame
    void Update()
    {
        if (isMoving)
        {
            InitializeMovment();

            if (BoardIsInPlace())
            {
                OnBoardInPlace();
            }
        }
    }

    private void InitializeMovment()
    {
        isMoving = true;

        // Move Object
        if (targetDestination != null)
        {
            transform.position = Vector3.MoveTowards(transform.position, targetDestination.position, speed * Time.deltaTime);
        }
    }

    public bool BoardIsInPlace()
    {
        return Vector3.Distance(a: transform.position, b: targetDestination.position) < .02f;
    }

    private void OnBoardInPlace()
    {
        isMoving = false;
        dot.sprite = greenDot;
    }
}
