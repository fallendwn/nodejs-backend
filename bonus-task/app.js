
const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(express.static('public'));
const port = 3000
let id = 1
let someArray = []
app.get("/", (req,res)=>{

    res.send("hello user")

})

app.get("/json", (req,res)=>{

    res.json({"text":"hi", "numbers":[1,2,3]})

})
app.get("/profile/:username", (req,res)=>{

    res.send(`Profile page ${req.params.username}`)

})
app.get("/letters", (req,res)=>{

    const lettersQuery = req.query.query;    
    var charArray = lettersQuery.split('')
    charArray.reverse()
    charArray = charArray.join('')
    res.send(`${lettersQuery} \n ${lettersQuery.toUpperCase()} \n ${lettersQuery.length} \n ${charArray}`)
})


app.get("/users", (req,res)=>{
    res.send(someArray)
})

app.post("/users",(req,res)=>{
    const id = req.body.id
    const name = req.body.name
    someArray.push([`${id} : ${name}`])
    res.send("User created")

})

app.put("/users/:id", (req,res)=>{

    console.log(`user with id ${req.params.id} has been changed`)

})

app.delete("/users/:id", (req,res)=>{

    console.log(`user with id ${req.params.id} has been deleted`)

})


app.listen(port, ()=>{

    console.log("running on localhost:3000")

})
