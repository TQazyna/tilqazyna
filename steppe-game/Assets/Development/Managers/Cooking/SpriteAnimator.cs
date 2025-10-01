using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class SpriteAnimator : MonoBehaviour
{
    [SerializeField] private Image targetImage;
    [SerializeField] private Sprite[] sprites;
    [SerializeField] private float frameDuration = 0.1f;

    private Coroutine _animationCoroutine;

    private void Awake()
    {
        targetImage.enabled = false;
    }

    public void StartAnimation()
    {
        if (sprites.Length == 0 || targetImage == null) return;
        targetImage.enabled = true;
        _animationCoroutine ??= StartCoroutine(AnimateSprites());
    }

    public void StopAnimation()
    {
        if (_animationCoroutine != null)
        {
            StopCoroutine(_animationCoroutine);
            _animationCoroutine = null;
        }
        targetImage.enabled = false;
    }

    private IEnumerator AnimateSprites()
    {
        var index = 0;
        while (true)
        {
            targetImage.sprite = sprites[index];
            index = (index + 1) % sprites.Length;
            yield return new WaitForSeconds(frameDuration);
        }
    }
}