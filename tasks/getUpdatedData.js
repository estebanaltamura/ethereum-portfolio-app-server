const getDataFromApi = require("./getDataFromApi")
const updateFirebase = require("./updateFirebase")
const getDataFromFirebase = require("./getDataFromFirebase")


// first value
let updatedData

const getUpdatedData = ()=>{
    
    setInterval(async()=>{
        const dataFromApi = await getDataFromApi()

        if(dataFromApi !== null){
            await updateFirebase(dataFromApi)
            
            const currentTime = new Date();
            const lastUpdateTime = new Date(dataFromApi.Ethereum.last_updated).getTime()
            const delay = Math.round((currentTime - lastUpdateTime)/60000)
      
            updatedData = {
                "data":dataFromApi, 
                "sinchronicityStatus": true, 
                "delayApi":delay, 
                "message": delay < 5 ? `The information service works ok` : `Our information service is having delays. The information shown is from ${delay} minutes ago` 
            }
        }
        else{
            dataFromFirestore = await getDataFromFirebase()

            const currentTime = new Date();
            const lastUpdateTime = new Date(dataFromFirestore.Ethereum.last_updated).getTime()
            const delay = Math.round((currentTime - lastUpdateTime)/60000)

            updatedData = {
                "data":dataFromFirestore, 
                "sinchronicityStatus": false, 
                "delayApi":delay, 
                "message": `Error trying get the information. The information shown is from ${delay} minutes ago` 
            }            
        }        
    }, 4000)
    
}

//posibilidades error api, error api y error trayendo de firestore

module.exports = {
    updatedData: ()=> updatedData,
    getUpdatedData}
 


