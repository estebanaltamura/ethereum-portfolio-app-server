const db = require("../config/firebase")


const updateFirebase = async (latestDataFromApi)=> { 
    try{
        const docRef = db.collection('lastData').doc("lastDataCurrencies");
        const data = latestDataFromApi
        await docRef.update(data)       
    } 
    catch (error){
        console.log("error intentando actualizar firebase")
        return null
    }
    
}

module.exports = updateFirebase







