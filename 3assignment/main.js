const express = require("express")
const app = express()
const port = 3000
const connectDB = require('./db');
const {ObjectId} = require("mongodb")
app.use(express.static('public'))
app.use(express.json())

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/public/index.html")
})

//post ================================================
async function addBlog(req,res) {
    const db = await connectDB();
    //const newPost = await db.collection('post').insertOne({"name" : "somedieyoung"});
    const {title, textBody, author} = req.body
    if (title.trim() === ""|| textBody.trim() === ""){
        res.send({response : {errors : [{code : 400 , message : "Title or Body is empty"}]}, ok : false, data : ""})
    }else{
        const newPost = await db.collection('post').insertOne({
            "title" : title, "body" : textBody, 
            "author" : author, "date" : new Date()
        })
        res.send({response : {errors : [{code : 200 , message : ""}]}, ok : true, data : "Success"})
    }
}


app.post("/blogs", addBlog)

//================================================

//get blogs================================================
async function getBlogs(req,res){
    const db = await connectDB();
    const allPosts = await db.collection('post').find().toArray()
    res.send(allPosts)
}

app.get("/blogs", getBlogs)

//================================================

async function getBlog(req,res){
    const db = await connectDB()
    const objId = req.params.id
    const postById = await db.collection('post').findOne({_id : new ObjectId(objId)})
    res.send(postById)

}

app.get("/blogs/:id", getBlog)
//================================================


//delete by id================================================

async function deleteBlog(req,res){
    const db = await connectDB()
    const objId = req.params.id
    const result = await db.collection('post').deleteOne({_id : new ObjectId(objId)})
    const resultCount = result.deletedCount
    console.log(resultCount)
    res.send(result)
}
app.delete("/blogs/:id", deleteBlog)

app.listen(port, ()=>{

    console.log("running on 3000")

})  
