const pool = require("../database/")

async function getMessages(){
    return await pool.query("SELECT * FROM public.message ORDER BY message_subject")
}

async function sendMessage(recipient, subject, message, account_id){
    try{
        const sql ="INSERT INTO message (message_subject, message_body, message_to, message_from) VALUES ($1, $2, $3, $4)"
        return await pool.query(sql, [subject, message, recipient, account_id])
    } catch(error){
        return error.message
    }
}

module.exports = {getMessages, sendMessage}