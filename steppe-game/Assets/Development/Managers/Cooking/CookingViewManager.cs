using System;
using UnityEngine;
using UnityEngine.UI;

public class CookingViewManager : MonoBehaviour
{
    [Header("Dough bowl")] [SerializeField]
    private GameObject _plateFlour;

    [SerializeField] private GameObject _plateSugar;
    [SerializeField] private GameObject _plateYest;
    [SerializeField] private GameObject _plateEgg;
    [SerializeField] private GameObject _plateSalt;
    [SerializeField] private GameObject _plateDoughBershmak;
    [SerializeField] private GameObject _plateDoughBaursak;

    [Header("Board")] [SerializeField] private GameObject _boardBaursak;
    [SerializeField] private GameObject _boardDoughBaursak;
    [SerializeField] private GameObject _boardDoughBershmak;
    [SerializeField] private GameObject _boardOnion;
    [SerializeField] private GameObject _boardOnionPeeled;
    [SerializeField] private GameObject _boardDoughCutted;
    [SerializeField] private GameObject _boardMeatBoiled;
    [SerializeField] private GameObject _boardMeatBoiledCUtted;

    [Header("Cauldron")] [SerializeField] private GameObject _cauldronMeat;
    [SerializeField] private GameObject _cauldronSausage;
    [SerializeField] private GameObject _cauldronOnion;
    [SerializeField] private GameObject _cauldronDough;

    [Header("Pot")] [SerializeField] private GameObject _potBaursakRaw;
    [SerializeField] private GameObject _potBaursakCooked;
    [SerializeField] private GameObject _potBaursakBurned;
    [SerializeField] private GameObject _potKurutCooked;
    [SerializeField] private GameObject _potMilk;
    [SerializeField] private GameObject _potMilkBurned;
    [SerializeField] private GameObject _potSalt;

    [Header("Pot2")] [SerializeField] private GameObject _pot2BaursakRaw;
    [SerializeField] private GameObject _pot2BaursakCooked;
    [SerializeField] private GameObject _pot2BaursakBurned;
    [SerializeField] private GameObject _pot2KurutCooked;
    [SerializeField] private GameObject _pot2Milk;
    [SerializeField] private GameObject _pot2MilkBurned;
    [SerializeField] private GameObject _pot2Salt;

    [Header("Bowl1")] [SerializeField] private GameObject _bowl1Baursak;
    [SerializeField] private GameObject _bowl1BershmakCooked;
    [SerializeField] private GameObject _bowl1BershmakSpaghetti;
    [SerializeField] private GameObject _bowl1KurutCooked;

    [Header("Bowl2")] [SerializeField] private GameObject _bowl2Baursak;
    [SerializeField] private GameObject _bowl2BershmakCooked;
    [SerializeField] private GameObject _bowl2BershmakSpaghetti;
    [SerializeField] private GameObject _bowl2KurutCooked;

    [Header("Kumis")] [SerializeField] private Image _kumisImage;
    [SerializeField] private Sprite _kumisEmptyCupSprite;
    [SerializeField] private Sprite _kumisFullCupSprite;

    [Header("Timer")] [SerializeField] private Slider _potTimerSlider;
    [SerializeField] private Slider _pot2TimerSlider;
    [SerializeField] private Slider _cauldronTimerSlider;
    [SerializeField] private Slider _potTimerBurnedSlider;
    [SerializeField] private Slider _pot2TimerBurnedSlider;

    private float _cookingTimePot = 5f;
    private float _cookingTimePot2 = 5f;
    private float _cookingTimeCauldron = 5f;
    private float _burningTimePot = 10f;
    private float _burningTimePot2 = 10f;
    private float _timerPot;
    private float _timerPot2;
    private float _timerCauldron;
    private bool _timerRunningPot;
    private bool _timerRunningPot2;
    private bool _timerRunningCauldron;
    private bool _burningTimerRunningPot;
    private bool _burningTimerRunningPot2;

    public static event Action<IngredientType> OnTimerStarted;
    public static event Action<IngredientType> OnTimerFinished;
    public event Action<IngredientType> OnFireStarted;
    public event Action<IngredientType> OnDishBurned;
    public event Action<IngredientType> OnIngredientAdded;

