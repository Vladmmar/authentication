async function logout(){
    const urlParams = new URLSearchParams(window.location.search)
    let redirect = urlParams.get('redirect')
    if(redirect){
        await fetch('/auth/logout', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                redirect
            })
        })
    } else{
        await fetch("/auth/logout", ({
            method: "POST",
        }))
    }
}
logout()