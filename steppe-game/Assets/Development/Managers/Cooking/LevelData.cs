using System;
using UnityEngine;
using UnityEngine.Localization;

[CreateAssetMenu(fileName = "NewLevelData", menuName = "Cooking/Level Data")]
public class LevelData : ScriptableObject
{
    [Serializable]
    public class GuestData
    {
        public Sprite guestPhoto;
        public OrderData guestOrderData;
    }

    [Serializable]
    public class OrderData
    {
        public float waitingTime;
        public DishData[] dishes;
        public int dishPrice;
        public LocalizedString OrderPhrase;
        public AudioClip orderSound;
    }
    
    [Serializable]
    public class DishData
    {
        public Sprite dishPhoto;
        public IngredientType dishType;
    }

    public int levelNumber;
    public int sublevelNumber;
    public int pointsAmount;
    public int expAmount;
    public GuestData[] guests;
}