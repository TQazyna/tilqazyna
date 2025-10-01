using System;
using UnityEngine;

public class FeatherMoveManager : MonoBehaviour
{
    private Vector3? initialPosition;
    private Quaternion initialRotation;
    [SerializeField] private Transform targetDestination1;
    [SerializeField] private Transform targetDestination2;
    [SerializeField] private Transform targetDestination3;

    public static event Action featherInitEndGame;

    public bool isMoving = false;
    public float speed = 1700;

    public bool firstPointPassed = false;
    public bool secondPointPassed = false;

    // Update is called once per frame
    void Update()
    {
        if (isMoving)
        {
            if (!firstPointPassed)
            {
                InitializeMovment1();
            }

            if (FeatherIsInPlace1() || firstPointPassed)
            {
                firstPointPassed = true;

                if (!secondPointPassed)
                {
                    InitializeMovment2();
                }

                if (FeatherIsInPlace2() || secondPointPassed)
                {
                    secondPointPassed = true;

                    InitializeMovment3();

                    if (FeatherIsInPlace3())
                    {
                        OnFeatherInPlace();
                    }
                }
            }
        }
    }

    void OnEnable()
    {
        SharpGameSecondSceneManager.initFeatherMovment += InitializeMovment1;
    }

    void OnDisable()
    {
        SharpGameSecondSceneManager.initFeatherMovment -= InitializeMovment1;
    }

    private void InitializeMovment1()
    {
        if (!FeatherIsInPlace1())
        {
            isMoving = true;

            // Move Object
            if (targetDestination1 != null)
            {
                if (initialPosition == null)
                {
                    initialPosition = transform.position;
                    initialRotation = transform.rotation;
                }

                transform.position = Vector3.MoveTowards(transform.position, targetDestination1.position, speed * Time.deltaTime);

                transform.rotation = Quaternion.Lerp(transform.rotation, targetDestination1.rotation, speed * Time.deltaTime);
            }
        }
    }

    private void InitializeMovment2()
    {
        if (!FeatherIsInPlace2())
        {
            isMoving = true;

            // Move Object
            if (targetDestination2 != null)
            {
                transform.position = Vector3.MoveTowards(transform.position, targetDestination2.position, speed * Time.deltaTime);

                transform.rotation = Quaternion.Lerp(transform.rotation, targetDestination2.rotation, speed * Time.deltaTime);
            }
        }
    }

    private void InitializeMovment3()
    {
        if (!FeatherIsInPlace3())
        {
            isMoving = true;

            // Move Object
            if (targetDestination3 != null)
            {

                transform.position = Vector3.MoveTowards(transform.position, targetDestination3.position, speed * Time.deltaTime);

                transform.rotation = Quaternion.Lerp(transform.rotation, targetDestination3.rotation, speed * Time.deltaTime);
            }
        }
    }

    public bool FeatherIsInPlace1()
    {
        return Vector3.Distance(a: transform.position, b: targetDestination1.position) < .02f;
    }

    public bool FeatherIsInPlace2()
    {
        return Vector3.Distance(a: transform.position, b: targetDestination2.position) < .02f;
    }

    public bool FeatherIsInPlace3()
    {
        return Vector3.Distance(a: transform.position, b: targetDestination3.position) < .02f;
    }

    private void OnFeatherInPlace()
    {
        isMoving = false;
        featherInitEndGame?.Invoke();
    }

    public void ResetFeatherButton()
    {
        if (initialPosition != null)
        {
            transform.position = initialPosition ?? Vector3.zero;
            transform.rotation = initialRotation;
        }

        firstPointPassed = false;
        secondPointPassed = false;

        isMoving = false;
    }
}
