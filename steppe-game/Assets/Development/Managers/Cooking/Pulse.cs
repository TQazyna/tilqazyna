using UnityEngine;

public class Pulse : MonoBehaviour
{
    [SerializeField] private float pulseSpeed = 2f;
    [SerializeField] private float pulseAmount = 0.1f;

    private Vector3 _originalScale;

    private void Start()
    {
        _originalScale = transform.localScale;
    }

    private void Update()
    {
        float scaleOffset = Mathf.Abs(Mathf.Sin(Time.time * pulseSpeed)) * pulseAmount;
        transform.localScale = _originalScale + Vector3.one * scaleOffset;
    }
}