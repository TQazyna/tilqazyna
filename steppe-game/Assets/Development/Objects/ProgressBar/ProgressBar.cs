using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class ProgressBar : MonoBehaviour
{
    [SerializeField] private Slider slider;

    // Uncomment to see how loading animates
    // public void Update()
    // {
    //     slider.value += .1f * Time.deltaTime;
    // }

    public void Awake()
    {
        // Comment to see how loading animates
        LoadLevel(1);
    }

    public void LoadLevel(int sceneIndex)
    {
        StartCoroutine(LoadScreenAsync(sceneIndex));
    }

    private IEnumerator LoadScreenAsync(int sceneIndex)
    {
        var operation = SceneManager.LoadSceneAsync(sceneIndex);

        while (!operation.isDone)
        {
            var progress = Mathf.Clamp01(operation.progress / .9f);

            slider.value = progress;

            yield return null;
        }
    }
}