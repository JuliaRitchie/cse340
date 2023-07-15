const pool = require("../database/")

async function getMessages(){
    return await pool.query("SELECT * FROM public.message ORDER BY message_id")
}

async function getMessageById(message_id){
    try {
        const result = await pool.query(
          'SELECT message_id, message_subject, message_body, message_created, message_to, message_from, message_read, message_archived FROM message WHERE message_id = $1',
          [message_id])
        return result.rows[0]
      } catch (error) {
        return new Error("No matching message id found")
      }
}

async function markAsRead(message_id){
  console.log(message_id)
  try{
    
    const sql = await pool.query("UPDATE message SET message_read = true WHERE message_id = $1;", [message_id])
    return sql.rows
    
  } catch (error){
    return new Error("Mark as read failed in Inbox model.")
  }
}

async function markAsArchived(message_id){
  try{
    
    const sql = await pool.query("UPDATE message SET message_archived = true WHERE message_id = $1;", [message_id])
    return sql.rows
    
  } catch (error){
    return new Error("Mark as read failed in Inbox model.")
  }
}

async function deleteMessage(message_id){
  try{
    
    const sql = await pool.query("DELETE FROM public.message WHERE message_id = $1;", [message_id])
    return sql.rows
    
  } catch (error){
    return new Error("Mark as read failed in Inbox model.")
  }
}

async function sendMessage(recipient, subject, message, account_id){
    try{
        const sql ="INSERT INTO public.message (message_subject, message_body, message_to, message_from) VALUES ($1, $2, $3, $4)"
        return await pool.query(sql, [subject, message, recipient, account_id])
    } catch(error){
        return error.message
    }
}

module.exports = {getMessages, sendMessage, getMessageById, markAsRead, markAsArchived, deleteMessage}