    private void FixedUpdate()
    {
        if (_timerRunningPot)
        {
            _timerPot += Time.fixedDeltaTime;
            if (_timerPot >= _cookingTimePot)
            {
                _timerPot = 0;
                _timerRunningPot = false;
                StopTimer(IngredientType.Pot);
                //StartBurningTimer(IngredientType.Pot);
            }

            UpdateTimerView(_potTimerSlider, _timerPot / _cookingTimePot);
        }

        if (_burningTimerRunningPot)
        {
            _timerPot += Time.fixedDeltaTime;
            if (_timerPot >= _burningTimePot / 2)
            {
                OnDishBurned?.Invoke(IngredientType.Pot);
            }

            if (_timerPot >= _burningTimePot)
            {
                _timerPot = 0;
                _burningTimerRunningPot = false;
                OnFireStarted?.Invoke(IngredientType.Pot);
            }

            UpdateTimerView(_potTimerBurnedSlider, _timerPot / _burningTimePot);
        }

        if (_timerRunningPot2)
        {
            _timerPot2 += Time.fixedDeltaTime;
            if (_timerPot2 >= _cookingTimePot2)
            {
                _timerPot2 = 0;
                _timerRunningPot2 = false;
                StopTimer(IngredientType.Pot2);
                //StartBurningTimer(IngredientType.Pot2);
            }

            UpdateTimerView(_pot2TimerSlider, _timerPot2 / _cookingTimePot2);
        }

        if (_burningTimerRunningPot2)
        {
            _timerPot2 += Time.fixedDeltaTime;
            if (_timerPot2 >= _burningTimePot2 / 2)
            {
                OnDishBurned?.Invoke(IngredientType.Pot2);
            }

            if (_timerPot2 >= _burningTimePot2)
            {
                _timerPot2 = 0;
                _burningTimerRunningPot2 = false;
                OnFireStarted?.Invoke(IngredientType.Pot2);
            }

            UpdateTimerView(_pot2TimerBurnedSlider, _timerPot2 / _burningTimePot2);
        }

        if (_timerRunningCauldron)
        {
            _timerCauldron += Time.fixedDeltaTime;
            if (_timerCauldron >= _cookingTimeCauldron)
            {
                _timerCauldron = 0;
                _timerRunningCauldron = false;
                StopTimer(IngredientType.Cauldron);
            }

            UpdateTimerView(_cauldronTimerSlider, _timerCauldron / _cookingTimeCauldron);
        }
    }

    public void StartBurningTimer(IngredientType container)
    {
        if (container == IngredientType.Pot)
        {
            _timerPot = 0;
            _burningTimerRunningPot = true;
            _potTimerBurnedSlider.gameObject.SetActive(true);
        }
        else if (container == IngredientType.Pot2)
        {
            _timerPot2 = 0;
            _burningTimerRunningPot2 = true;
            _pot2TimerBurnedSlider.gameObject.SetActive(true);
        }
    }

