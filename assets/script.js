//définir les variables globales
let worksGallery = document.querySelector(".gallery");
let divFilters = document.querySelector(".filter-buttons");
let logout = document.getElementById("login-button");
let AllElements = [];
let worksData;
let currentSelectedFilter;
let editMode = false;
let modaleOpen = false;
let addWorksOpen = false;

//appel toutes les fonctions qui doivent se faire au chargement de la page
function initiate(){
    //vérification de la présence du token
    checkToken();
    //appel des deux fonctions de fetch
    fetchWorks();
    fetchCategories();
}

//appel api GET /works
function fetchWorks(){
    fetch('http://localhost:5678/api/works', {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        worksData = data;
        displayWorks(data);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la requête:', error);
    });
}

//appel api GET/categories
function fetchCategories(){
    fetch('http://localhost:5678/api/categories', {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        getAllWorks(data);
        if(editMode==false){
            createFilterAll(data);
            createFilters(data);
        }
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la requête:', error);
    });
}

//appel API DELETE /works/Id
function deleteWorks(worksId,token){
    fetch('http://localhost:5678/api/works/'+worksId, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur de réseau lors de la tentative de suppression de la ressource');
        }
        console.log('La ressource a été supprimée avec succès');
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });
}

//fonction pour checker la présence du token d'identification
function checkToken(){
    //vérifie qu'il y a quelque chose dans le local storage
    if(localStorage.length !==0){
        let tokenRecupere = localStorage.getItem('token');
        //vérifie que c'est bien le token que l'on récupère
        if(tokenRecupere !== null){
            editMode = true;
            openEditMode();
        }
    }    
    else {
        editMode = false;
    }
}

//fonction pour afficher les travaux dans le HTML
function displayWorks(works){
        //reset de la gallerie pour éviter d'ajouter en plus
        worksGallery.innerHTML="";
    works.forEach(element => {
        //création des differents éléments
        let worksFigure = document.createElement("figure");
        let worksImage = document.createElement("img");
        let worksCaption = document.createElement("figcaption");
        //setup de la figure
        worksFigure.classList.add("category"+element.category.id);
        //setup de l'image
        worksImage.src = element.imageUrl;
        worksImage.alt = element.title;
        worksFigure.appendChild(worksImage);
        //setup de la figcaption
        worksCaption.innerHTML = element.title;
        worksFigure.appendChild(worksCaption);
        //ajout de la figure au HTML
        worksGallery.appendChild(worksFigure);
    });
}
//fonction qui permet de récupérer la totalité des travaux
function getAllWorks(worksCategories){
    worksCategories.forEach(categoryType=>{
        let currentCategory = document.querySelectorAll(`.category${categoryType.id}`);
        //ajout de chaque catégorie dans le tableau AllElements
        AllElements.push(currentCategory);      
    });
}
//fonction pour tout réafficher
function refreshAll(listOfAll){
    listOfAll.forEach(category=>{
        category.forEach(element=>{
            element.style.display = "block";
        });
    });
}

//fonction pour cacher un élément
function hideElement(item){
    item.style.display = "none";
}

//fonction pour réaficher tous les traveaux inclus dans la liste d'objets indiquée en paramètre
function refreshWorks(listOfWorks){
    listOfWorks.forEach(element=>{
        element.style.display = "block";        
    });
}

//fonction pour cacher la liste de travaux donné en paramètre
function hideSelection(listOfWorks){
    listOfWorks.forEach(category=>{
        category.forEach(element=>{
            hideElement(element);
        });
    });
}

//création du bouton Tous
function createFilterAll (categories){
    //création des composants du bouton
    let buttonAll = document.createElement("input");
    buttonAll.type = "button";
    buttonAll.value = "Tous";
    buttonAll.classList.add("button-selected");
    //ajout de l'eventListener     
    buttonAll.addEventListener("click", function() {
        refreshAll(AllElements);
        //change la couleur du bouton
        currentSelectedFilter.classList.remove("button-selected"); 
        buttonAll.classList.add("button-selected");
        currentSelectedFilter=this; 
    });
    divFilters.appendChild(buttonAll);
    currentSelectedFilter = buttonAll;
}

//fonction pour créer tous les boutons de filtres
function createFilters(categories){
    categories.forEach(categoryName=>{
    //création des composants du bouton    
        let buttonFilter = document.createElement("Input");
        buttonFilter.type = "button";
        buttonFilter.value = categoryName.name;
        buttonFilter.id = categoryName.id;
        //ajout de l'eventListener
        buttonFilter.addEventListener("click", function(){
            let currentSelection = document.querySelectorAll(`.category${buttonFilter.id}`);
            hideSelection(AllElements);
            refreshWorks(currentSelection);
            //change la couleur du filtre sélectionné
            currentSelectedFilter.classList.remove("button-selected"); 
            this.classList.add("button-selected");
            currentSelectedFilter=this;
        });
        divFilters.appendChild(buttonFilter);
    });
}
//permet d'afficher la modale
function createModaleGallery(){
    let modaleGallery = document.getElementById("gallery-modale");
    //reset contenue de la gallerie
    modaleGallery.innerHTML="";
    worksData.forEach(element=>{        
        //création de la figure qui contient les images
        let worksFigure = document.createElement("figure");
        worksFigure.classList.add("modifiy-card");
        //création de l'image
        let worksImage = document.createElement("img");
        worksImage.src = element.imageUrl;
        worksImage.alt = element.title;
        worksImage.classList.add("modify-img");
        //création de l'icone de poubelle
        let trashImage = document.createElement("img");
        trashImage.src = "./assets/icons/trash.png";
        trashImage.classList.add("delete-icon");
        trashImage.id = element.id;
        //permet de supprimer un travail
        trashImage.addEventListener("click",function(){
            let token = localStorage.getItem('token');
            deleteWorks(this.id,token);
            fetchWorks();            
            createModaleGallery();
        });
        //ajout des éléments à la figure
        worksFigure.appendChild(trashImage);
        worksFigure.appendChild(worksImage);        
        modaleGallery.appendChild(worksFigure);        
    });
}
//permet de fermer la modale
function closeModale(){
    let modaleGallery = document.getElementById("gallery-modale");
    let background = document.getElementById("modale-background");
    modaleGallery.innerHTML ="";
    hideElement(modale);
    hideElement(background);
    modaleOpen = false;
}

//crée l'interface de l'edit mode
function openEditMode(){
    logout.innerHTML="logout";
    //permet de logout et de revenir à l'état intial
    logout.addEventListener("click", function(event){
        if(editMode==true){
            event.preventDefault();
            localStorage.removeItem("token");
            location.reload();
        }
    });
    //fait apparaitre le bandeau et le bouton modifier
    let bandeau = document.getElementById("bandeau");
    bandeau.style.display ="flex";
    let modifyButton = document.getElementById("modifier");
    modifyButton.style.display ="flex";
    //permet d'ouvrir la modale si elle n'est pas déjà ouverte
    modifyButton.addEventListener("click",function(){
        if(modaleOpen == false){
            let modale = document.getElementById("modale");
            modale.style.display ="flex";
            let background = document.getElementById("modale-background");
            background.style.display="flex";
            modaleOpen = true;
            createModaleGallery();
            //ajout de la fermeture de la modale
            let closeButton = document.getElementById("close-modale");
            closeButton.addEventListener("click",function(){
                closeModale();
            });
            //background.addEventListener("click",closeModale());
            background.addEventListener("click", function(){
                closeModale();
            })
          
        }
    });    
}

//appel initiate
initiate();