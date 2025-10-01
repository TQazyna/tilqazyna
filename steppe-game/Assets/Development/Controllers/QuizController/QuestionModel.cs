using System;
using UnityEngine;

[Serializable]
public class QuestionModel
{
    public string description;

    public AnswerModel[] answers;

    public string rightAnswerContent;

    public AudioClip questionAudio, answerAudio;

    public QuestionModel(string modelDescription, AnswerModel[] modelAnswers, string modelRightAnswerContent)
    {
        description = modelDescription;
        answers = modelAnswers;
        rightAnswerContent = modelRightAnswerContent;
    }
}