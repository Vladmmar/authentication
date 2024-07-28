const profile = document.getElementById('profile')
const logout = document.getElementById('logout')

profile.addEventListener('click', () => window.location.href = "/profile")
logout.addEventListener('click', async () => {
    await fetch("/auth/logout", {
        method: "POST"
    }).then(data => data.json()).then(data => console.log(data))

    location.reload()
})