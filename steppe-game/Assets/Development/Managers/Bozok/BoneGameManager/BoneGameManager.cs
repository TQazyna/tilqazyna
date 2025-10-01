using Development.Managers.Bozok.BoneGame;
using UnityEngine;

namespace Development.Managers.Bozok.BoneGameManager
{
    public class BoneGameManager : MonoBehaviour
    {
        [SerializeField] private GameObject _vectorObject;
        private RectTransform _vectorRectTransform;

        private void Awake()
        {
            _vectorRectTransform = _vectorObject.GetComponent<RectTransform>();
        }

        private void SetVectorActiveOn() => _vectorObject.SetActive(true);
        private void SetVectorActiveOff() => _vectorObject.SetActive(false);

        private void RotateVector(Vector2 ballPosition)
        {
            Vector2 _lookDirection = _vectorRectTransform.anchoredPosition - ballPosition;
            
            float angle = Mathf.Atan2(_lookDirection.y, _lookDirection.x) * Mathf.Rad2Deg + 42 + 180;
            _vectorRectTransform.rotation = Quaternion.Euler(0, 0, angle);
        }

        private void OnEnable()
        {
            Bone.OnMovingStarted += SetVectorActiveOn;
            Bone.OnMovingEnded += SetVectorActiveOff;
            Bone.OnMoving += RotateVector;
        }

        private void OnDisable()
        {
            Bone.OnMovingStarted -= SetVectorActiveOn;
            Bone.OnMovingEnded -= SetVectorActiveOff;
            Bone.OnMoving -= RotateVector;
        }
    }
}