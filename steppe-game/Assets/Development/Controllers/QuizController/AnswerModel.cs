using System;

[Serializable]
public class AnswerModel
{
    public string answer;

    public bool correct;

    public AnswerModel(string modelAnswer, bool modelCorrect)
    {
        answer = modelAnswer;
        correct = modelCorrect;
    }
}