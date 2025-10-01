using System.Collections.Generic;
using System.Linq;

public class Recipe
{
    public List<IngredientType> RequiredIngredients { get; }
    public IngredientType Result { get; }
     
    public Recipe(List<IngredientType> requiredIngredients, IngredientType result)
    {
        RequiredIngredients = requiredIngredients;
        Result = result;
    }
     
    public bool IsMatch(List<IngredientType> ingredients)
    {
        return RequiredIngredients.All(ingredients.Contains);
    }
}