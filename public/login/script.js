const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
})

const button = document.getElementById('submit')

button.addEventListener("click", async () => {
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()

    const res = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then(async response => {
        if (response.ok){
            return response.json()
        } else{
            response = (await response.json()).errors[0].msg
            console.log(response);
            throw new Error(response);
        }
    }).catch(error => {
        console.log(error);    
        const el = document.createElement("p");
        el.textContent = error;
        document.body.appendChild(el);
    })
    console.log(res)
    if(res["success"] == "true"){
        window.location.href = "/profile"
    }
})

const showPassword = () => {
    const passwordInput = document.getElementById('password')
    passwordInput.type === "password" ?
        passwordInput.type = "text" :
        passwordInput.type = "password"
}