    public void AddIngredientView(IngredientType ingredientMain, IngredientType ingredientAdded)
    {
        OnIngredientAdded?.Invoke(ingredientAdded);

        void SetActiveAndResetPosition(GameObject obj)
        {
            obj.SetActive(true);
            var rectTransform = obj.GetComponent<RectTransform>();
            if (rectTransform != null)
            {
                rectTransform.anchoredPosition = Vector2.zero;
            }
        }

        if (ingredientMain == IngredientType.DoughBowl)
        {
            switch (ingredientAdded)
            {
                case IngredientType.Egg:
                    _plateEgg.SetActive(true);
                    break;
                case IngredientType.Salt:
                    _plateSalt.SetActive(true);
                    break;
                case IngredientType.Yest:
                    _plateYest.SetActive(true);
                    break;
                case IngredientType.Sugar:
                    _plateSugar.SetActive(true);
                    break;
                case IngredientType.Flour:
                    _plateFlour.SetActive(true);
                    break;
                case IngredientType.DoughBaursak:
                    _plateDoughBaursak.SetActive(true);
                    break;
                case IngredientType.DoughBershmak:
                    _plateDoughBershmak.SetActive(true);
                    break;
            }
        }

        if (ingredientMain == IngredientType.Board)
        {
            switch (ingredientAdded)
            {
                case IngredientType.DoughBaursak:
                    SetActiveAndResetPosition(_boardDoughBaursak);
                    break;
                case IngredientType.DoughBershmak:
                    SetActiveAndResetPosition(_boardDoughBershmak);
                    break;
                case IngredientType.Baursak:
                    SetActiveAndResetPosition(_boardBaursak);
                    break;
                case IngredientType.Onion:
                    SetActiveAndResetPosition(_boardOnion);
                    break;
                case IngredientType.OnionPeeled:
                    SetActiveAndResetPosition(_boardOnionPeeled);
                    break;
                case IngredientType.BershmakBoiled:
                    SetActiveAndResetPosition(_boardMeatBoiled);
                    break;
                case IngredientType.BershmakMeatCutted:
                    SetActiveAndResetPosition(_boardMeatBoiledCUtted);
                    break;
                case IngredientType.DoughBershmakCutted:
                    SetActiveAndResetPosition(_boardDoughCutted);
                    break;
                case IngredientType.MeatCooked:
                    SetActiveAndResetPosition(_boardMeatBoiled);
                    break;
            }
        }

        if (ingredientMain == IngredientType.Pot)
        {
            switch (ingredientAdded)
            {
                case IngredientType.Baursak:
                    _potBaursakRaw.SetActive(true);
                    break;
                case IngredientType.BaursakCooked:
                    _potBaursakCooked.SetActive(true);
                    break;
                case IngredientType.BaursakBurned:
                    _potBaursakBurned.SetActive(true);
                    break;
                case IngredientType.Milk:
                    _potMilk.SetActive(true);
                    break;
                case IngredientType.Salt:
                    _potSalt.SetActive(true);
                    break;
                case IngredientType.MilkBurned:
                    _potMilkBurned.SetActive(true);
                    break;
                case IngredientType.KurutBoiled:
                    _potKurutCooked.SetActive(true);
                    break;
                case IngredientType.KurutCooked:
                    _potKurutCooked.SetActive(true);
                    break;
            }
        }

        if (ingredientMain == IngredientType.Pot2)
        {
            switch (ingredientAdded)
            {
                case IngredientType.Baursak:
                    _pot2BaursakRaw.SetActive(true);
                    break;
                case IngredientType.BaursakCooked:
                    _pot2BaursakCooked.SetActive(true);
                    break;
                case IngredientType.BaursakBurned:
                    _pot2BaursakBurned.SetActive(true);
                    break;
                case IngredientType.Milk:
                    _pot2Milk.SetActive(true);
                    break;
                case IngredientType.Salt:
                    _pot2Salt.SetActive(true);
                    break;
                case IngredientType.MilkBurned:
                    _pot2MilkBurned.SetActive(true);
                    break;
                case IngredientType.KurutBoiled:
                    _pot2KurutCooked.SetActive(true);
                    break;
                case IngredientType.KurutCooked:
                    _pot2KurutCooked.SetActive(true);
                    break;
            }
        }

        if (ingredientMain == IngredientType.Bowl1)
        {
            switch (ingredientAdded)
            {
                case IngredientType.BaursakCooked:
                    _bowl1Baursak.SetActive(true);
                    break;
                case IngredientType.BershmakBoiled:
                    _bowl1BershmakSpaghetti.SetActive(true);
                    break;
                case IngredientType.BershmakCooked:
                    _bowl1BershmakCooked.SetActive(true);
                    break;
                case IngredientType.KurutCooked:
                    _bowl1KurutCooked.SetActive(true);
                    break;
            }
        }

        if (ingredientMain == IngredientType.Bowl2)
        {
            switch (ingredientAdded)
            {
                case IngredientType.BaursakCooked:
                    _bowl2Baursak.SetActive(true);
                    break;
                case IngredientType.BershmakBoiled:
                    _bowl2BershmakSpaghetti.SetActive(true);
                    break;
                case IngredientType.BershmakCooked:
                    _bowl2BershmakCooked.SetActive(true);
                    break;
                case IngredientType.KurutCooked:
                    _bowl2KurutCooked.SetActive(true);
                    break;
            }
        }

        if (ingredientMain == IngredientType.KumisCup)
        {
            _kumisImage.sprite = _kumisFullCupSprite;
        }

        if (ingredientMain == IngredientType.Cauldron)
        {
            switch (ingredientAdded)
            {
                case IngredientType.Meat:
                    _cauldronMeat.SetActive(true);
                    break;
                case IngredientType.OnionPeeled:
                    _cauldronOnion.SetActive(true);
                    ClearView(IngredientType.Board);
                    break;
                case IngredientType.Sausage:
                    _cauldronSausage.SetActive(true);
                    break;
                case IngredientType.DoughBershmakCutted:
                    _cauldronDough.SetActive(true);
                    break;
            }
        }
    }

