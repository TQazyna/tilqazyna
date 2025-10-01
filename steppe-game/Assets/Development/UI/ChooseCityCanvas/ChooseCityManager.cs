using System;
using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.Localization;

public class ChooseCityManager : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI dialoguePanelText;
    [SerializeField] private GameObject selectCityText;

    [SerializeField] private LocalizedString localizedDialogPhrase1;
    [SerializeField] private LocalizedString localizedDialogPhrase2;

    private SoundManager _soundManager;

    public event Action<GameScene> CitySelected;
    public event Action BackButtonClicked;

    public void Initialize(SoundManager soundManager)
    {
        _soundManager = soundManager;
    }

    public void StartOver()
    {
        selectCityText.SetActive(false);
        StartCoroutine(StartDialogue());
    }

    private IEnumerator StartDialogue()
    {
        // Fetch and display the first localized dialog
        var phrase1Task = localizedDialogPhrase1.GetLocalizedStringAsync().Task;
        yield return new WaitUntil(() => phrase1Task.IsCompleted);
        dialoguePanelText.text = phrase1Task.Result;

        yield return new WaitForSeconds(_soundManager.GetCityChooseOneSoundLength());

        // Fetch and display the second localized dialog
        var phrase2Task = localizedDialogPhrase2.GetLocalizedStringAsync().Task;
        yield return new WaitUntil(() => phrase2Task.IsCompleted);
        dialoguePanelText.text = phrase2Task.Result;

        _soundManager.PlayChooseCitySecondPartSound();

        selectCityText.SetActive(true);
    }

    public void OnCityButtonClicked(string cityName)
    {
        switch (cityName)
        {
            case "Astana":
                CitySelected?.Invoke(GameScene.Astana);
                break;
            case "Almaty":
                CitySelected?.Invoke(GameScene.Almaty);
                break;
        }

        _soundManager.StopVoice();
    }

    public void OnBackButtonClicked()
    {
        _soundManager.StopVoice();
        BackButtonClicked?.Invoke();
    }
}
