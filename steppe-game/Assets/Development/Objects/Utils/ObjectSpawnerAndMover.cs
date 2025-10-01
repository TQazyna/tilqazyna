using System;
using Development.Managers.Bozok.HorseGame;
using Development.Objects.QuickTap.Utils;
using Development.Objects.SevenTreasuresGame.Frisky;
using UnityEngine;
using Random = UnityEngine.Random;

namespace Development.Objects.Utils
{
    public abstract class ObjectSpawnerAndMover : MonoBehaviour
    {
        [SerializeField] private float _spawnIntervalMin = 2f;
        [SerializeField] private float _spawnIntervalMax = 5f;
        [SerializeField] protected float _objectInitSpeed = 5f;
        [SerializeField] protected float _objectSpeed = 5f;
        [SerializeField] protected float _objectSpeedMultiplier = 2f;
         protected float _objectInitSize = 1f;
         protected float _objectSize = 1f;
        [SerializeField] protected float _objectSizeMultiplier = 1.5f;
        [SerializeField] protected float _despawnX = -15f;

        protected Transform _spawnPoint;
        private float _timeUntilNextSpawn;
        [HideInInspector] public float _currentSpeed;
        
        protected GameObject[] _objectPrefabs;

        private bool isGamePaused;

        protected virtual void Awake()
        {
            _spawnPoint = transform;
            _timeUntilNextSpawn = GetRandomSpawnInterval();
            _currentSpeed = _objectSpeed;
            _objectInitSize = transform.localScale.x;
            _objectSize = _objectInitSize;
        }

        private void FixedUpdate()
        {
            if (!isGamePaused)
            {
                _timeUntilNextSpawn -= Time.deltaTime;
            }
            
            if (_timeUntilNextSpawn <= 0f)
            {
                SpawnObject();
                _timeUntilNextSpawn = GetRandomSpawnInterval();
            }
        }

        protected virtual void SpawnObject()
        {
            int randomIndex = Random.Range(0, _objectPrefabs.Length);
            GameObject obj = Instantiate(_objectPrefabs[randomIndex], _spawnPoint.position, Quaternion.identity,
                transform);
            
            obj.transform.localScale = Vector3.one * _objectSize;
            
            ObjectMover objMover = obj.AddComponent<ObjectMover>();
            objMover.Initialize(this, _despawnX);
        }

        protected virtual void DespawnObjects()
        {
            ObjectMover[] movers = FindObjectsByType<ObjectMover>(FindObjectsInactive.Include, FindObjectsSortMode.None);
            foreach (ObjectMover mover in movers)
            {
                Destroy(mover.gameObject);
            }
        }

        private float GetRandomSpawnInterval() => Random.Range(_spawnIntervalMin, _spawnIntervalMax);
        
        private void ChangeSpeed(float percent)
        {
            if (percent == 0)
            {
                isGamePaused = true;
            }
            else
            {
                isGamePaused = false;
            }
            
            _currentSpeed = _objectSpeed * percent;
        }
        
        private void ChangeDifficulty()
        {
            _objectSpeed *= _objectSpeedMultiplier;
            _currentSpeed = _objectSpeed;
            _objectSize = _objectInitSize * _objectSizeMultiplier;
        }

        private void ResetObjects()
        {
            _objectSpeed = _objectInitSpeed;
            _currentSpeed = _objectSpeed;
            _objectSize = _objectInitSize;
            isGamePaused = false;
        }

        protected virtual void OnEnable()
        {
            HorseGameManager.OnGameSpeedChanged += ChangeSpeed;
            Horse.OnChangeDifficulty += ChangeDifficulty;
        }

        protected virtual void OnDisable()
        {
            ResetObjects();
            HorseGameManager.OnGameSpeedChanged -= ChangeSpeed;
            Horse.OnChangeDifficulty -= ChangeDifficulty;
        }
    }
}