    public void ClearView(IngredientType ingredientType)
    {
        if (ingredientType == IngredientType.DoughBowl)
        {
            _plateEgg.SetActive(false);
            _plateSalt.SetActive(false);
            _plateYest.SetActive(false);
            _plateSugar.SetActive(false);
            _plateFlour.SetActive(false);
            _plateDoughBershmak.SetActive(false);
            _plateDoughBaursak.SetActive(false);
        }

        if (ingredientType == IngredientType.Board)
        {
            _boardBaursak.SetActive(false);
            _boardDoughBaursak.SetActive(false);
            _boardDoughBershmak.SetActive(false);
            _boardOnion.SetActive(false);
            _boardDoughCutted.SetActive(false);
            _boardMeatBoiled.SetActive(false);
            _boardOnionPeeled.SetActive(false);
            _boardMeatBoiledCUtted.SetActive(false);
        }

        if (ingredientType == IngredientType.Pot)
        {
            _potBaursakCooked.SetActive(false);
            _potBaursakRaw.SetActive(false);
            _potBaursakBurned.SetActive(false);
            _potMilk.SetActive(false);
            _potSalt.SetActive(false);
            _potKurutCooked.SetActive(false);
            _potMilk.SetActive(false);
            _potMilkBurned.SetActive(false);
            StopTimer(IngredientType.Pot);
            StopBurnTimer(IngredientType.Pot);
        }

        if (ingredientType == IngredientType.Pot2)
        {
            _pot2BaursakCooked.SetActive(false);
            _pot2BaursakRaw.SetActive(false);
            _pot2BaursakBurned.SetActive(false);
            _pot2Milk.SetActive(false);
            _pot2Salt.SetActive(false);
            _pot2KurutCooked.SetActive(false);
            _pot2Milk.SetActive(false);
            _pot2MilkBurned.SetActive(false);
            StopTimer(IngredientType.Pot2);
            StopBurnTimer(IngredientType.Pot2);
        }

        if (ingredientType == IngredientType.Bowl1)
        {
            _bowl1Baursak.SetActive(false);
            _bowl1BershmakCooked.SetActive(false);
            _bowl1BershmakSpaghetti.SetActive(false);
            _bowl1KurutCooked.SetActive(false);
        }

        if (ingredientType == IngredientType.Bowl2)
        {
            _bowl2Baursak.SetActive(false);
            _bowl2BershmakCooked.SetActive(false);
            _bowl2BershmakSpaghetti.SetActive(false);
            _bowl2KurutCooked.SetActive(false);
        }

        if (ingredientType == IngredientType.KumisCup)
        {
            _kumisImage.sprite = _kumisEmptyCupSprite;
        }

        if (ingredientType == IngredientType.Cauldron)
        {
            _cauldronMeat.SetActive(false);
            _cauldronOnion.SetActive(false);
            _cauldronDough.SetActive(false);
            _cauldronSausage.SetActive(false);
            StopTimer(IngredientType.Cauldron);
        }
    }

    public void StartTimer(float time, IngredientType container)
    {
        if (container == IngredientType.Pot)
        {
            _cookingTimePot = time;
            _timerPot = 0;
            _timerRunningPot = true;
            _potTimerSlider.gameObject.SetActive(true);
            _potTimerSlider.value = 0f;
            OnTimerStarted?.Invoke(IngredientType.Pot);
        }
        else if (container == IngredientType.Pot2)
        {
            _cookingTimePot2 = time;
            _timerPot2 = 0;
            _timerRunningPot2 = true;
            _pot2TimerSlider.gameObject.SetActive(true);
            _pot2TimerSlider.value = 0f;
            OnTimerStarted?.Invoke(IngredientType.Pot2);
        }
        else if (container == IngredientType.Cauldron)
        {
            _cookingTimeCauldron = time;
            _timerCauldron = 0;
            _timerRunningCauldron = true;
            _cauldronTimerSlider.gameObject.SetActive(true);
            _cauldronTimerSlider.value = 0f;
            OnTimerStarted?.Invoke(IngredientType.Cauldron);
        }
    }

    public void StopTimer(IngredientType container)
    {
        if (container == IngredientType.Pot)
        {
            _timerRunningPot = false;
            _potTimerSlider.gameObject.SetActive(false);
            OnTimerFinished?.Invoke(IngredientType.Pot);
        }
        else if (container == IngredientType.Pot2)
        {
            _timerRunningPot2 = false;
            _pot2TimerSlider.gameObject.SetActive(false);
            OnTimerFinished?.Invoke(IngredientType.Pot2);
        }
        else if (container == IngredientType.Cauldron)
        {
            _timerRunningCauldron = false;
            _cauldronTimerSlider.gameObject.SetActive(false);
            OnTimerFinished?.Invoke(IngredientType.Cauldron);
        }
    }

    public void StopBurnTimer(IngredientType container)
    {
        if (container == IngredientType.Pot)
        {
            _burningTimerRunningPot = false;
            _potTimerBurnedSlider.gameObject.SetActive(false);
        }
        else if (container == IngredientType.Pot2)
        {
            _burningTimerRunningPot2 = false;
            _pot2TimerBurnedSlider.gameObject.SetActive(false);
        }
    }

    private void UpdateTimerView(Slider slider, float fillAmount)
    {
        slider.value = fillAmount;
    }

    public void Reset()
    {
        ClearView(IngredientType.Pot);
        ClearView(IngredientType.KumisCup);
        ClearView(IngredientType.Bowl1);
        ClearView(IngredientType.Bowl2);
        ClearView(IngredientType.DoughBowl);
        ClearView(IngredientType.Board);
        ClearView(IngredientType.Pot2);
        ClearView(IngredientType.Cauldron);
    }
}