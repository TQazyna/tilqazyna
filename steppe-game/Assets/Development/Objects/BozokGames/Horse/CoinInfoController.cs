using System;
using TMPro;
using UnityEngine;

namespace Development.Objects.BozokGames.Horse
{
    public sealed class CoinInfoController : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI _TMPro;
        [SerializeField] private uint _coinsToQiuz = 5;
        private uint _coinCount;
        public static event Action OnTargetReached;

        private void Awake()
        {
            _coinCount = 0;
            UpdateText();
        }

        private void AddCoin()
        {
            _coinCount++;
            UpdateText();
            if (_coinCount % _coinsToQiuz == 0)
            {
                OnTargetReached?.Invoke();
            }
        }

        private void UpdateText() => _TMPro.text = _coinCount.ToString();

        public void ResetCoins()
        {
            _coinCount = 0;
            UpdateText();
        }

        private void OnEnable() => Coin.OnCoinCollected += AddCoin;
        private void OnDisable() => Coin.OnCoinCollected -= AddCoin;
    }
}