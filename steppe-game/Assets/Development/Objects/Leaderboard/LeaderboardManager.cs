using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

public class LeaderboardManager : MonoBehaviour
{
    [Header("Content Object")]
    [SerializeField] private GameObject content;

    [Header("Leader card prefabs")]
    [SerializeField] private GameObject leaderFirstPrefab;
    [SerializeField] private GameObject leaderSecondPrefab;
    [SerializeField] private GameObject leaderThirdPrefab;

    [Header("Loading items")]
    [SerializeField] private Slider loader;
    [SerializeField] private GameObject loaderObject;

    private RealtimeManager _realtimeManager;
    private StateManager _stateManager;

    private List<GameObject> leaderCards = new();

    public void Initialize(RealtimeManager realtimeManager, StateManager stateManager)
    {
        _realtimeManager = realtimeManager;
        _stateManager = stateManager;
    }

    public async Task ReadData()
    {
        loaderObject.SetActive(true);
        loader.value = 0;

        const float totalSteps = 10;
        for (var i = 0; i < totalSteps / 2; i++)
        {
            // yield return new WaitForSeconds(0.05f);
            await Task.Delay(TimeSpan.FromSeconds(0.05f));
            loader.value = (i + 1) / totalSteps;
        }

        var userModel = await _realtimeManager.ReadUserData(_stateManager.PlayerName);

        // Instantiate user leader card
        var leaderFirstObj = InstantPrefab(leaderFirstPrefab);
        var leaderFirstCardManager = leaderFirstObj.GetComponent<LeaderCardManager>();
        leaderFirstCardManager.SetCardInfo(userModel: userModel, userPlace: 1);
        leaderCards.Add(leaderFirstObj);

        var users = await _realtimeManager.ReadOtherUsersData(_stateManager.PlayerName);

        var userIndex = 0;
        foreach (var user in users)
        {
            if (userIndex < 2)
            {
                // Instantiate second two leader cards
                var leaderSecondObj = InstantPrefab(leaderSecondPrefab);
                var leaderSecondCardManager = leaderSecondObj.GetComponent<LeaderCardManager>();
                leaderSecondCardManager.SetCardInfo(userModel: user, userPlace: userIndex + 2);
                leaderCards.Add(leaderSecondObj);
            }
            else
            {
                // Instantiate other leader cards
                var leaderThirdObj = InstantPrefab(leaderThirdPrefab);
                var leaderThirdCardManager = leaderThirdObj.GetComponent<LeaderCardManager>();
                leaderThirdCardManager.SetCardInfo(userModel: user, userPlace: userIndex + 2);
                leaderCards.Add(leaderThirdObj);
            }

            userIndex++;
        }

        for (var i = 4; i < totalSteps; i++)
        {
            // yield return new WaitForSeconds(0.05f);
            await Task.Delay(TimeSpan.FromSeconds(0.05f));
            loader.value = (i + 1) / totalSteps;
        }

        loaderObject.SetActive(false);
    }

    // Update is called once per frame
    public void ClearCards()
    {
        foreach (var obj in leaderCards)
        {
            Destroy(obj);
        }

        leaderCards = new();
    }

    GameObject InstantPrefab(GameObject prefab)
    {
        var go = Instantiate(prefab);
        go.transform.parent = content.transform;
        go.transform.localScale = Vector3.one;

        return go;
    }
}
