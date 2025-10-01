using UnityEngine;

public class BuyWeaponPopupManager : MonoBehaviour
{
    [Header("Lock's objects")]
    [SerializeField] GameObject swordLock;
    [SerializeField] GameObject axeLock;
    [SerializeField] GameObject bowLock;
    [SerializeField] GameObject mazeLock;

    [Header("BuyPopUp Objects")]
    [SerializeField] GameObject tazyNotEnoughCoinsObject;
    [SerializeField] GameObject buyWeaponUIObject;

    private FiveWeaponsGameType _weaponsGameType;

    private StateManager _stateManager;

    public void Initialize(StateManager stateManager)
    {
        _stateManager = stateManager;
    }

    void OnEnable()
    {
        buyWeaponUIObject.SetActive(true);
        tazyNotEnoughCoinsObject.SetActive(false);
    }

    public void SetCurrentWeaponType(FiveWeaponsGameType weaponsGameType)
    {
        _weaponsGameType = weaponsGameType;
    }

    public void OnCancelTap() => gameObject.SetActive(false);

    public void BuyWeapon()
    {
        if (_stateManager.CurrencyAmount >= 5)
        {
            // Enough coins
            if (_weaponsGameType == FiveWeaponsGameType.sword)
            {
                _stateManager.CurrencyAmount -= 5;
                _stateManager.IsSwordBought = true;
                swordLock.SetActive(false);
                gameObject.SetActive(false);
                return;
            }

            if (_weaponsGameType == FiveWeaponsGameType.bow)
            {
                _stateManager.CurrencyAmount -= 5;
                _stateManager.IsBowBought = true;
                bowLock.SetActive(false);
                gameObject.SetActive(false);
                return;
            }

            if (_weaponsGameType == FiveWeaponsGameType.axe)
            {
                _stateManager.CurrencyAmount -= 5;
                _stateManager.IsAxeBought = true;
                axeLock.SetActive(false);
                gameObject.SetActive(false);
                return;
            }

            if (_weaponsGameType == FiveWeaponsGameType.hammer)
            {
                _stateManager.CurrencyAmount -= 5;
                _stateManager.IsMazeBought = true;
                mazeLock.SetActive(false);
                gameObject.SetActive(false);
                return;
            }
        }
        else
        {
            // Not enough coins
            buyWeaponUIObject.SetActive(false);
            tazyNotEnoughCoinsObject.SetActive(true);
        }
    }
}
