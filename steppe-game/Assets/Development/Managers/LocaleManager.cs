using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Localization.Settings;

public class LocaleManager : MonoBehaviour
{
    public static event Action OnChangeQuestionUI;

    private bool isActive;

    public void ChangeLocale(int localeId)
    {
        if (isActive)
        {
            Debug.LogWarning("Locale change is already in progress.");
            return;
        }

        if (!IsValidLocaleId(localeId))
        {
            Debug.LogError($"Invalid locale ID: {localeId}. Please use a valid ID.");
            return;
        }

        StartCoroutine(SetLocale(localeId));
    }

    private IEnumerator SetLocale(int localeId)
    {
        isActive = true;

        // Wait for localization settings to initialize
        yield return LocalizationSettings.InitializationOperation;

        // Set the selected locale
        var locales = LocalizationSettings.AvailableLocales.Locales;
        LocalizationSettings.SelectedLocale = locales[localeId];

        Debug.Log($"Locale changed to: {LocalizationSettings.SelectedLocale.LocaleName}");
        isActive = false;

        OnChangeQuestionUI?.Invoke();
    }

    private bool IsValidLocaleId(int localeId)
    {
        var locales = LocalizationSettings.AvailableLocales.Locales;
        return localeId >= 0 && localeId < locales.Count;
    }
}
