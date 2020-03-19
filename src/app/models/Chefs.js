const db = require('../../config/db')
const {date} = require('../../lib/utils')
const fs = require('fs')

module.exports = {
    all(){
        return db.query(`
        SELECT chefs.*, count (recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC`)
    },
    async create(data, image) {
        try {
            const result = await db.query(`INSERT INTO files (name, path) VALUES ($1, $2) RETURNING id`, [image.filename, image.path])
            const file_id = result.rows[0].id
            return db.query(` INSERT INTO chefs (name, created_at, file_id) VALUES ($1, $2, $3) RETURNING id`, [data.name, date(Date.now()).iso, file_id])
        }catch(err){
            console.error(err)
        }
        
    },
    find(id) {
      return db.query(`SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`, [id])
    },
    update(data){
        const query = `
        UPDATE chefs SET
            name=($1)
            WHERE id = ($2)
            `
            const values = [
                data.name,
                data.id
            ]
        return db.query(query, values)
    },
    async delete(id){
        try{
            const result = await db.query(`SELECT * FROM chefs WHERE id = $1`,[id])
            const file_id = result.rows[0].file_id
            const fileResult = await db.query(`SELECT * FROM files WHERE id = $1`,[file_id])
            const file = fileResult.rows[0]
            if(file){
                fs.unlinkSync(file.path)
            }
            await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
            return db.query(`DELETE FROM files WHERE id = $1`, [file_id])
        }catch(err){
            console.error(err)
        }
    },
    chefRecipes(id){
        return db.query(`SELECT recipes.*
        FROM recipes
        WHERE recipes.chef_id = $1
        ORDER BY recipes.created_at DESC`, [id])
    },
}