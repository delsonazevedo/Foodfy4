const Recipes = require('../models/Recipes')
const Files = require('../models/Files')

module.exports = {
    async index(req, res) {
        let results = await Recipes.chefSelectOptions()
        const options = results.rows
        results = await Recipes.all()
        const recipes = results.rows
        results = await Files.showRecipe()
        const images = results.rows.map(file=>({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        return res.render("admin/index", { recipes: recipes, chefOptions: options, recipeImages: images})
    },
    async show(req, res) {
        let results = await Recipes.find(req.params.id)
        const recipe = results.rows[0]
        const options = await Recipes.chefSelectOptions()
        results = await Files.findRecipe()
        const recipeImages = results.rows.map(file=>({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        results = await Files.showRecipe()
        const recipeImage = results.rows.map(file=>({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        return res.render("admin/show", { recipe, chefOptions: options, recipeImages: recipeImages, recipeImage: recipeImage })
    },
    async create(req, res) {
        let results = await Recipes.chefSelectOptions()
        options = results.rows
        return res.render("admin/create", {chefOptions: options})
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }

        if (req.files.length == 0)
            return res.send('Please, send at least one image!')

        let results = await Recipes.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => Files.createRecipe({
            ...file,
            recipe_id: recipeId
        })
        )

        await Promise.all(filesPromise)

        return res.redirect(`/admin/recipes`)
    },
    async edit(req, res) {
        let results = await Recipes.find(req.params.id)
        recipe = results.rows[0]
        results = await Recipes.chefSelectOptions()
        options = results.rows
        results = await Files.findRecipe()
        const files = results.rows.map(file=>({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        return res.render("admin/edit", { recipe, chefOptions: options, files: files})     
    },
    async put(req, res) {
        const keys = Object.keys(req.body)
        for(key of keys) {
            if (req.body[key] == "" && key != "removed_files"){
                return res.send("Please, fill all fields!")
            }
        }

        if(req.files.length != 0){
            const newFilesPromise = req.files.map(file=> Files.createRecipe({...file, recipe_id: req.body.id}))
            await Promise.all(newFilesPromise)
        }

        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length -1
            removedFiles.splice(lastIndex, 1)
            const removedFilesPromise = removedFiles.map(id => Files.delete(id))
            await Promise.all(removedFilesPromise)
        }
        
        await Recipes.update(req.body)
        return res.redirect(`/admin/recipes/${req.body.id}`)
    },
    async delete(req, res) {
        const results = await Files.selectAllRecipesFiles(req.body.id)
        const removedFilesPromise = results.map(file => Files.delete(file.file_id))
        await Promise.all(removedFilesPromise)
        await Recipes.delete(req.body.id)
        return res.redirect('/admin/recipes')
    }
}




