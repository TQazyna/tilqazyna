using System.Collections.Generic;
using System.Linq;

public class RecipeManager
{
    private readonly Dictionary<IngredientType, List<Recipe>> _recipes = new();

    public RecipeManager()
    {
        InitializeRecipes();
    }

    private void InitializeRecipes()
    {
        _recipes[IngredientType.DoughBowl] = new List<Recipe>
        {
            new(
                new List<IngredientType>
                {
                    IngredientType.Egg, IngredientType.Flour, IngredientType.Milk, IngredientType.Yest,
                    IngredientType.Sugar, IngredientType.Salt, IngredientType.Oil, IngredientType.Water
                },
                IngredientType.DoughBaursak),
            new(
                new List<IngredientType>
                {
                    IngredientType.Flour, IngredientType.Water, IngredientType.Oil,
                    IngredientType.Egg, IngredientType.Salt
                },
                IngredientType.DoughBershmak)
        };

        _recipes[IngredientType.Board] = new List<Recipe>
        {
            new(new List<IngredientType> { IngredientType.DoughBaursak }, IngredientType.Baursak),
            new(new List<IngredientType> { IngredientType.DoughBershmak }, IngredientType.DoughBershmakCutted),
            new(new List<IngredientType> { IngredientType.MeatCooked }, IngredientType.BershmakMeatCutted),
        };

        _recipes[IngredientType.Bowl1] = new List<Recipe>
        {
            new(new List<IngredientType> { IngredientType.BershmakMeatCutted, IngredientType.BershmakBoiled },
                IngredientType.BershmakCooked),
            new (new List<IngredientType> { IngredientType.KurutBoiled}, IngredientType.KurutCooked)
        };

        _recipes[IngredientType.Bowl2] = new List<Recipe>
        {
            new(new List<IngredientType> { IngredientType.BershmakMeatCutted, IngredientType.BershmakBoiled },
                IngredientType.BershmakCooked),
            new (new List<IngredientType> { IngredientType.KurutBoiled}, IngredientType.KurutCooked)
        };

        _recipes[IngredientType.Cauldron] = new List<Recipe>
        {
            new(
                new List<IngredientType>
                {
                    IngredientType.Meat, IngredientType.SausageCooked, IngredientType.OnionPeeled,
                    IngredientType.DoughBershmakCutted
                }, IngredientType.BershmakBoiled),
        };
    }

    public Recipe GetRecipeForIngredients(IngredientType container, List<IngredientType> ingredients)
    {
        if (_recipes.TryGetValue(container, out var recipes))
        {
            return recipes.FirstOrDefault(recipe => recipe.IsMatch(ingredients));
        }

        return null;
    }
}