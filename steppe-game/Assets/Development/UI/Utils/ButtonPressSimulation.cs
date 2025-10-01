using UnityEngine;
using UnityEngine.UI;

namespace Development.UI.Utils
{
    public sealed class ButtonPressSimulation : MonoBehaviour
    {
        [SerializeField] private Button[] _buttons;
        public void InvokeOnClick()
        {
            foreach (Button button in _buttons)
                button.onClick.Invoke();
        }
    }
}