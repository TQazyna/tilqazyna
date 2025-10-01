using Development.Managers.Bozok.HorseGame;
using Development.Objects.SevenTreasuresGame.Frisky;
using UnityEngine;

namespace Development.Objects.QuickTap
{
    public sealed class BackgroundMover : MonoBehaviour
    {
        [SerializeField] private GameObject _background;
        private GameObject[] _backgrounds = new GameObject[2];

        [SerializeField] private bool _toTheLeft;
        private int _direction;

        [SerializeField] private float _speed;
        private float _initSpeed;
        [SerializeField] private float _speedMultiplier = 1.5f;
        private float _curSpeed;

        private Vector3 _initPosition1;
        private Vector3 _initPosition2;
        private float _tileWidth;

        private void Awake()
        {
            _initSpeed = _speed;
            _curSpeed = _speed;
            _direction = _toTheLeft ? -1 : 1;

            _backgrounds[0] = Instantiate(_background, transform);
            _initPosition1 = _backgrounds[0].transform.position;

            _tileWidth = CalculateTileWidth(_backgrounds[0]);

            _backgrounds[1] = SpawnNewTile();

            Destroy(_background);
        }

        private float CalculateTileWidth(GameObject tile)
        {
            float maxX = float.MinValue;
            float minX = float.MaxValue;

            RectTransform[] rts = tile.GetComponentsInChildren<RectTransform>();

            foreach (RectTransform rt in rts)
            {
                Vector3[] corners = new Vector3[4];
                rt.GetWorldCorners(corners);

                foreach (Vector3 corner in corners)
                {
                    minX = Mathf.Min(minX, corner.x);
                    maxX = Mathf.Max(maxX, corner.x);
                }
            }
            
            return maxX - minX;
        }

        private void FixedUpdate()
        {
            foreach (GameObject background in _backgrounds)
            {
                background.transform.Translate(Vector3.right * _direction * _curSpeed * Time.deltaTime);
            }

            if (IsNeedReset())
            {
                ResetBackground();
            }
        }

        private bool IsNeedReset()
        {
            if (_toTheLeft)
            {
                return _backgrounds[0].transform.position.x <= _initPosition1.x - _tileWidth;
            }
            else
            {
                return _backgrounds[0].transform.position.x >= _initPosition1.x + _tileWidth;
            }
        }

        private GameObject SpawnNewTile()
        {
            Vector3 position = _initPosition1;
            position.x += _tileWidth * -_direction;
            _initPosition2 = position;
            return Instantiate(_backgrounds[0], _initPosition2, Quaternion.identity, transform);
        }

        private void ResetBackground()
        {
            _backgrounds[0].transform.position = _initPosition1;
            _backgrounds[1].transform.position = _initPosition2;
            _speed = _initSpeed;
        }

        private void SetCurrentSpeedZero() => _curSpeed = 0;
        private void ChangeSpeed(float percent)
        {
            Debug.Log(_curSpeed);
            _curSpeed = _speed * percent;
            Debug.Log(_curSpeed);
        }

        private void ChangeDifficulty()
        {
            _speed *= _speedMultiplier;
            _curSpeed = _speed;
        }

        private void OnEnable()
        {
            _curSpeed = _speed;
            MiniGamesBackButton.OnBackButtonPressed += ResetBackground;
            FillingImage.OnFieldFilled += SetCurrentSpeedZero;
            HorseGameManager.OnGameSpeedChanged += ChangeSpeed;
            Horse.OnChangeDifficulty += ChangeDifficulty;
        }

        private void OnDisable()
        {
            MiniGamesBackButton.OnBackButtonPressed -= ResetBackground;
            FillingImage.OnFieldFilled -= SetCurrentSpeedZero;
            HorseGameManager.OnGameSpeedChanged -= ChangeSpeed;
            Horse.OnChangeDifficulty -= ChangeDifficulty;
        }
    }
}