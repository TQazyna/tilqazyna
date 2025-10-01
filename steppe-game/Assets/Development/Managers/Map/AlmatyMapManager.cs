using System;
using UnityEngine;

public class AlmatyMapManager : MonoBehaviour
{
    [Header("Locks")]
    [SerializeField] private GameObject _kekMonumentLock;
    [SerializeField] private GameObject _medeyMonumentLock;
    [SerializeField] private GameObject _konakMonumentLock;

    public event Action OnClickCookingButtonAction;
    public event Action OnClickQuizButtonAction;
    public static event Action OnClickMuseumButtonAction;
    public static event Action OnClickAltynAdamButtonAction;
    public static event Action OnClickTraditionalLifeButtonAction;

    private StateManager _stateManager;

    public void Initialize(StateManager stateManager)
    {
        _stateManager = stateManager;
        StateManager.StateChanged += UpdateMapBuildings;

        UpdateMapBuildings();
    }

    private void UpdateMapBuildings()
    {
        if (_stateManager.ExperienceAmount >= _stateManager.basicLevelExperienceNeeded * 5)
        {
            _kekMonumentLock.SetActive(false);
        }

        if (_stateManager.ExperienceAmount >= (_stateManager.basicLevelExperienceNeeded * 6))
        {
            _medeyMonumentLock.SetActive(false);
        }

        if (_stateManager.ExperienceAmount >= (_stateManager.basicLevelExperienceNeeded * 7))
        {
            _konakMonumentLock.SetActive(false);
        }
    }

    private void OnClickQuizButton(CityEnum place)
    {
        if (_stateManager.ExperienceAmount >= (_stateManager.basicLevelExperienceNeeded * 5) && place == CityEnum.kek)
        {
            _stateManager.CurrentQuiz = "Көктөбе";
            OnClickQuizButtonAction?.Invoke();
        }

        if (_stateManager.ExperienceAmount >= (_stateManager.basicLevelExperienceNeeded * 6) && place == CityEnum.medey)
        {
            _stateManager.CurrentQuiz = "Медеу мұз айдыны";
            OnClickQuizButtonAction?.Invoke();
        }

        if (_stateManager.ExperienceAmount >= (_stateManager.basicLevelExperienceNeeded * 7) && place == CityEnum.konak)
        {
            _stateManager.CurrentQuiz = "«Қазақстан» қонақүйі";
            OnClickQuizButtonAction?.Invoke();
        }
    }

    public void OnKekClick() => OnClickQuizButton(CityEnum.kek);
    public void OnMedeyClick() => OnClickQuizButton(CityEnum.medey);
    public void OnKonakClick() => OnClickQuizButton(CityEnum.konak);

    public void OnClickCookingButton()
    {
        OnClickCookingButtonAction?.Invoke();
    }

    public void OnMuseumClick() => OnClickMuseumButtonAction?.Invoke();
    public void OnAltynAdamClick() => OnClickAltynAdamButtonAction?.Invoke();
    public void OnTraditionalLifeClick() => OnClickTraditionalLifeButtonAction?.Invoke();
}