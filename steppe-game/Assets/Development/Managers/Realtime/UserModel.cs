using System.Collections.Generic;
using Firebase.Firestore;

[FirestoreData]
public class UserModel
{
    [FirestoreProperty]
    public string Name { get; set; }

    [FirestoreProperty]
    public int Level { get; set; }

    [FirestoreProperty]
    public int Points { get; set; }

    [FirestoreProperty]
    public CharacterSex Sex { get; set; }

    public UserModel(string modelName, CharacterSex modelSex, int modelLevel, int modelPoints)
    {
        Name = modelName;
        Sex = modelSex;
        Level = modelLevel;
        Points = modelPoints;
    }

    public UserModel() { }
}