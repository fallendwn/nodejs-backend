const USER_BUTTON = document.getElementById("user-button")
const USER_DIV = document.getElementById("random-user")
USER_BUTTON.addEventListener("click",async ()=>{

    const response = await fetch("http://localhost:3000/user")
    const data = await response.json()
    USER_DIV.textContent = ""
    let news = []

    //go through object
    Object.entries(data).forEach(([key, value])=>{
        let userP = document.createElement("p")
        //because news has other logic
        if (key == "news_result"){
            news = value
            return
        };
        if (key === "pfp" || key === "flag") {
            let img = document.createElement("img");
            img.src = value; // просто ссылка
            userP.textContent = `${key} : `;
            USER_DIV.appendChild(userP);
            USER_DIV.appendChild(img);
        } else {
            userP.textContent = `${key} : ${value}`;
            USER_DIV.appendChild(userP);
        }
    })


    //parse news data in new loop
    for(let i = 0 ; i < news.length; i++){
        //through loop get create new div h2 and etc.
        let mainDiv = document.createElement("div")
        let h2Title = document.createElement("h2")
        let imageDiv = document.createElement("div")
        let pDescription = document.createElement("p")
        let pURL = document.createElement("p")

        //fill new elements with data
        h2Title.textContent = news[i][0]
        imageDiv.style.backgroundImage = `url('${news[i][1]}')`
        pDescription.textContent = news[i][2]
        pURL.textContent = news[i][3]

        //add classes with css
        mainDiv.classList.add("news")
        h2Title.classList.add("title")
        imageDiv.classList.add("news-image")
        pDescription.classList.add("description")
        pURL.classList.add("url")

        //append everything in parent div and then in document body.
        mainDiv.appendChild(h2Title)
        mainDiv.appendChild(imageDiv)
        mainDiv.appendChild(pDescription)
        mainDiv.appendChild(pURL)
        document.body.appendChild(mainDiv)
    }

})
