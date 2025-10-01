using System;
using UnityEngine;

namespace Development.Managers
{
    public class LoadingCanvasManager : MonoBehaviour
    {
        public static LoadingCanvasManager Instance { get; private set; }

        public void Initialize()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
        
            Instance = this;
        }
    }
}