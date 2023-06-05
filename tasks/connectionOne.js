//dos conexiones abiertas con 10 minutos de diferencia. 
//La variable exportada por este modulo tendria que ser el array del socket vigente
//interval que actualice la variable exportada cada un segundo

const WebSocket = require('ws');
const getBinanceCheckedPairs = require("./getBinanceCheckedPairs")

//status close, updating, updated

let binanceDataConnectionOne = []
// const binanceDataConnectionOneStatus = {"status": "close"}

// const binanceDataConnectionTwo = []
// const binanceDataConnectionTwoStatus = {"status": "close"}

// const binanceLastConnection = {"lastConnection": "none"}


const connectionOne = async()=>{

  const socket1 = new WebSocket('wss://stream.binance.com:9443/ws');

  socket1.on('open', async() => {
    console.log('Conexión WebSocket establecida.');

    const {validPairsWithPriceSliced, pairsSlicedRequest, validPairsWithPriceSlicedArray} = await getBinanceCheckedPairs()  
    const initialData = setInitialDataByHttp()

    console.log(pairsSlicedRequest)
    binanceDataConnectionOne = [...validPairsWithPriceSliced]

    const channels = validPairsWithPriceSlicedArray.map((criptomoneda) => {    
      return `${criptomoneda.toLowerCase()}@ticker`;    
    });

    const mensaje = {
      method: 'SUBSCRIBE',
      params: [...channels],
      id: 1
    };
    
    socket1.send(JSON.stringify(mensaje));    
  });
  

  socket1.on('message', (data) => {
    const mensaje = JSON.parse(data);
    

    console.log(mensaje)
    
    // if(typeof mensaje === "object"){    
    //   if(mensaje.hasOwnProperty("s")){
    //     const quoteAsset = "USDT"
    //     const baseAsset = mensaje.s.replace(quoteAsset,"")
        
    //       console.log(binanceDataConnectionOne)
    //       const indexOfElement = binanceDataConnectionOne.findIndex(element=>element.pair === mensaje.s)
    //       binanceDataConnectionOne[indexOfElement] = {
    //         "pair"              : mensaje.s, 
    //         "baseAsset"         : baseAsset, 
    //         "quoteAsset"        : quoteAsset, 
    //         "price"             : mensaje.c, 
    //         "priceChange"       : mensaje.p, 
    //         "priceChangePercent": mensaje.P, 
    //         "highPrice"         : mensaje.h, 
    //         "lowPrice"          : mensaje.l,
    //         "baseAssetVolume"   : mensaje.v,
    //         "quoteAssetVolume"  : mensaje.q,
    //         "source"            : "webSocket-real-time"
    //       }
    //   }  
    // }
  
  const time = new Date()
  const timeStamp = time.getTime()

  // let updatingTimeStamp 
  // let updatedTimeStamp 

 
  // if (binanceDataConnectionOne.length < 2) console.log(binanceDataConnectionOne.length)
  
  // if(binanceDataConnectionOne.length/1 < 2 && binanceDataConnectionOneStatus.status  !== "ConnectionOne Updating..."){
  //   binanceDataConnectionOneStatus.status = "ConnectionOne Updating..."
  //   updatingTimeStamp = Date.now()
  //   console.log(binanceDataConnectionOneStatus.status, "time: ", Date.now())
  // }

  // if(binanceDataConnectionOne.length/2 === 1 && binanceDataConnectionOneStatus.status  !== "ConnectionOne Updated"){
  //   console.log(binanceDataConnectionOne.length)
  //   binanceDataConnectionOneStatus.status = "ConnectionOne Updated"
  //   binanceLastConnection.lastConnection = "ConecctionOne"
  //   updatedTimeStamp = Date.now()
  //   console.log(binanceDataConnectionOneStatus.status, "time: ", Date.now())
  //   console.log(`The updating process spent ${(updatedTimeStamp-updatingTimeStamp)/1000} seconds`)
  //   console.log("The main connection is ConnectionOne right now")
  // }

  // if(binanceDataConnectionOneStatus.status  === "ConnectionOne Updated"){
  //   console.log("nuevo estado", binanceDataConnectionOne)
  // }

  //console.log(binanceDataConnectionOneStatus.status)
  });

  socket1.on('ping', () => {
    console.log('Recibido ping del cliente');
    socket1.pong(); // Responder con un pong
    console.log('pong enviado');
  });


  socket1.on('close', () => {
    console.log('Conexión WebSocket cerrada.');
  });

  socket1.on('error', (error) => {
    console.error('Error en la conexión WebSocket:', error);
  });
}


connectionOne()


//inicio conecta uno. 10 minutos despues de que esta updated, conecta dos. A partir de que esta uno arriba empieza a entregar informacion. Si las dos estan updated prefiere la nueva



const getUpdatedData = ()=>{  
  return binanceData 
}

module.exports = getUpdatedData