const Chefs = require('../models/Chefs')
const Recipes = require('../models/Recipes')
const Files = require('../models/Files')

module.exports = {
    async index(req, res) {
        const results = await Chefs.all()
        const chefs = results.rows
        let avatar = await Files.chefAvatar()
        const images = avatar.map(file=>({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        return res.render("chefs/index", {chefs: chefs, images: images})
    },
    create(req, res) {
        return res.render("chefs/create")
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }

        if (req.files.length == 0)
        return res.send('Field Avatar is required!')

        await Chefs.create(req.body , req.files[0])

        return res.redirect(`/admin/chefs`)
    },
    async show(req, res){
        const chefResult = await Chefs.find(req.params.id)
        const chef = chefResult.rows[0]
        const recipesResult = await Chefs.chefRecipes(chef.id)
        const recipes = recipesResult.rows
        const optionsResult = await Recipes.chefSelectOptions()
        const options = optionsResult.rows
        let avatar = await Files.chefAvatar()
        const chefImages = avatar.map(file=>({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        let images = await Files.showRecipe()
        const recipeImages = images.rows.map(file=>({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        return res.render("chefs/show", { chef, recipes: recipes, chefOptions: options, chefImage: chefImages, recipeImages: recipeImages})
    },
    async edit(req, res){
        const result = await Chefs.find(req.params.id)
        const chef = result.rows[0]
        let avatar = await Files.findAvatar(chef.file_id)
        if (avatar) {
            avatar = {
                ...avatar,
                src: `${req.protocol}://${req.headers.host}${avatar.path.replace("public", "")}`
            }
        }
        return res.render("chefs/edit", {chef, avatar} )  
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }
        
        if(req.files != 0) {
            Files.updateChefAvatar(req.files[0], req.body.file_id)
        }

        await Chefs.update(req.body)
        
        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    async delete(req, res) {
        await Chefs.delete(req.body.id)
        return res.redirect("/admin/chefs") 
    }
}