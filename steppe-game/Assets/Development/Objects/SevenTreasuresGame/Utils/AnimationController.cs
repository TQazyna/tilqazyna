using SkiaSharp.Unity;
using UnityEngine;

namespace Development.Objects.QuickTap.Utils
{
    public class AnimationController : MonoBehaviour
    {
        private SkottiePlayerV2 skottiePlayer; // Reference to the SkottiePlayer component
 
        private void Start()
        {
            skottiePlayer = GetComponent<SkottiePlayerV2>();
            // Subscribe to the OnAnimationFinished event
            skottiePlayer.OnAnimationFinished += OnAnimationFinishedHandler;
 
            // Play the animation (you can call this method when needed)
            skottiePlayer.PlayAnimation();
        }
 
        private void OnAnimationFinishedHandler(string animationStateName) {
            // This method will be called when the animation finishes playing
 
            // You can check the animationStateName if needed
            Debug.Log("Animation Finished: " + animationStateName);
 
            // Do something when the animation finishes, e.g., play another animation or trigger an event.
        }
 
        private void OnDestroy() {
            // Unsubscribe from the event when this GameObject is destroyed
            skottiePlayer.OnAnimationFinished -= OnAnimationFinishedHandler;
        }
    }
}