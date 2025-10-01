using System.Collections.Generic;
using System.Linq;

namespace Development.Managers.Cooking
{
    public class IngredientPrerequisites
    {
        private readonly Dictionary<(IngredientType ingredient, IngredientType container), List<IngredientType>> _prerequisites = new();

        public IngredientPrerequisites()
        {
            InitializePrerequisites();
        }

        private void InitializePrerequisites()
        {
            // Баурсаки требуют масло в кастрюлях
            _prerequisites[(IngredientType.Baursak, IngredientType.Pot)] = new List<IngredientType> { IngredientType.Oil };
            _prerequisites[(IngredientType.Baursak, IngredientType.Pot2)] = new List<IngredientType> { IngredientType.Oil };
        
            // Можно добавить другие предварительные условия
            // Например: мясо требует соль в казане
            // _prerequisites[(IngredientType.Meat, IngredientType.Cauldron)] = new List<IngredientType> { IngredientType.Salt };
        }

        public bool CheckPrerequisites(IngredientType ingredient, IngredientType container, List<IngredientType> containerIngredients)
        {
            if (_prerequisites.TryGetValue((ingredient, container), out var requiredIngredients))
            {
                return requiredIngredients.All(containerIngredients.Contains);
            }
            return true;
        }
    }
}