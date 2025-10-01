using UnityEngine;

[CreateAssetMenu(fileName = "NewQuizQuestion", menuName = "Quiz/QuizData")]
public class QuizInfo : ScriptableObject
{
    public QuestionModel[] questions;
}