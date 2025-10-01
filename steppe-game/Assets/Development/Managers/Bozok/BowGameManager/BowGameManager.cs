using Development.Objects.BozokGames.BowGame;
using UnityEngine;

public sealed class BowGameManager : MonoBehaviour
{
    [SerializeField] private GameObject _vectorObject;

    private void SetVectorActiveOn() => _vectorObject.SetActive(true);
    private void SetVectorActiveOff() => _vectorObject.SetActive(false);
    
    private void OnEnable()
    {
        Arrow.OnArrowMoveStarted += SetVectorActiveOn;
        Arrow.OnArrowReleased += SetVectorActiveOff;
    }

    private void OnDisable()
    {
        Arrow.OnArrowMoveStarted -= SetVectorActiveOn;
        Arrow.OnArrowReleased -= SetVectorActiveOff;
    }
}