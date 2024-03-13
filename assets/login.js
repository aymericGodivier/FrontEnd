//définir les varaibles globales
let loginForm = document.getElementById("login-form");
let errorMessage = document.getElementById("error-message");

//récupère les données du formulaire et crée la requête fetch
loginForm.addEventListener("submit",function(event){
    event.preventDefault();
    let userEmail = document.getElementById('email').value;
    let userPassword = document.getElementById('password').value;
    
//construction du body pour la requête fetch
    const loginRequest = {
        "email" : userEmail,
        "password" : userPassword
    };
  
//création de la requête fetch
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
        
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}`);
                console.log("erreur authentification");
            }
            return response.json();
        })
        .then(data => {
            console.log(data.token);
            let token = data.token;
            // Stocker le token dans localStorage
            localStorage.setItem('token', token);
            errorMessage.innerHTML = "";
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la requête:', error);
            errorMessage.innerHTML = "Mauvais mail ou mot de passe";
        });

});