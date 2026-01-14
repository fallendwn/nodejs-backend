const addPostButton = document.querySelector("#add-post")
const deletePostButton = document.querySelector("#delete-post")
const patchPostButton = document.querySelector("#patch-post")
const getPostButton = document.querySelector("#get-post")

const popUp = document.querySelector(".pop-up")
const addPostForm = document.querySelector("#add-post-form")
const deletePostForm = document.querySelector("#delete-post-form")
const patchPostForm = document.querySelector("#patch-post-form")
const getPostForm = document.querySelector("#get-post-form")

const responseP = document.querySelector("#response")
const submitButton = document.querySelector(".submit-button")


const postDiv = document.querySelector("#post-div")

const forms = {
    add : addPostForm,
    delete: deletePostForm,
    patch : patchPostForm,
    get : getPostForm
}

function showForm(type){

    popUp.style.display = "block"
    Object.values(forms).forEach(form=>{
        form.style.display = 'none'
        responseP.textContent = ""
    })
    forms[type].style.display = 'block';
}

function toggleForm(type) {
    const isOpen = popUp.style.display === 'block' && 
    forms[type].style.display === 'block';

    if (isOpen) {
        popUp.style.display = 'none';
        forms[type].style.display = 'none';
    }else {
        showForm(type);
  }
}
addPostButton.addEventListener("click", ()=> toggleForm("add"))
patchPostButton.addEventListener("click", ()=> toggleForm("patch"))
deletePostButton.addEventListener("click", ()=> toggleForm("delete"))
getPostButton.addEventListener("click", ()=>toggleForm("get"))

async function parseData(everything, objectId){
    postDiv.innerHTML = ""
    let response;
    if (everything) {
        response = await fetch("/blogs");
    }else{
        response = await fetch(`/blogs/${objectId}`);
    }
    const responseData = await response.json();
    if (everything === true) {
        postsToRender = responseData;
    } else {
        if (responseData.ok === true && responseData.data) {
            postsToRender = [responseData.data];
        } else {
            postsToRender = [];
            responseP.textContent = "Fail Post not found";
        }
    }
    postsToRender.forEach(data => {
            const newPost = document.createElement("div");
            newPost.classList.add("post");
            const title = data.title;
            const body = data.body || data.textBody; 
            const author = data.author || "Anonymous";
            const date = new Date(data.date).toLocaleDateString("ru-RU");
            newPost.innerHTML = `

            <p class="title"><strong>${title}</strong></p>
            <div class="post-body">${body}</div>
            <p class="author">Автор: ${author}</p>
            <p class="time">${date}</p>`

            postDiv.appendChild(newPost);
        })

}

async function readInput(){
    let type
    parseData(true, "")
    Object.values(forms).forEach(form=>{
        if (form.style.display === "block"){
            type = form
        }

    })
    if (type.id === "add-post-form"){
        const response = await fetch("http://localhost:3000/blogs", {
            method: "POST",
            headers : {"Content-Type" : "application/json"},
            body: JSON.stringify({
                title : document.querySelector("#add-title").value , 
                textBody : document.querySelector("#add-body").value,
                author : document.querySelector("#add-author").value
            })
        })   
        const responseData = await response.json()
        if (responseData.ok == true){
            responseP.textContent = "Success"
            parseData(true, "")
            popUp.style.display = "none"
        }else{
            responseP.textContent = "Fail"
        }
    }else if(type.id === "delete-post-form"){
        const id = document.querySelector("#delete-id").value
        console.log(id)
        const response = await fetch(`http://localhost:3000/blogs/${id}`, {

            method: "DELETE",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({})

        })
        const responseData = await response.json()
        if (responseData.ok == true){
            responseP.textContent = "Success"
            parseData(true, "")
            popUp.style.display = "none"
        }else{
            responseP.textContent = "Fail " + responseData.response.errors[0].message
        }
        
    }else if(type.id === "patch-post-form"){
        const putId = document.querySelector("#patch-id").value
        const response = await fetch(`http://localhost:3000/blogs/${putId}`, {
            method: "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(
                {
                    title : document.querySelector("#patch-title").value,
                    body : document.querySelector("#patch-body").value,
                    author : document.querySelector("#patch-author").value
                }
            )
        })
        const responseData = await response.json()
        if (responseData.ok == true){
            responseP.textContent = "Success"
            parseData(true, "")
            popUp.style.display = "none"
        }else{
            responseP.textContent = "Fail " + responseData.response.errors[0].message
        }
    }else{
        const getId = document.querySelector("#get-post-id").value
        const response = await fetch(`http://localhost:3000/blogs/${getId}`, {
            method : "GET",
            headers : 
            {
                "Content-Type" : "application/json"
            }
        })
        const responseData = await response.json()
        if (responseData.ok == true){
            responseP.textContent = "Success"
            parseData(false, getId)
            popUp.style.display = "none"
        }else{
            responseP.textContent = "Fail " + responseData.response.errors[0].message
        }

    }
}

submitButton.addEventListener("click", readInput)

document.addEventListener("DOMContentLoaded", () => {
    parseData(true, "");
});