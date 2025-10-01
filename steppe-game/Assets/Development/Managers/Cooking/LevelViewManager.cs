using System;
using Unity.VisualScripting;
using UnityEngine;

public class LevelViewManager : MonoBehaviour
{
    [SerializeField] private GameObject _pot2;
    [SerializeField] private GameObject _cauldron;
    [SerializeField] private GameObject _meat;
    [SerializeField] private GameObject _sausage;
    [SerializeField] private GameObject _onion;
    [SerializeField] private GameObject _knife;

    // private StateManager stateManager;
    
    public void Awake()
    {
        //this.stateManager = stateManager;
        //this.stateManager.StateChanged += UpdateView;
        
        UpdateView();
    }

    private void OnEnable() => StateManager.StateChanged += UpdateView;

    private void OnDisable() => StateManager.StateChanged -= UpdateView;

    private void UpdateView()
    {
        switch (StateManager.Level)
        {
            case 1:
                // _pot2.SetActive(false);
                // _cauldron.SetActive(false);
                // _meat.SetActive(false);
                // _sausage.SetActive(false);
                // _onion.SetActive(false);
                // _knife.SetActive(false);
                //_pot2.SetActive(true);
                _cauldron.SetActive(true);
                _meat.SetActive(true);
                _sausage.SetActive(true);
                _onion.SetActive(true);
                _knife.SetActive(true);
                break;
            case 2:
                //_pot2.SetActive(false);
                //_pot2.SetActive(true);
                _cauldron.SetActive(true);
                _meat.SetActive(true);
                _sausage.SetActive(true);
                _onion.SetActive(true);
                _knife.SetActive(true);
                break;
            case 3:
                //_pot2.SetActive(true);
                _cauldron.SetActive(true);
                _meat.SetActive(true);
                _sausage.SetActive(true);
                _onion.SetActive(true);
                _knife.SetActive(true);
                break;
        }
    }
}