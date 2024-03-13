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

//appel des deux fonctions de fetch
fetchWorks();
fetchCategories();

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
    let buttonAll = document.createElement("input");
    buttonAll.type = "button";
    buttonAll.value = "Tous";
    buttonAll.classList.add("button-selected");     
    buttonAll.addEventListener("click", function() {
        refreshAll(AllElements);
        currentSelectedFilter.classList.remove("button-selected"); 
        buttonAll.classList.add("button-selected");
        currentSelectedFilter=this; 
    });
    divFilters.appendChild(buttonAll);
    currentSelectedFilter = buttonAll;
}

//fonction pour créer les boutons de filtres
function createFilters(categories){
    categories.forEach(categoryName=>{
        let buttonFilter = document.createElement("Input");
        buttonFilter.type = "button";
        buttonFilter.value = categoryName.name;
        buttonFilter.id = categoryName.id;
        buttonFilter.addEventListener("click", function(){
            let currentSelection = document.querySelectorAll(`.category${buttonFilter.id}`);
            hideSelection(AllElements);
            refreshWorks(currentSelection);
            currentSelectedFilter.classList.remove("button-selected"); 
            this.classList.add("button-selected");
            currentSelectedFilter=this;
        });
        divFilters.appendChild(buttonFilter);
    });
}