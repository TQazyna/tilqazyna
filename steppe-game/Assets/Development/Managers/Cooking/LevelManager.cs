using System;
using System.Linq;
using UnityEngine;

public sealed class LevelManager : MonoBehaviour
{
    [SerializeField] private LevelData[] _levelDataLevel1;
    [SerializeField] private LevelData[] _levelDataLevel2;
    [SerializeField] private LevelData[] _levelDataLevel3;
    
    [Space, SerializeField] private GuestManager _guestManager;
    [SerializeField] private CookingManager _cookingManager;
    [SerializeField] private LevelViewManager _levelViewManager;
    
    [Space, SerializeField] private GameObject _recipeManager;
    [SerializeField] private EndCookingViewManager _endCookingViewManager;

    private int MaxSubLevels = 6;
    private int MaxLevels = 3;
    
    public static event Action OnBackClick;
    public static event Action OnNextLevelClickedAction;
    
    private StateManager _stateManager;
    private LevelData _currentLevelData;
    private int _starCount;

    private void Awake() => _stateManager = FindAnyObjectByType<StateManager>();

    private void OnEnable()
    {
        GuestManager.OnComplete += OnComplete;
        GuestManager.OnFailed += OnFailed;
    }

    private void OnDisable()
    {
        GuestManager.OnComplete -= OnComplete;
        GuestManager.OnFailed -= OnFailed;
    }

    public void StartNewLevel()
    {
        _starCount = 3;
        _endCookingViewManager.SetActive(false);
        _recipeManager.SetActive(true);
        
        _currentLevelData = GetLevelData(StateManager.Level, StateManager.SubLevel - 1);
        _cookingManager.Reset();
        _guestManager.Initialize(_currentLevelData.guests);
    }

    private void OnFailed() => _starCount--;

    private void OnComplete()
    {
        StateManager.SubLevel++;
        if (StateManager.SubLevel >= MaxSubLevels)
        {
            StateManager.SubLevel = 1;
            StateManager.Level += 1;
            if (StateManager.Level > MaxLevels)
            {
                StateManager.Level = 1;
            }
        }
        
        _stateManager.EnergyAmount = _stateManager.MaxEnergyValue;

        var fine = _starCount switch
        {
            2 => 2,
            1 => 4,
            0 => 6,
            _ => 0
        };

        var currencyOnLevel = GetCurrencyAmount(_currentLevelData);
        _stateManager.CurrencyAmount += currencyOnLevel - fine;
        _stateManager.PointsAmount += _currentLevelData.pointsAmount;
        
        _endCookingViewManager.SetActive(true);
        _endCookingViewManager.Initialize(_stateManager.CharacterSex == CharacterSex.Boy, _currentLevelData, currencyOnLevel, _starCount);
        _recipeManager.SetActive(false);
    }
    
    private int GetCurrencyAmount(LevelData levelData) => 
        levelData.guests.Sum(guest => guest.guestOrderData.dishPrice);

    private LevelData GetLevelData(int levelNumber, int sublevelNumber)
    {
        return levelNumber switch
        {
            1 => _levelDataLevel1[sublevelNumber],
            2 => _levelDataLevel2[sublevelNumber],
            3 => _levelDataLevel3[sublevelNumber],
            _ => _levelDataLevel3[5]
        };
    }

    public void OnBackClicked() => OnBackClick?.Invoke();

    public void OnNextLevelClicked()
    {
        OnNextLevelClickedAction?.Invoke();
        StartNewLevel();
    }
}