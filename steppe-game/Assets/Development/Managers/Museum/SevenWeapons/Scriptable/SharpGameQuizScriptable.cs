using UnityEngine;

[CreateAssetMenu(fileName = "NewSharpGameQuizData", menuName = "SharpGame/SharpGameQuizData")]
public class SharpGameQuizInfo : ScriptableObject
{
    public SharpGameQuestionModel[] questions;
}