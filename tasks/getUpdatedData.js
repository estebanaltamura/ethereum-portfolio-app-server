const getDataFromApi = require("./getDataFromApiCoinMarketCap")
const updateFirebase = require("./updateFirebase")
const getDataFromFirebase = require("./getDataFromFirebase")
const tokenListUpdated = require("./getTokenListUpdated")



// first value
let updatedData


const getUpdatedData = async()=>{

    let tokenListUp = await tokenListUpdated.getTokenListUpdated()

    //console.log(tokenListUp)
    
    setInterval(async()=>{
        tokenListUp = tokenListUpdated.tokenListUpdated()  
        
        const dataFromApi = await getDataFromApi(tokenListUp)

        if(dataFromApi !== null){
            //console.log(dataFromApi)
            //await updateFirebase(dataFromApi, 'lastData', 'lastDataCurrencies')
            
            // const currentTime = new Date();
            // const lastUpdateTime = new Date(dataFromApi.id.ethereum.last_updated).getTime()
            // const delay = Math.round((currentTime - lastUpdateTime)/60000)
      
            // updatedData = {
            //     "data":dataFromApi, 
            //     "sinchronicityStatus": true, 
            //     "delayApi":delay, 
            //     "message": delay < 5 ? `The information service works ok` : `Our information service is having delays. The information shown is from ${delay} minutes ago` 
            // }
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
 


