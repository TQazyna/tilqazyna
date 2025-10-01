using TMPro;
using UnityEngine;
using UnityEngine.UI;

// TODO: dont separate everything to small classes, use one class to manage whole Canvas where u will manage input and other stuff like u did in ChooseCityCanvas
// also add new information to StateManager an example u can find in GameManager class 
public class NameInputManager : MonoBehaviour
{
    [SerializeField] private Button continueButton;
    [SerializeField] private TMP_InputField inputField;

    private void Update()
    {
        if (inputField.text != "")
        {
            continueButton.interactable = true;
        }
        else
        {
            continueButton.interactable = false;
        }
    }
}