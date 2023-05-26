const axios = require('axios');

const getDataFromApiCoinMarketCap = async ()=>{
  try{
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: {
          'X-CMC_PRO_API_KEY': '40d1b3fa-3dda-4285-94c2-555009f6f8d9',
      },
      params: {
        start: 1, 
        limit: 150, 
        sort: 'market_cap',
        sort_dir: 'desc',
        convert: "USD"   
          
      }        
    })

    const dataMarketCap = {}
    
    const symbolsMarketCap = response.data["data"]        
      .map(element =>{
        dataMarketCap[element.symbol] =         
          {"cmc_rank"          : String(element.cmc_rank),
          "circulating_supply" : String(element.circulating_supply),
          "market_cap"         : String(element.quote.USD.market_cap),
          "volume24h"          : String(element.quote.USD.volume_change_24h),
          "logo"               : `https://s2.coinmarketcap.com/static/img/coins/64x64/${String(element.id)}.png`,
          }
        return String(element.symbol)
      }
        
      )     
      

      
      return {dataMarketCap, symbolsMarketCap} // objeto con informacion por simbolo, array simbolos
  }
  
  catch(error){
    console.log("error intentando traer data de la api de coinmarketcap", error)
    return null
  }
}



module.exports = getDataFromApiCoinMarketCap;

       /*
      inicio de servidor
        todos los symbolos de binance
        traer x symbolos de la red ethereum de coinmarket
        sobre los que coincide armar un array. Ese es el array maestro

        sobre ese array
          binance cada 5 segundos
            precio
            volumen 24 horas
            cambio 24 horas
            simbolo
            nombre
            

          coinmarket cap cada 5 minutos
            circulante
            market cap
            logo
            ranking

         
    */
   

//una vez por hora actualiza la lista de criptomonedas. pide simbolos a coinmarket, se filtra el total de simbolos de binance por los los simbolos de coinmarket. retorna
/*
desde el cliente
dashboard:
columnas 
-ranking ---MK
-logo ---MK (creo)
-simbolo
-nombre
-precio 
-variacion 24h porcentaje



Detalle al entrar modifica el path y ese path es el que se usa para buscar
-variacion $
-variacion %
-mensaje real time hora/zona horaria
-volumen
-market cap ---MK
-high 24H
-low 24H
-circulante ---MK


*/

//desde cliente fetch de xxx/dashboard retorna objeto con este formato: 
//-ranking ---MK
//-logo ---MK (creo)
//-simbolo
//-nombre
//-precio 
//-variacion 24h porcentaje


//array de simbolos filtrados de coin, array de simbolos de binance. filtrar para encontrar un array unico. 


//
//Ese array unico con el que trabaja binance para hace consultas cada 4 segundos y pide la info actualizada de las variables que trae coincap por simbolo


//con el array de pares se obtiene el ultimo precio. 
//Ese precio se lo manda a un modulo de python para que multiplique ese precio por el par base/usdt. por ejemplo eth/btc = 0.006 x 27200 (btc/usdt) = 1620