//définir les variables globales
let modaleOpen = false;
let addWorksOpen = false;
let imageUploaded = false;
let titleGiven = false;
let categoryChosen = false;

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

//appel API POST /works
async function addWork(imgWorks,workTitle,workCategory,token){
    //création du body
    let formData = new FormData();

    formData.append("image", imgWorks);
    formData.append("title", workTitle);
    formData.append("category", workCategory);

    console.log(formData);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },

        body: formData,
        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur de réseau lors de la tentative d\'envoie du formulaire');
        }
        console.log('Le formulaire a été envoyé avec succès');
        (async () => {
            await fetchWorks();
            closeModale();
            openModale();
        })();

    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });
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
        openModale();
    });    
}

//permet d'afficher la modale
function openModale(){
    if(modaleOpen == false){
        let modale = document.getElementById("modale");
        modale.style.display ="flex";
        let background = document.getElementById("modale-background");
        background.style.display="flex";
        modaleOpen = true;
        createModaleGallery();
        //ajout de la fermeture de la modale
        document.querySelectorAll('.cross-close').forEach(function(element) {
            element.addEventListener('click', function() {
                closeModale();
            });
        });
        //background.addEventListener("click",closeModale());
        background.addEventListener("click", function(){
            closeModale();
        })
      
    }
}

//permet de créer la gallerie de la modale
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
            //appel asyncrone pour que fetchworks mait bien fini de mettre à jour worksdata avant d'appeler createModaleGallery
            (async () => {
                await fetchWorks();
                createModaleGallery();
            })();
        });
        //ajout des éléments à la figure
        worksFigure.appendChild(trashImage);
        worksFigure.appendChild(worksImage);        
        modaleGallery.appendChild(worksFigure);        
    });
    //permet d'ouvrir la fenetre add-works
    let addButton = document.getElementById("add-photo");
    addButton.addEventListener("click", function(){
        openAddWorks();
    })
}
//permet de fermer la modale
function closeModale(){
    let modaleGallery = document.getElementById("gallery-modale");
    let background = document.getElementById("modale-background");
    let addWorks = document.getElementById("add-work");
    modaleGallery.innerHTML ="";
    hideElement(modale);
    hideElement(background);
    hideElement(addWorks);
    modaleOpen = false;
    addWorksOpen=false;
}
//permet de changer la couleur du bouton et le rendre cliquable quand tout les paramètres sont remplis
function updateUpload(){
    submit = document.getElementById("workSubmit");
    if(imageUploaded == true && titleGiven == true && categoryChosen == true){
        submit.style.backgroundColor = '#1D6154';
        submit.disabled=false;
    }
    else{
        submit.style.backgroundColor = 'gray';
    }
}
//check si le titre est rempli
function titleUpdate(title){
    if(title.value !== ""){
        titleGiven = true;
    }
    else{
        titleGiven = false;
    }
    updateUpload();
}
//ouvrir la fenetre d'ajout de travaux
function openAddWorks(){
    //récupère tous les composants de la fenêtre
    let addWorks = document.getElementById("add-work");
    let form = document.getElementById("add-work-form");
    let workImage = document.getElementById("work-image");
    let imgSpan = document.getElementById("imgTypeInstruction");
    let addImageBtn = document.getElementById("addImage");
    let inputFile = document.getElementById("fileInput");
    let title = document.getElementById("image-name");
    let select = document.getElementById("choose-category");
    let submit = document.getElementById("workSubmit");
    //cache modale et affiche addworks
    if(modaleOpen==true && addWorksOpen== false){
        let modale = document.getElementById("modale");
        hideElement(modale);
        modaleOpen = false;
        addWorks.style.display="flex";
        addWorksOpen=true;
        //reset des composants de addworks
        form.reset();
        inputFile.value = '';
        workImage.src="./assets/icons/image.png";
        imgSpan.style.display = "block";
        addImageBtn.style.display = "block";
        imageUploaded = false;
        titleGiven = false;
        categoryChosen = false;
        submit.disabled = true;
        updateUpload();
        //faire que le bouton active le input type file
        addImageBtn.addEventListener("click", function(){
            inputFile.click();
        });
        //récupère et affiche l'image et cache les boutons
        inputFile.addEventListener("change",function(){
            let file = this.files[0];
            if(file){
                let imgURL = URL.createObjectURL(file);
                workImage.src = imgURL;
                imageUploaded= true;
                hideElement(addImageBtn);
                hideElement(imgSpan);
                updateUpload();
            }
            
        });
        //vérifie si le titre contient quelque chose
        title.addEventListener("input", function(){
            titleUpdate(title);
        })

        title.addEventListener("keydown", function(){
            titleUpdate(title);
        })
        //vérifie qu'on a sélectionné une option
        select.addEventListener("change", function(event){
            if(event.target.value !== ""){
                categoryChosen = true;
            }
            else{
                categoryChosen = false;
            }
            updateUpload();
        })
        //créé le contenu de la requete POST /works
        submit.addEventListener("click",function(event){
            event.preventDefault();
            let img = inputFile.files[0];
            let workTitle = title.value;
            let category = select.value;
            let token = localStorage.getItem('token');
            addWork(img,workTitle,category,token);
        })
    }
    //permet de revenir en arrière
    let backArrow = document.getElementById("back-arrow");
    backArrow.addEventListener("click",function(){
        if(addWorksOpen==true && modaleOpen==false){
            hideElement(addWorks);
            addWorksOpen=false;
            openModale();
        }
    })
    
}