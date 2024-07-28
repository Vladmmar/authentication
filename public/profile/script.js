const logout = document.getElementById('logout')

logout.addEventListener('click', async () => {
    await fetch("/auth/logout", {
        method: "POST"
    })
    window.location.href = "/login"
})

document.addEventListener('DOMContentLoaded', async () => {
    let userData = await fetch("/api/profile").then(data => data.json())
    userData["date_of_birth"] = userData["date_of_birth"].substring(0, 9) + (Number(userData["date_of_birth"][9]) + 1)
    userData["date_of_registration"] = userData["date_of_registration"].substring(0, 10) + " " + userData["date_of_registration"].substring(11, 19)
    
    const hr1 = document.createElement('hr')
    const hr2 = document.createElement('hr')
    const hr3 = document.createElement('hr')
    const hr4 = document.createElement('hr')
    const hr5 = document.createElement('hr')

    const first_nameL = document.createElement('p')
    first_nameL.textContent = "First Name"
    const first_name = document.createElement('p')
    first_name.textContent = userData["first_name"]
    
    const last_nameL = document.createElement('p')
    last_nameL.textContent = "Last Name"
    const last_name = document.createElement('p')
    last_name.textContent = userData["last_name"]

    const emailL = document.createElement('p')
    emailL.textContent = "Email"
    const email = document.createElement('p')
    email.textContent = userData["email"]

    const dobL = document.createElement('p')
    dobL.textContent = "Date of Birth"
    const dob = document.createElement('p')
    dob.textContent = userData["date_of_birth"]

    const dorL = document.createElement('p')
    dorL.textContent = "Date of Registration"
    const dor = document.createElement('p')
    dor.textContent = userData["date_of_registration"]

    const container = document.createElement('div')

    container.append(first_nameL, first_name, hr1, last_nameL, last_name, hr2, emailL, email, hr3, dobL, dob, hr4, dorL, dor, hr5)

    document.body.insertBefore(container, logout)
})