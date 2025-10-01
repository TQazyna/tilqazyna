using UnityEngine;

public class WeaponPart : MonoBehaviour
{
    [Header("Settings")]
    public float speed = 1700;

    public bool isMoving;

    // Start data
    private Vector3? startPosition;
    private Vector3? startScale;
    private Quaternion? startRotation;

    private Vector3? targetDestination;
    private Quaternion? targetRotation;
    private Vector3? targetScale;

    public void ResetWeaponPart()
    {
        if (startPosition != null && startScale != null && startRotation != null)
        {
            transform.position = startPosition ?? Vector3.one;
            transform.localScale = startScale ?? Vector3.one;
            transform.rotation = startRotation ?? new Quaternion();
        }
    }

    // Update is called once per frame
    void Update()
    {
        if (isMoving)
        {
            InitializeMovment();

            if (PartIsInPlace())
            {
                isMoving = false;
            }
        }
    }

    public void SetTargetDestination(Transform destination)
    {
        isMoving = true;

        targetDestination = destination.position;

        targetRotation = destination.rotation;

        targetScale = destination.localScale;

    }

    // Movment methods
    public void InitializeMovment()
    {
        if (startPosition == null && startScale == null && startRotation == null)
        {
            startPosition = transform.position;
            startScale = transform.localScale;
            startRotation = transform.rotation;
        }

        // // Rotate Object
        if (targetRotation != null)
        {
            transform.rotation = Quaternion.Lerp(transform.rotation, targetRotation ?? Quaternion.Euler(0, 0, -90), speed * Time.deltaTime);
        }

        // Scale Object
        if (transform.localScale.x < targetScale?.x && transform.localScale.y < targetScale?.y)
        {
            // Vector3 scaleChange = new(0.1f, 0.1f, 0);
            transform.localScale = targetScale ?? Vector3.one;
        }

        // Move Object
        if (targetDestination != null)
        {
            transform.position = Vector3.MoveTowards(transform.position, targetDestination ?? Vector3.one, speed * Time.deltaTime);
        }
    }

    public bool PartIsInPlace()
    {
        return Vector3.Distance(a: transform.position, b: targetDestination ?? Vector3.one) < .02f;
    }
}
