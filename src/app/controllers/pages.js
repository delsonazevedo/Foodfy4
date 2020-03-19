const Recipes = require("../models/Recipes")
const Chefs = require("../models/Chefs")
const Files = require("../models/Files")

module.exports = {
        index(req, res) {
                return res.render("page/index")
        },
        about(req, res) {
                return res.render("page/about")
        },
        async recipes(req, res) {
                let { filter, page, limit } = req.query

                page = page || 1
                limit = limit || 6
                let offset = limit * (page - 1)

                const params = {
                        filter,
                        page,
                        limit,
                        offset,
                }
                const recipes = await Recipes.paginate(params)
                if (recipes == "") return res.send("Recipe not found!")
                const pagination = {
                        total: Math.ceil(recipes[0].total / limit),
                        page
                }
                const results = await Files.showRecipe()
                const images = results.rows.map(file => ({
                        ...file,
                        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                }))
                const result = await Recipes.chefSelectOptions()
                const chefOptions = result.rows
                return res.render("page/recipes", { recipes, pagination, filter, images, chefOptions })

        },
        async recipe(req, res) {
                const results = await Recipes.find(req.params.index)
                const recipe = results.rows[0]
                if (!recipe) return res.send("Recipe not found!")
                const result = await Recipes.chefSelectOptions()
                const options = result.rows
                const recipeImageResults = await Files.findRecipe()
                const recipeImages = recipeImageResults.rows.map(file=>({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                }))
                const recipeImagesResults = await Files.showRecipe()
                const recipeImage = recipeImagesResults.rows.map(file=>({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                }))
                return res.render("page/recipe", { recipe, chefOptions: options, recipeImage, recipeImages })
        },
        async chefs(req, res) {
                const results = await Chefs.all()
                const chefs = results.rows
                let avatar = await Files.chefAvatar()
                const images = avatar.map(file => ({
                        ...file,
                        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                }))
                return res.render("page/chefs", { chefs: chefs, images })
        }
}