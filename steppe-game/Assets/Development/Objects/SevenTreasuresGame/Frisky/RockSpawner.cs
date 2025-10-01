using Development.Objects.Utils;
using UnityEngine;

namespace Development.Objects.QuickTap.Frisky
{
    public sealed class RockSpawner : ObjectSpawnerAndMover
    {
        protected override void Awake()
        {
            base.Awake();
            _objectPrefabs = Resources.LoadAll<GameObject>("SevenTreasures/Rocks");
        }

        protected override void OnEnable()
        {
            base.OnEnable();
            MiniGamesBackButton.OnBackButtonPressed += DespawnObjects;
            FillingImage.OnFieldFilled += DespawnObjects;
        }

        protected override void OnDisable()
        {
            base.OnDisable();
            MiniGamesBackButton.OnBackButtonPressed -= DespawnObjects;
            FillingImage.OnFieldFilled -= DespawnObjects;
        }
    }
}