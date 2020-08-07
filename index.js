const express=require('express');
const app=express();
const mongodb=require('mongodb');
const bodyParser=require('body-parser');
const cors=require('cors');
const url=`mongodb+srv://admin:admin123@cluster0.sln75.mongodb.net/facebook?retryWrites=true&w=majority`
//const url="mongodb://localhost:27017"
app.use(bodyParser());
app.use(cors());

app.get("/getstatus", async (req,res)=>{
    try{
        let client=await mongodb.connect(url);
        let db=client.db("facebook");
        let data=await db.collection("status").find().toArray();
        res.send(data);
        client.close();
    }catch(err){
        console.log(err);
    }
} )

app.post("/post",async (req,res)=>{
    console.log(req.body);
    try{
        let client=await mongodb.connect(url);
        let db=client.db("facebook");
        db.collection("status").insertOne({
            "_id":req.body.id,
            "status":req.body.stats,
            "likes":0
        })
        client.close();
    }catch(err){
        console.log(err)
    }
})
app.get('/likes/:id', async (req,res)=>{
    console.log(req.params)
    try{
        let client=await mongodb.connect(url);
        let db=client.db("facebook");
        let data=await db.collection("status").findOneAndUpdate(
            { "_id" : +req.params.id },
             { $inc: { "likes" : 1} }
        );
        res.send({"message":"done"});
        client.close();
    }catch(err){
        console.log(err)
    }

})

app.post("/postcomment",async (req,res)=>{
    console.log(req.body);
    try{
        let client=await mongodb.connect(url);
        let db=client.db("facebook");
        db.collection("comments").insertOne({
        
            "statusno":req.body.id,
            "data":req.body.comment
        })
        client.close();
    }catch(err){
        console.log(err)
    }
})
app.listen(process.env.PORT||4040,()=>{
    console.log("listening");
})

app.get("/getcomments/:id", async (req,res)=>{
    console.log(req.params.id);
    try{
        let client=await mongodb.connect(url);
        let db=client.db("facebook");
        let data=await db.collection("comments").find({
            "statusno":req.params.id
         }).toArray();
         res.send(data);
         console.log("getting comment works?",data);
         client.close();
         
}catch(err){
    console.log(err);
}
});
   