const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all vehicles and classification_name by classification_id
 * ************************** */
async function getVehiclesByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
/* ***************************
 *  Get vehicle by inventory ID
 * ************************** */
async function getVehicleByInventoryId(inv_id) {
  try{
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1", [inv_id]
    )
    console.log(data)
    return data.rows
  } catch (error){
    console.error('getvehiclebyinventoryid error' + error)
  }
}

async function AddNewClassification(newClassification){
  try{
    const data = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1)", [newClassification]
    )
    console.log(data)
    return data.rows
  } catch (error){
    console.error('Addnewclassification in inventory-model error' + error)
  }
}

async function AddNewVehicle(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id){
  try{
    const data = await pool.query("INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, '/images/vehicles/no-image.png', 'images/vehicles/no-image-tn.png', $5, $6, $7, $8) RETURNING *", [inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id])
    console.log(data)
    return data
  } catch(error){
    console.error('AddNewVehicle in inventory model error' + error)
  }
}

module.exports = {getClassifications, getVehiclesByClassificationId, getVehicleByInventoryId, AddNewClassification, AddNewVehicle};