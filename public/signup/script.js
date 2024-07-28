const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
})

const button = document.getElementById('submit')

button.addEventListener('click', async () => {
    const first_name = document.getElementById('first_name').value
    const last_name = document.getElementById('last_name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const date_of_birth = document.getElementById('date_of_birth').value

    await fetch("/auth/signup", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            password,
            date_of_birth
        })
    }).then(async response => {
        if (response.ok){
            return response.json()
        } else{
            response = (await response.json()).errors[0].msg
            console.log(response);
            throw new Error(response);
        }
    }).then(data => console.log(data)).catch(error => {
        console.log(error);    
        const el = document.createElement("p");
        el.textContent = error;
        document.body.appendChild(el);
    })
})

const showPassword = () => {
    const passwordInput = document.getElementById('password')
    passwordInput.type === "password" ?
        passwordInput.type = "text" :
        passwordInput.type = "password"
}