using System.Collections.Generic;
using System.Threading.Tasks;
using Firebase.Firestore;
using UnityEngine;

public class RealtimeManager
{
    FirebaseFirestore firestore;

    public void Initialize()
    {
        firestore = FirebaseFirestore.DefaultInstance;
    }

    public async Task SaveUserData(string userName, CharacterSex userSex, int userLevel, int userPoints)
    {
        UserModel userModel = new(modelName: userName, modelSex: userSex, modelLevel: userLevel, modelPoints: userPoints);

        await firestore.Collection("Users").Document(userModel.Name).SetAsync(userModel);
    }

    public async Task<UserModel> ReadUserData(string userName)
    {
        var snapshot = await firestore.Collection("Users").Document(userName).GetSnapshotAsync();

        var userModel = snapshot.ConvertTo<UserModel>();

        Debug.Log("Name: " + userModel.Name);

        return userModel;
    }

    public async Task<List<UserModel>> ReadOtherUsersData(string userName)
    {
        List<UserModel> users = new();

        var snapshot = await firestore.Collection("Users").OrderByDescending("Points").Limit(30).GetSnapshotAsync();

        foreach (var doc in snapshot.Documents)
        {
            var userModel = doc.ConvertTo<UserModel>();

            if (userModel.Name != userName)
            {
                users.Add(userModel);
            }
        }

        return users;
    }
}
