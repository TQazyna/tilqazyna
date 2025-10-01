using UnityEngine;
using TMPro;

namespace Development.Objects.QuickTap
{
    public sealed class TextReveal : MonoBehaviour
    {
        private TextMeshProUGUI textComponent;
        [SerializeField, TextArea] private string fullText;
        [SerializeField] private FeatherMovement feather;

        private string[] lines;
        private int totalChars;

        private void Awake()
        {
            textComponent = GetComponent<TextMeshProUGUI>();
            // Разбиваем текст на строки
            lines = fullText.Split('\n');
        
            // Вычисляем общее число символов
            totalChars = fullText.Length;
        
            // Устанавливаем текст и скрываем его полностью
            textComponent.text = fullText;
            textComponent.maxVisibleCharacters = 0;
        }

        private void Update()
        {
            int totalLines = lines.Length;
        
            // Вычисляем общий прогресс появления текста
            float overallProgress = (((float)feather.CurrentLine - 1) + feather.CurrentLineProgress) / totalLines;
            overallProgress = Mathf.Clamp01(overallProgress);
        
            int visibleChars = Mathf.FloorToInt(overallProgress * totalChars);
            textComponent.maxVisibleCharacters = visibleChars;
        }
    }
}