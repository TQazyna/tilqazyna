using System;
using UnityEngine;
using UnityEngine.EventSystems;

namespace Development.Objects.BozokGames.Utils
{
    public sealed class TouchTranslator : MonoBehaviour, IBeginDragHandler, IDragHandler, IEndDragHandler
    {
        public static event Action<PointerEventData> OnBeginDragAction;
        public static event Action<PointerEventData> OnDragAction;
        public static event Action<PointerEventData> OnEndDragAction;

        public void OnBeginDrag(PointerEventData eventData) => OnBeginDragAction?.Invoke(eventData);
        public void OnDrag(PointerEventData eventData) => OnDragAction?.Invoke(eventData);
        public void OnEndDrag(PointerEventData eventData) => OnEndDragAction?.Invoke(eventData);
    }
}