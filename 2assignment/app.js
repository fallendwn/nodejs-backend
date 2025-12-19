const express = require("express")
const app = express()
const port = 3000
//express port
require('dotenv').config();

//store api keys
const API = {
    "exchange_api" : `${process.env.EXCHANGE_RATE_API}`,
    "news_api" : `${process.env.NEWS_API_KEY}`
}

//app.use
app.use(express.static('public'));
app.use(express.json())


//default query to upload index.html
app.get("/", (req,res)=>{

    res.sendFile(__dirname + "/public/index.html")

})

//news api https://newsapi.org/v2/everything?q=Apple&from=2025-12-17&sortBy=popularity&apiKey=
//https://v6.exchangerate-api.com/v6/ KEY HERE /latest/USD


app.get("/user", async (req,res)=>{
    //user random data
    const random_user_response = await fetch("https://randomuser.me/api/")
    const random_user_data = await random_user_response.json()
    const random_user_results = random_user_data.results[0]

    //country data
    const country = await fetch(`https://restcountries.com/v3.1/name/${random_user_results.location.country}`)
    const country_json = await country.json()
    const country_currency = Object.keys(country_json[0].currencies)[0]
    const country_language = country_json[0].languages
    const country_languages_array = Object.values(country_language)

    //currency
    const currency_response = await fetch(`https://v6.exchangerate-api.com/v6/${API.exchange_api}/latest/${country_currency}`)
    const currency_data = await currency_response.json()
    const conversion_rates = currency_data.conversion_rates

    //get country in format i need
    const conversion_rates_list = [`1${country_currency} : ${conversion_rates.USD}USD`, ` 1${country_currency} : ${conversion_rates.KZT}KZT`]
    let cca3_country_name = country_json[0].cca3
    cca3_country_name = cca3_country_name.toLowerCase()

    //response for news api
    const news_response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API.news_api}`)
    const news_response_data = await news_response.json()

    news_articles = news_response_data.articles
    news_results = [] 


    let size = 0
    //add first 5 news
    if (news_articles.length <=5){
        size = news_articles.length
    }else{
        size =5
    }

    for(let i = 0 ; i < size; i++){
        let current_article = news_articles[i]
        news_results.push([current_article.title,current_article.urlToImage, current_article.description, current_article.url])
    }

    //send data i need
    res.json({"name" : random_user_results.name.first, "surname" : random_user_results.name.last, "gender" : random_user_results.gender, 
        "age" : random_user_results.dob.age, 
        "address" : random_user_results.location.street.number +" "+ random_user_results.location.street.name, 
        "pfp" : random_user_results.picture.large, "country" : random_user_results.location.country, "city" : random_user_results.location.city, 
        "languages" : country_languages_array, "capital" : country_json[0].capital,
        "conversion rate" : conversion_rates_list, "flag" : country_json[0].flags.png,"news_result" : news_results})
    
})


app.listen(port, ()=>{

    console.log("running on localhost:3000")

})