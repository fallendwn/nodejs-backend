const http = require("http");

const port = 3000;

// const server = http.createServer((req, res) => {

//     res.writeHead(200, {"Content-Type" : "text/plain"});
//     res.end("Welcome");

// })
// server.listen(port, ()=>{console.log("Server running on http://localhost:3000");})

const express = require("express");
const app = express();

app.use(express.json())
app.use(express.static('public'));

app.get("/", (req,res)=>{

    res.sendFile(__dirname + "/index.html");

})

app.post("/button-click", (req,res)=>{

    const {height,weight} = req.body;

    if (height <=0 || weight<=0){

        return res.json({success:false});
    
    }

    const bmi = weight / (height*height);
    let result
    if (bmi < 18.5){
        result = "underweight";
    }
    else if(bmi < 24.9){
        result = "normal weight";
    }
    else if (bmi<29.9){
        result = "overweight"
    }
    else result = "obese";

    return res.json({

        success : true,
        result : result,
        bmi : bmi.toFixed(2)


    })

})

app.listen(port, ()=>{

    console.log("running on localhost:3000");

})