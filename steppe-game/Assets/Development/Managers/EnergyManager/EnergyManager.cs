using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class EnergyManager : MonoBehaviour
{
    [SerializeField] private Slider _energyBar;

    DateTime energySpendDateTime;
    float timePassed;
    public float timeToRecoverEnergy = 300;

    private StateManager _stateManager;

    public void Initialize(StateManager stateManager)
    {
        _stateManager = stateManager;
        StartCoroutine(EnergyRecoveryCoroutine());
        LoadData();
    }

    public void SpendEnergy()
    {
        if (_stateManager.EnergyAmount < _stateManager.MaxEnergyValue)
        {
            // Energy was not at max
            if (_stateManager.EnergyAmount > 0)
            {
                _stateManager.EnergyAmount -= 1;
                energySpendDateTime = System.DateTime.Now;
            }
            else
            {
                // Energy at zero
            }
        }
        else
        {
            // Energy was at max
            _stateManager.EnergyAmount -= 1;
            energySpendDateTime = System.DateTime.Now;
        }

        _energyBar.value = _stateManager.EnergyAmount;
    }

    public void RecoverEnergyWithTime()
    {
        timePassed = (float)(System.DateTime.Now - energySpendDateTime).TotalSeconds;

        if (timePassed >= timeToRecoverEnergy)
        {
            if (_stateManager.EnergyAmount < _stateManager.MaxEnergyValue)
            {
                _stateManager.EnergyAmount += 1;
            }
            else
            {
                _stateManager.EnergyAmount = _stateManager.MaxEnergyValue;
            }

            energySpendDateTime = System.DateTime.Now;
        }

        _energyBar.value = _stateManager.EnergyAmount;
    }

    public void RecoverEnergyOnGameLoadTime()
    {
        timePassed = (float)(System.DateTime.Now - energySpendDateTime).TotalSeconds;

        if (timePassed >= timeToRecoverEnergy)
        {
            _stateManager.EnergyAmount += Mathf.RoundToInt(timePassed / timeToRecoverEnergy);

            if (_stateManager.EnergyAmount > _stateManager.MaxEnergyValue)
            {
                _stateManager.EnergyAmount = _stateManager.MaxEnergyValue;
            }
        }

        energySpendDateTime = System.DateTime.Now;

        _energyBar.value = _stateManager.EnergyAmount;
    }

    IEnumerator EnergyRecoveryCoroutine()
    {
        while (true)
        {
            RecoverEnergyWithTime();
            yield return new WaitForSeconds(1);
        }
    }

    private void SaveData()
    {
        PlayerPrefs.SetString("EnergySpendDateTime", energySpendDateTime.ToString());
    }

    private void LoadData()
    {
        if (PlayerPrefs.GetString("EnergySpendDateTime", string.Empty) == "")
        {
            _stateManager.EnergyAmount = _stateManager.MaxEnergyValue;
        }
        else if (PlayerPrefs.GetString("EnergySpendDateTime", string.Empty) != "")
        {
            energySpendDateTime = Convert.ToDateTime(PlayerPrefs.GetString("EnergySpendDateTime"));
            RecoverEnergyOnGameLoadTime();
        }

        _energyBar.value = _stateManager.EnergyAmount;
    }

    private void OnApplicationQuit()
    {
        SaveData();
    }
}