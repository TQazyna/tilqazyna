using System;

[Serializable]
public class BozokAnswerModel
{
    public int inSequenceOrder;
    public string answer;

    public bool correct;

    public BozokAnswerModel(string modelAnswer, bool modelCorrect, int modelInSequenceOrder)
    {
        answer = modelAnswer;
        correct = modelCorrect;
        inSequenceOrder = modelInSequenceOrder;
    }
}