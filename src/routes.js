const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const recipes = require('./app/controllers/recipes')
const pages = require('./app/controllers/pages')
const chefs = require('./app/controllers/chefs')

//Pages Routes
routes.get("/", pages.index)
routes.get("/about", pages.about)
routes.get("/recipes", pages.recipes)
routes.get("/chefs", pages.chefs)
routes.get("/recipes/:index", pages.recipe)

//Admin Routes
routes.get("/admin/recipes/create", recipes.create)
routes.get("/admin/recipes/:id", recipes.show)
routes.get("/admin/recipes", recipes.index)
routes.get("/admin/recipes/:id/edit", recipes.edit)
routes.post("/admin/recipes", multer.array("photos", 5), recipes.post)
routes.put("/admin/recipes", multer.array("photos", 5), recipes.put)
routes.delete("/admin/recipes", recipes.delete)

//Chef Routes
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show)
routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/:id/edit", chefs.edit)
routes.post("/admin/chefs", multer.array("photo", 1), chefs.post)
routes.put("/admin/chefs",  multer.array("photo", 1), chefs.put)
routes.delete("/admin/chefs", chefs.delete)

module.exports = routes