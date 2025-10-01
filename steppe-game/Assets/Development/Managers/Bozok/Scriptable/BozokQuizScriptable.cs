using UnityEngine;

[CreateAssetMenu(fileName = "NewBozokQuizData", menuName = "BozokQuiz/BozokQuizData")]
public class BozokQuizInfo : ScriptableObject
{
    public BozokQuestionModel[] questions;
}