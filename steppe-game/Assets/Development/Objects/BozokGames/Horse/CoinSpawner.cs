using Development.Objects.QuickTap.Utils;
using Development.Objects.Utils;
using UnityEngine;

namespace Development.Objects.BozokGames.Horse
{
    public sealed class CoinSpawner : ObjectSpawnerAndMover
    {
        protected override void Awake()
        {
            base.Awake();
            _objectPrefabs = Resources.LoadAll<GameObject>("Bozok/HorseGame/Coin");
        }
        
        protected override void SpawnObject()
        {
            int randomIndex = Random.Range(0, _objectPrefabs.Length);
            // Rect rect = GetComponent<RectTransform>().rect;
            // float randomPositionY = Random.Range(
            //     transform.position.y - (rect.height * transform.lossyScale.y / 2),
            //     transform.position.y + rect.height * transform.lossyScale.y / 2);
            
            GameObject obj = Instantiate(
                _objectPrefabs[randomIndex], 
                new Vector3(_spawnPoint.position.x, transform.position.y), 
                Quaternion.identity,
                transform);
            
            ObjectMover objMover = obj.AddComponent<ObjectMover>();
            objMover.Initialize(this, _despawnX);
        }
    }
}