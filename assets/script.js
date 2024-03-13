//définir les variables globales
let worksGallery = document.querySelector(".gallery");
let divFilters = document.querySelector(".filter-buttons");
let AllElements = [];
let currentSelectedFilter;

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
        createFilterAll(data);
        createFilters(data);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la requête:', error);
    });
}

//fonction pour checker la présence du token d'identification

function checkToken(){

    if(localStorage.length !==0){
        let tokenRecupere = localStorage.getItem('token');
        console.log(tokenRecupere);
    }    
    else {
        console.log("pas de token");
    }
}


//fonction pour afficher les traveaux dans le HTML
function displayWorks(works){
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
            element.style.display = "none";
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

//appel toutes les fonctions qui doivent se faire au chargement du script
function initiate(){
    //appel des deux fonctions de fetch
    fetchWorks();
    fetchCategories();
    //appel la vérification de la présence du token
    checkToken();
}

initiate();