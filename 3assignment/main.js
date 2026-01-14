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
//get blog by id
async function getBlog(req,res){
    const db = await connectDB()
    const objId = req.params.id
    if (ObjectId.isValid(objId)){
        const postById = await db.collection('post').findOne({_id : new ObjectId(objId)})
        res.send({response : {errors : [{code : 200 , message : ""}]}, ok : true, data : postById})
    }else{
        res.send({response : {errors : [{code : 404 , message : "Post not found!"}]}, ok : false, data : ""})
    }

}

app.get("/blogs/:id", getBlog)
//================================================


//delete by id================================================

async function deleteBlog(req,res){
    const db = await connectDB()
    const objId = req.params.id
    if (ObjectId.isValid(objId)){
        await db.collection('post').deleteOne({_id : new ObjectId(objId)})
        res.send({response : {errors : [{code : 200 , message : ""}]}, ok : true, data : objId})
    }else{
        res.send({response : {errors : [{code : 400 , message : "Bad id"}]}, ok : false, data : ""})
    }
}
app.delete("/blogs/:id", deleteBlog)
//=================================================


//put=================================================
async function putBlog(req,res){
    const db = await connectDB()
    const objId = req.params.id
    const {title, body, author} = await req.body
    if (title.trim() === ""|| body.trim() === ""){
        res.send({response : {errors : [{code : 400 , message : "Title or Body is empty"}]}, ok : false, data : ""})
    }else{
    
        if (ObjectId.isValid(objId)){
            await db.collection('post').updateOne({_id : new ObjectId(objId)}, {$set : {title : title, body : body, author : author, update_date : new Date()}})
            res.send({response : {errors : [{code : 200 , message : ""}]}, ok : true, data : objId})
        }else{
            res.send({response : {errors : [{code : 404 , message : "Post not found!"}]}, ok : false, data : ""})
        }
    }
}

app.put("/blogs/:id", putBlog)

//==================================================================================================
app.listen(port, ()=>{

    console.log("running on 3000")

})  
