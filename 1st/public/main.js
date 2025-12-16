const form_button = document.getElementById("form-button");
const height = document.getElementById("height-value");
const weight = document.getElementById("weight-value");
const final_answer = document.getElementById("final-answer")
const result_block = document.getElementById("result")
const placeholder_block = document.getElementById("placeholder-block")

form_button.addEventListener('click', async ()=>{   

    let height_value = height.value;
    let weight_value = parseFloat(weight.value);
    height_value = parseFloat(height_value) / 100;


    try{

        const response = await fetch("/button-click", {
            
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body :  JSON.stringify ({height : height_value, weight : weight_value})

        })

        const data = await response.json();
        console.log(data);
        if (data.success){
            const bmi = data.bmi
            const result = data.result
            final_answer.innerText = `Your BMI is ${bmi} and you are: `;
            if(result == "underweight"){
                result_block.style.color = "gray";
            }else if(result == "normal weight"){
                result_block.style.color = "green";
            }else if(result == "overweight"){
                result_block.style.color = "orange"
            }else{
                result_block.style.color = "red"
            }
            placeholder_block.classList.add("sub-block");
            result_block.innerText = result;
        }
        else{alert("incorrect data")}
    }catch{
        console.log("something went wrong")
    }
})