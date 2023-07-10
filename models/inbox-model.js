const pool = require("../database/")

async function getMessages(){
    return await pool.query("SELECT * FROM public.message ORDER BY message_subject")
}

module.exports = {getMessages}