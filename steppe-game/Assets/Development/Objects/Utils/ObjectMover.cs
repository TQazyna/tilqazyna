using Development.Objects.Utils;
using UnityEngine;

namespace Development.Objects.QuickTap.Utils
{
    public sealed class ObjectMover : MonoBehaviour
    {
        private ObjectSpawnerAndMover _boss;
        private float _despawnX;

        public void Initialize(ObjectSpawnerAndMover boss, float despawnX)
        {
            _boss = boss;
            _despawnX = despawnX;
        }

        private void FixedUpdate()
        {
            transform.Translate(Vector3.left * _boss._currentSpeed * Time.deltaTime);

            if (transform.position.x <= _despawnX)
            {
                Destroy(gameObject);
            }
        }
    }
}