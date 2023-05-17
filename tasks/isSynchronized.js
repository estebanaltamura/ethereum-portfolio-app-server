

const getLatestData = require("./getLatestData")
const getDataFromFirebase = require("./getDataFromFirebase")

getLatestData.getLatestData()

const isSynchronizedPrivate = async()=>{
    const api = await getLatestData.lastestDataFromApi()
    const firebase = await getDataFromFirebase()

    

    const apiFirestoreSync = (api?.Ethereum?.last_updated && firebase?.Ethereum?.last_updated) && new Date(api.Ethereum.last_updated) - new Date(firebase.Ethereum.last_updated)
    console.log(apiFirestoreSync)
    if (apiFirestoreSync < 0){
      //elegir firestore
      console.log("atrasado")
      return{status: false, "message" : `Problemas para obtener cotizaciones en tiempo real. Cotizaciones expuestas son de hace ${Math.abs(apiFirestoreSync/60000)} minutos`}
     
    }
    console.log("al dia")
    return{status: true, "message" : `Datos sincronizados`}
}

const isSynchronized = ()=>{
    isSynchronizedPrivate()
    setInterval(()=>{isSynchronizedPrivate()},5000)
}

isSynchronized()