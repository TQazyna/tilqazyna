using System;
using TMPro;
using UnityEngine;

namespace Development.Managers.TraditionalLife
{
    public sealed class TraditionalLifeManager : MonoBehaviour
    {
        [Header("Info group text UI")]
        [SerializeField] private TextMeshProUGUI _coinsText;
        [SerializeField] private TextMeshProUGUI _leaderPointsText;
        [Header("Canvases")] 
        [SerializeField] private GameObject _endLevelCanvas;
        private StateManager _stateManager;
        [Header("Objects")] 
        [SerializeField] private GameObject _tazyWithButton;

        private void Awake() => _stateManager = FindAnyObjectByType<StateManager>();
        
        public void GiveFinalPoints()
        {
            _coinsText.text = "4 тиын";
            _leaderPointsText.text = "60 ұпай";
            _stateManager.CurrencyAmount += 4;
            _stateManager.PointsAmount += 60;
            _stateManager.ExperienceAmount += 80;
        }

        public void TurnOnEndLevelCanvas()
        {
            GiveFinalPoints();
            _endLevelCanvas.SetActive(true);
        }

        public void ResetScene()
        {
            _tazyWithButton.SetActive(true);
        }

        private void OnDisable() => ResetScene();
    }
}