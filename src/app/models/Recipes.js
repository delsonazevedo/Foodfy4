const db = require('../../config/db')
const {date} = require('../../lib/utils')

module.exports = {
    all(){
        return db.query(`
        SELECT recipes.*
        FROM recipes
        ORDER BY recipes.created_at DESC`)
    },
    create(data) {
        const query = `
        INSERT INTO recipes (
            chef_id,
            title,
            ingredients,
            preparation,
            information,
            created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `
            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                date(Date.now()).iso,
            ]
            return db.query(query, values)
    },
    find(id) {
      return db.query(`SELECT *
      FROM recipes
      WHERE id = $1`, [id])
    },
    findBy(filter, callback){
        db.query(`
        SELECT recipes.*
        FROM recipes
        WHERE recipes.title ILIKE '%${filter}%'
        GROUP BY recipes.id
        ORDER BY recipes.title ASC`, function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })        
    },
    async update(data){
        const query = `
        UPDATE recipes SET
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
            WHERE id = ($6)
            `
            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                data.id
            ]
            const results = await db.query(query, values)
            return results.rows[0]
    },
    delete(id){
        return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },
    chefSelectOptions(){
        return db.query(`Select name, id FROM chefs`)
    },
    async paginate(params){
        try{
            const {filter, limit, offset } = params
    
            let = query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`
    
            if (filter) {
                filterQuery = `
                WHERE recipes.title ILIKE '%${filter}%'
                `
                totalQuery= `(
                    SELECT count(*) FROM recipes
                    ${filterQuery}
                )as total` 
            }
            query = `
            SELECT recipes.*, ${totalQuery}
            FROM recipes
            ${filterQuery}
            ORDER BY recipes.updated_at DESC LIMIT $1 OFFSET $2
            `
            const results = await db.query(query,[limit, offset])
            return results.rows
        }catch(err){
            console.error(err)
        }
    }

}