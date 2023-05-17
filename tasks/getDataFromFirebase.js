const db = require("../config/firebase")


const getDataFromFirebase = async ()=> { 
    try{
        const docRef = db.collection('lastData').doc("lastDataCurrencies");
        const doc  = await docRef.get()
        const doc2 = doc.data() 
        const latestDataFromFirebase = doc2
        return latestDataFromFirebase
    } 
    catch (error){
        console.log("error intentando leer firebase", error)
        return null
    }
    
}

module.exports = getDataFromFirebase;