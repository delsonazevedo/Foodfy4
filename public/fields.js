function addIngredient() {
    const ingredientsDiv = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");
    
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
    
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
    
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredientsDiv.appendChild(newField);
}

if(document.querySelector(".add-ingredient"))document.querySelector(".add-ingredient").addEventListener("click", addIngredient);

function addPreparation() {
    const preparationsDiv = document.querySelector("#preparations");
    const fieldContainer = document.querySelectorAll(".preparation");
    
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
    
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
    
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    preparationsDiv.appendChild(newField);
}

if(document.querySelector(".add-preparation"))document.querySelector(".add-preparation").addEventListener("click", addPreparation);

const formDelete = document.querySelector("#form-delete")
if(formDelete != null) {
    formDelete.addEventListener("submit", function (event) {
        const confirmation = confirm("Deseja Deletar?")
        if (!confirmation) {
            event.preventDefault()
        }
    })
}


// Script de Upload e Preview

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event){
        const {files: fileList} = event.target
        PhotosUpload.input = event.target
        if(PhotosUpload.hasLimit(event)) return
        Array.from(fileList).forEach(file =>{
            PhotosUpload.files.push(file)
            const reader = new FileReader()
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)
                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    getContainer(image){
        const div = document.createElement('div')
        div.classList.add('photo')
        div.onclick = PhotosUpload.removePhoto
        div.appendChild(image)
        div.appendChild(PhotosUpload.getRemoveButton())
        return div
    },
    hasLimit(event){
        const {uploadLimit, input, preview } = PhotosUpload
        const {files: fileList} = input
        if(fileList > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)    
            event.preventDefault()
            return true
        }
        const photosDiv = []
        preview.childNodes.forEach(item =>{
            if (item.classList && item.classList.value == "photo"){
                photosDiv.push(item)
            }
        })
        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }
        return false
    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    },
    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event){
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)
        PhotosUpload.files.splice(index,1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
        photoDiv.remove()
    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode
        if (photoDiv.id){
            const removedFiles = document.querySelector('input[name="removed_files"')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }
        photoDiv.remove()
    }
}