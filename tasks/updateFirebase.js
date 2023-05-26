const db = require("../config/firebase")


const updateFirebase = async (data, collection, document)=> { 
    try{
        const docRef = db.collection(collection).doc(document);
        await docRef.update(data)       
    } 
    catch (error){
        console.log(`error intentando actualizar firebase para la coleccion ${collection} en el documento ${document}`, error)
        return null
    }
    
}

module.exports = updateFirebase







