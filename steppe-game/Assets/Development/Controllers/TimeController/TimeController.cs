using System;
using System.Threading.Tasks;
using UnityEngine;

public class TimeController
{
    public async Task WaitTimed(double seconds)
    {
        Debug.Log("Long running task started");
        // wait for 5 seconds, update your UI
        await Task.Delay(TimeSpan.FromSeconds(seconds));

        // update your UI
        Debug.Log("Long running task has completed");
    }
}