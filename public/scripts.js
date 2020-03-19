const recipes = document.querySelectorAll('.recipes')
const hideIngredientes = document.querySelector(".hide-ingredients")
const hidePreparation = document.querySelector(".hide-preparation")
const hideInformation = document.querySelector(".hide-information")
const ingredients = document.querySelector('.recipe-ingredients')
const preparation = document.querySelector('.recipe-preparation')
const information = document.querySelector('.recipe-information')


for (let recipe of recipes) {
    recipe.classList.add('active')
    recipe.addEventListener("click", function () {
        const recipeId = recipe.getAttribute("id")
        window.location.href=(`/recipes/${recipeId}`)
    })
}

if(hideIngredientes)hideIngredientes.addEventListener("click", function(){
    if (ingredients.className == 'recipe-ingredients'){
        ingredients.classList.add('hidden')
        hideIngredientes.innerHTML = "MOSTRAR"
    }else{
        ingredients.classList.remove('hidden')
        hideIngredientes.innerHTML = "ESCONDER"
    }
})

if(hidePreparation)hidePreparation.addEventListener("click", function(){
    if (preparation.className == 'recipe-preparation'){
        preparation.classList.add('hidden')
        hidePreparation.innerHTML = "MOSTRAR"
    }else{
        preparation.classList.remove('hidden')
        hidePreparation.innerHTML = "ESCONDER"
    }
})

if(hideInformation)hideInformation.addEventListener("click", function(){
    if (information.className == 'recipe-information'){
        information.classList.add('hidden')
        hideInformation.innerHTML = "MOSTRAR"
    }else{
        information.classList.remove('hidden')
        hideInformation.innerHTML = "ESCONDER"
    }
})

function paginate(selectedPage, totalPages) {
    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2
        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }
            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)
            oldPage = currentPage
        }
    }
    return pages
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if (filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) {
    createPagination(pagination)
}


const ImageGallery = {
    highlight: document.querySelector('.recipe-image > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(event){
        const {target} = event
        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')
        ImageGallery.highlight.src = target.src
    }
}