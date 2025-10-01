using System;
using UnityEngine;

[Serializable]
public class BozokQuestionModel
{
    public bool isSequence;
    public string description;

#nullable enable
    public Sprite? additionalImage;
    public string? wordByCharacter;
    public string? rightAnswerHintText;
    public AudioClip? questionAudio, answerAudio, wrongAnswerAudio;
#nullable disable

    public BozokAnswerModel[] answers;
}