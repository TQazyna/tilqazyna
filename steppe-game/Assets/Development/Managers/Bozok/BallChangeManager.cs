using UnityEngine;
using UnityEngine.UI;

public class BallChangeManager : MonoBehaviour
{
    [Header("Game ball")]
    [SerializeField] Image ballObject;

    [Header("Button back")]
    [SerializeField] Image buttonBack;

    [Header("Sprites")]
    [SerializeField] Sprite activeBack;
    [SerializeField] Sprite unactiveBack;
    [SerializeField] Sprite buttonBall;

    [Header("Other buttons")]
    [SerializeField] BallChangeManager button1;
    [SerializeField] BallChangeManager button2;

    public void ResetButton()
    {
        buttonBack.sprite = unactiveBack;
    }

    public void ChangeBall()
    {
        ballObject.sprite = buttonBall;
        buttonBack.sprite = activeBack;

        button1.ResetButton();
        button2.ResetButton();
    }
}
