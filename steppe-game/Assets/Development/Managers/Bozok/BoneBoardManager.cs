using Development.Managers.Bozok.BoneGame;
using UnityEngine;
using UnityEngine.UI;

public class BoneBoardManager : MonoBehaviour
{
    private Vector3? initialPosition;

    [SerializeField] private bool isPen;
    [SerializeField] private int boardIndex;
    [SerializeField] private BozokBoneQuizManager bozokBoneQuizManager;
    [SerializeField] private Transform targetDestination;

    [Header("Dot Objects")]
    [SerializeField] Image dot;
    [SerializeField] Sprite greenDot;
    [SerializeField] Sprite redDot;

    [SerializeField] private BoneNonInteractable boneObject;
    [SerializeField] private Rigidbody2D boneRigid;

    public bool isMoving = false;

    public float speed = 1700;

    public void OnBoardTap()
    {
        if (bozokBoneQuizManager.CheckIfButtonSequenceIsCorrect(boardIndex) && (isPen ? !bozokBoneQuizManager.KirpiBoardIsMoving() : !bozokBoneQuizManager.KoyBoardIsMoving()))
        {
            boneRigid.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
            InitializeMovment();
            bozokBoneQuizManager.ButtonByIndexStartedMovment(boardIndex);
        }
    }

    public void ChangeDestination(Transform newDestination)
    {
        targetDestination = newDestination;
    }

    public void ChangeDotObject(Image newDot)
    {
        dot = newDot;
    }

    // Update is called once per frame
    void Update()
    {
        if (isMoving)
        {
            InitializeMovment();

            if (BoardIsInPlace())
            {
                boneObject.gameObject.SetActive(false);
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
            if (initialPosition == null)
            {
                initialPosition = transform.position;
            }

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

    public void ResetBoard()
    {
        if (initialPosition != null)
        {
            transform.position = initialPosition ?? Vector3.zero;
        }

        isMoving = false;
        dot.sprite = redDot;

        boneObject.gameObject.SetActive(true);
    }
}
