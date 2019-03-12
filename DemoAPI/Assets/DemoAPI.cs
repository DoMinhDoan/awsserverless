using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;


[Serializable]
public class Items
{
    public string addedAt;
    public string quantity;
    public string id;
    public string name;
}

[Serializable]
public class ProductData
{    
    public Items[] items;
    public string Count;
    public string ScannedCount;
}
public class DemoAPI : MonoBehaviour
{
    void Start()
    {
        StartCoroutine(GetText());
    }

    IEnumerator GetText()
    {
        //string url = "https://restfulapimongodb.herokuapp.com/api/books/";
        string url = "https://f3qsttusc3.execute-api.us-east-1.amazonaws.com/dev/products";
        //string url = "http://localhost:5656/api/books/";

        var www = UnityWebRequest.Get(url);
        

        //www.SetRequestHeader("Content-Type", "application/json");
        //www.downloadHandler = (DownloadHandler)new DownloadHandlerBuffer();

        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
        {
            Debug.Log(www.error + " code=" + www.responseCode);
        }
        else
        {
            // Show results as text
            Debug.Log(www.downloadHandler.text);

            JObject output = JObject.Parse(www.downloadHandler.text);
            JArray items = (JArray)output["Items"];
            JValue count = (JValue)output["Count"];

            IList<Items> products = items.ToObject<IList<Items>>();

            Debug.Log("Count : " + count.ToObject<int>());
            foreach (var product in products)
            {
                Debug.Log("name : " + product.name + " --- quantity : " + product.quantity);
            }
        }
    }
}
