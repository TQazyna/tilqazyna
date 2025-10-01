using UnityEngine;
using UnityEngine.EventSystems;

public class DraggableObject : MonoBehaviour, IBeginDragHandler, IDragHandler, IEndDragHandler
{
    [SerializeField] private RectTransform _rectTransform;
    [SerializeField] private IngredientType _ingredientType;
    private bool canDrag = true;
    
    
    public RectTransform RectTransform => _rectTransform;
    public IngredientType IngredientType => _ingredientType;

    public void OnBeginDrag(PointerEventData eventData)
    {
        if(!canDrag) return;
        DragDropManager.Instance.StartDragging(gameObject, _rectTransform, eventData);
    }

    public void OnDrag(PointerEventData eventData)
    {
        DragDropManager.Instance.DragObject(_rectTransform, eventData);
    }

    public void OnEndDrag(PointerEventData eventData)
    {
        DragDropManager.Instance.StopDragging(_rectTransform, eventData, _ingredientType);
    }

    private void CanDragPotOrCauldron(IngredientType ingredientType)
    {
        if (_ingredientType == ingredientType)
        {
            canDrag = true;
        }
    }
    
    private void CantDragPotOrCauldron(IngredientType ingredientType)
    {
        if (_ingredientType == ingredientType)
        {
            canDrag = false;
        }
    }
    
    private void OnEnable()
    {
        CookingViewManager.OnTimerStarted += CantDragPotOrCauldron;
        CookingViewManager.OnTimerFinished += CanDragPotOrCauldron;
    }

    private void OnDisable()
    {
        CookingViewManager.OnTimerStarted -= CantDragPotOrCauldron;
        CookingViewManager.OnTimerFinished -= CanDragPotOrCauldron;
    }
}