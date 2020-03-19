const db = require('../../config/db')
const fs = require('fs')

module. exports = {
    async createRecipe(data){
        try {
            const result = await db.query(`INSERT INTO files (name,path) VALUES ($1, $2) RETURNING id`, [data.filename, data.path])
            const fileId = result.rows[0].id
            return db.query(`INSERT INTO recipe_files (recipe_id, file_id) VALUES ($1, $2) RETURNING id`, [data.recipe_id, fileId])
        }catch(err){
            console.error(err)
        }
    },
    async createChef(data){
        try{
            return db.query(`INSERT INTO files (name, path) VALUES ($1, $2) RETURNING id`, [data.filename, data.path])
        }catch(err){
            console.error(err)
        }
    },
    async showRecipe(){
        return db.query(`
        SELECT DISTINCT ON (recipe_id) recipe_id,
        file_id,
        path
        FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        ORDER BY
        recipe_id,
        file_id;`)
    },
    async findRecipe(){
        return db.query(`
        SELECT *
        FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)`)
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]
            fs.unlinkSync(file.path)
            await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])
            return db.query(`
            DELETE FROM files WHERE id = $1
            `, [id])
        }catch(err){
            console.error(err)
        }
    },
    async selectAllRecipesFiles(id){
            const results = await db.query(`SELECT * FROM recipe_files WHERE recipe_id = $1`,[id])
            return results.rows
    },
    async chefAvatar(){
        const results = await db.query(`SELECT * FROM files`)
        return results.rows
    },
    async findAvatar(id){
        const results = await db.query(`SELECT * FROM files WHERE id = $1`,[id])
        return results.rows[0]
    },
    async updateChefAvatar(data, file_id){
        try{
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [file_id])
            const file = result.rows[0]
            if (file) {
                fs.unlinkSync(file.path)
            }
            const query = `
            UPDATE files SET
                name = ($1),
                path = ($2)
                WHERE id = ($3)
                `
                const values = [
                    data.filename,
                    data.path,
                    file_id
                ]
            return db.query(query, values)
        }catch(err){
            console.error(err)
        }
        
    }
}