const addPostButton = document.querySelector("#add-post")
const deletePostButton = document.querySelector("#delete-post")

const patchPostButton = document.querySelector("#patch-post")
const getPostButton = document.querySelector("#get-post")

const popUp = document.querySelector(".pop-up")
const addPostForm = document.querySelector("#add-post-form")
const deletePostForm = document.querySelector("#delete-post-form")
const patchPostForm = document.querySelector("#patch-post-form")

const responseP = document.querySelector("#response")

const submitButton = document.querySelector(".submit-button")

const forms = {
    add : addPostForm,
    delete: deletePostForm,
    patch : patchPostForm
}

function showForm(type){

    popUp.style.display = "block"
    Object.values(forms).forEach(form=>{
        form.style.display = 'none'
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


async function readInput(){
    let type
    Object.values(forms).forEach(form=>{
        if (form.style.display === "block"){
            type = form
        }

    })
    let data = []
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
        console.log(responseData)
        if (responseData.ok == true){
            responseP.textContent = "Success"
        }else{
            responseP.textContent = "Fail"
        }
    }else if(type === "delete-post-form"){
        const id = document.querySelector("#delete-id").value
        const response = await fetch(`http://localhost:3000/blogs/${id}`, {

            method: "DELETE",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({})

        })
            console.log(response)
    }else if(type === "patch-post-form"){
        data.push(
        document.querySelector("#patch-id"),
        document.querySelector("#patch-title").value, 
        document.querySelector("#patch-body").value, 
        document.querySelector("#patch-author").value)
        const response = await fetch(`http://localhost:3000/blogs/${data[0]}`, {
            method: "PATCH",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        console.log(response)
    }
}

submitButton.addEventListener("click", readInput)
console.log("something")
