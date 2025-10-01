using System;
using System.Collections.Generic;
using UnityEngine;

public class GuestManager : MonoBehaviour
{
    [SerializeField] private Guest[] guests;
    
    private int guestAmount;
    private int completedGuestAmount;

    private int _completedGuestSounds = 0;
    
    public static event Action OnComplete; 
    public static event Action OnFailed;
    public static event Action OnAllGuestsCreated; 
    
    public void Initialize(LevelData.GuestData[] levelDataGuests)
    {
        foreach (var guest in guests)
        {
            guest.IsProcessing = false;
            guest.StopAllCoroutines();
            guest.gameObject.SetActive(false);
        }
        
        guestAmount = levelDataGuests.Length;
        
        //int queuePlace = 0;
        int guestIndex = 0;
        foreach (var guestData in levelDataGuests)
        {
            //int queuePlace = 0;
            
            guests[guestIndex].gameObject.SetActive(true);
            guests[guestIndex].Initialize(guestData.guestPhoto, guestData.guestOrderData, guestIndex);
            // guests[guestIndex].OnComplete += OnGuestComplete;
            // guests[guestIndex].OnFailed += OnGuestFailed;
            guestIndex++;
            
            // foreach (var guest in guests)
            // {
            //     if (guest.IsProcessing) 
            //         continue;
            //     
            //     guest.gameObject.SetActive(true);
            //     guest.Initialize(guestData.guestPhoto, guestData.guestOrderData, queuePlace);
            //     guest.OnComplete += OnGuestComplete;
            //     guest.OnFailed += OnGuestFailed;
            //     queuePlace++;
            //     break;
            // }
        }
    }

    private void OnGuestFailed()
    {
        OnFailed?.Invoke();
        Debug.Log("Failed");
    }

    public IEnumerable<Guest> GetActiveGuests()
    {
        foreach (var guest in guests)
        {
            if (guest.IsProcessing)
            {
                yield return guest;
            }
        }
    }

    private void OnGuestComplete()
    {
        completedGuestAmount++;
        if (completedGuestAmount >= guestAmount)
        {
            OnComplete?.Invoke();
            // foreach (var guest in guests)
            // {
            //     guest.OnComplete -= OnGuestComplete;
            //     guest.OnFailed -= OnGuestFailed;
            // }
        }
    }

    private void ResetSettings()
    {
        completedGuestAmount = 0;
        _completedGuestSounds = 0;
        // foreach (var guest in guests)
        // {
        //     guest.OnComplete -= OnGuestComplete;
        //     guest.OnFailed -= OnGuestFailed;
        // }
    }

    private void AddCompletedSound()
    {
        if(!gameObject.activeSelf) return;
        _completedGuestSounds++;
        if(_completedGuestSounds == guestAmount) OnAllGuestsCreated?.Invoke();
    }

    private void OnEnable()
    {
        Guest.OnGuestSoundComplete += AddCompletedSound;
        LevelManager.OnNextLevelClickedAction += ResetSettings;

        Guest.OnComplete += OnGuestComplete;
        Guest.OnFailed += OnGuestFailed;
    }

    private void OnDisable()
    {
        Guest.OnGuestSoundComplete -= AddCompletedSound;
        LevelManager.OnNextLevelClickedAction -= ResetSettings;
        
        Guest.OnComplete -= OnGuestComplete;
        Guest.OnFailed -= OnGuestFailed;
        
        ResetSettings();
    }
}