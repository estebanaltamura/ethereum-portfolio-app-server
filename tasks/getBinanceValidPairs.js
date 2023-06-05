/*---
    
    CoinMarketCap como es en parte un explorador de activos tiene mas activos que binance
    CoinMarketCap tiene muy buena informacion sobre aspectos que binance no provee, pero actualiza la informacion y permite consultas de forma muy distanciada
    Es por eso que existe la necesidad de usar las dos API. Binance para el real time y CoinMarketCap para obtener otras variables 
    Binance tiene para cada activo algunos pares determinados
    Varios pares no arrojan un error, pero tampoco una cotizacion
    El desafio son:
       -Encontrar los activos en comun entre las dos api 
       -Iterar sobre los pares de binance en busqueda de los pares que entreguen informacion
       -Generar reportes sobre:
          -Activos en comun
          -Activos no en comun
          -pares de binance que no entregan resultados despues de iterar sobre todos los pares validos
          
    Aclaracion: Base asset es el protagonista del par, quote asset es el patron del par

---*/

// La cantidad definida de basAsets buscados en coinMarketCap fue utilizando el criterio de balancear el peso de la request y los baseAssets en comun encontrados
// Resultados baseAssets en comun segun baseAssets buscados en coinMarket: 
// 6000 fuera del limite, 5000 441 en comun, 4000 438 en comun, 3000 434 en comun, 2000 419 en comun, 1000 381 en comun, 500 292 en comun. CANTIDAD ELEGIDA 2000


//Array cantidad de pares maximo
//De ese array los pares que entregan precio
//cada una hora este proceso. Dispara una nueva conexion del socket A y 10 minutos despues del socket B

//cuando tengo los pares bien definidos, queda el manejo de las conexiones con binance y el armado de los objetos finales para dashboard y detalle de cada coin junto con la info de coinMarketCap
const axios = require('axios');

const getBinanceValidPairs = async(pairsQuantityToCheck)=>{
  
  
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//

  //---------------------------------------BUSCAR BASEASSETS EN COMUN ENTRE COINMARKETCAP Y BINANCE-----------------------------------------//

  // INPUT NINGUNO
  const timeStampStart = Date.now()
  const binanceBaseAssetsNoRepeats = await getBinanceBaseAssets()  
  const coinMarketCapBaseAssets = await getCoinMarketCapBaseAssets(pairsQuantityToCheck)  
  const baseAssetsInCommon = getBaseAssetsInCommon(binanceBaseAssetsNoRepeats, coinMarketCapBaseAssets)
  
  const baseAssetsNotFoundedInCoinMarketCap = getBaseAssetsNotFoundedInCoinMarketCap(binanceBaseAssetsNoRepeats, coinMarketCapBaseAssets)
  const baseAssetsNotFoundedInBinance = getBaseAssetsNotFoundedInBinance(coinMarketCapBaseAssets, binanceBaseAssetsNoRepeats)
   
  // OUTPUT BASEASSETS EN COMUN AMBAS API

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//





  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
  
  //---BUSCAR PARES DE BINANCE CON QUOTEASSETS QUE SEAN USDT BTC ETH DAI BNB BUSD COMO CONTRAPARTIDA PARA LOS ASSETS EN COMUN ENCONTRADOS---//

  //INPUT BASEASSETS EN COMUN AMBAS API

  const pairs = await getBinancePairs(baseAssetsInCommon)
  const sortedPairs = sortByMainCoins(pairs)
  const {filteredByMainCoinsPairsAndData, discardedPairsAndData} =  filterByMainCoins(sortedPairs)
  const filteredByMainCoinsPairs = filteredByMainCoinsPairsAndData.map(element=>element.pairs)



  const timeStampEnd = Date.now()
  
  return {filteredByMainCoinsPairsAndData, filteredByMainCoinsPairs}
  
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//

  



  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//

  //-------------------------------------------------------MONITOR--------------------------------------------------------------------------//
  
  // (CONTROL) Cantidades entregadas por cada proceso de obtencion de baseAssets
  // console.log("cantidad baseAssets de coinMarketCap", coinMarketCapBaseAssets.length)
  // console.log("cantidad baseAssets de binance", binanceBaseAssetsNoRepeats.length)
  // console.log("cantidad baseAssets en comun", baseAssetsInCommon.length)
  //console.log(baseAssetsInCommon)
  // console.log("baseAssets de binance no encontrados en coinMarketCap", baseAssetsNotFoundedInCoinMarketCap, "baseAssets de coinMarketCap no encontrados en binance", baseAssetsNotFoundedInBinance)

  // (CONTROL) cantidades entregadas por cada proceso de pares validos de binance
  // console.log("cantidad de pares obtenidos de binance", sortedPairs.length)
  // console.log("cantidad de pares de binance ordenados por principales baseAssets", sortedPairs.length)
  // console.log("cantidad de pares de binance filtrados", filteredByMainCoins.length)

  // (CONTROL) RESUMEN
    // console.log(`RESUMEN 1: De ${pairsQuantityToCheck} baseAssets solicitados a coinmarketCap Se obtuvo el ${Math.round((baseAssetsInCommon.length/binanceBaseAssetsNoRepeats.length)*100, 2)}% de los baseAssets totales de binance. ${baseAssetsInCommon.length} encontrados en comun de ${binanceBaseAssetsNoRepeats.length} baseAssets totales de binance`)
    // console.log(`RESUMEN 2: Se descarto ${baseAssetsInCommon.length - filteredByMainCoins.length} par/es por no tener una main coin como contra partida. El/Los par/es descartado/s es/son:`, discardedPairs)
    // console.log(`RESUMEN 3: Los procesos demoraron ${(timeStampEnd - timeStampStart)/1000} seconds`)
    // console.log("MUESTRA DEL OUTPUT: ", filteredByMainCoins[0], `de ${filteredByMainCoins.length} elementos`)
    //console.log(filteredByMainCoins)
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//


  
  
}



//-------------------------------------------------------FUNCIONES--------------------------------------------------------------------------//
    const getBinanceBaseAssets = async () =>{
      try{
        const binanceCapSymbolsResponse = await axios.get('https://api.binance.com/api/v3/exchangeInfo')
        const binanceCapData = binanceCapSymbolsResponse.data.symbols // array info binance
        
        const binanceCapSymbolsConRepetidos = binanceCapData.map(element=>element.baseAsset) // array simbolos binance con repetidos
        
        const binanceCapSymbolsSinRepetidosSet = new Set()
        
        binanceCapSymbolsConRepetidos.forEach((element)=>{
            binanceCapSymbolsSinRepetidosSet.add(element)
        })
        
        const binanceBaseAssetsNoRepeats = Array.from(binanceCapSymbolsSinRepetidosSet) // ---array simbolos binance sin repetidos
       
        return binanceBaseAssetsNoRepeats
      }
      
      catch(error){
        console.log("error intentando obtener lista de simbolos de binance", error)
        return null
      }
    }

    const getBinanceData = async () =>{
      try{
        const binanceResponse = await axios.get('https://api.binance.com/api/v3/exchangeInfo')
        const binanceData = binanceResponse.data.symbols // array info binance    

        return binanceData
      }
      
      catch(error){
        console.log("error intentando obtener data de binance", error)
        return null
      }
    }


    const getCoinMarketCapBaseAssets = async(quantityBaseAssetsInRequest) =>{
      try{
        const responseCoinMarketCap = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: {
          'X-CMC_PRO_API_KEY': '40d1b3fa-3dda-4285-94c2-555009f6f8d9',
        },
        params: {
          start: 1, 
          limit: quantityBaseAssetsInRequest, 
          sort: 'market_cap',
          sort_dir: 'desc',
          convert: "USD"   
        }        
      })      
      
      const coinMarketCapBaseAssets = responseCoinMarketCap.data["data"]        
        .map(element =>{
            return String(element.symbol)
        }) 
        
      return coinMarketCapBaseAssets
      }
    catch(error){
        console.log("error intentando traer los baseAssets de coinmarketcap", error)
        return null
      }
    }


    const getBaseAssetsInCommon =  (binanceBaseAssetsNoRepeats, coinMarketCapBaseAssets)=>{
      const uniqueBaseAssets = coinMarketCapBaseAssets
        .filter(element => binanceBaseAssetsNoRepeats.includes(element))
      return uniqueBaseAssets
    }


    const getBinancePairs = async(baseAssetsInCommon)=>{
      const binanceData = await getBinanceData()
    
      const pairs = baseAssetsInCommon.map((baseAssetInCommonElement)=>{ 
        const binanceDataFilteredByBaseAsset = binanceData
          .filter(binanceDataElement=>binanceDataElement.baseAsset===baseAssetInCommonElement)
        
        const pairs = binanceDataFilteredByBaseAsset
          .map(e=>{            
            return e.symbol
          })
          
        return {"baseAsset": baseAssetInCommonElement, "pairs": pairs}      
      })
    
      return pairs
    }

       
    const sortByMainCoins= (pairs) =>{
      const mainCoins = ["USDT", "BTC", "ETH", "USDC", "BNB", "BUSD", "DAI"]

      const sortedPairs = pairs.map((pair)=>{
        
        const baseAsset = pair.baseAsset

        const pairs = pair.pairs.sort((a,b)=>{
          const element1 = a.replace(baseAsset,"")
          const element2 = b.replace(baseAsset,"")
          
          if(mainCoins.includes(element1) && mainCoins.includes(element2)){
            return mainCoins.indexOf(element1) - mainCoins.indexOf(element2)
          }
          
          else if(mainCoins.includes(element1)){
            return -1
          }

          else if(mainCoins.includes(element2)){
            return 1
          }
          
          else return element1.localeCompare(element2)   

        })

        return {"baseAsset": baseAsset, "pairs": pairs}
      })

      return sortedPairs
    }


    const filterByMainCoins = (pairs) =>{    

      const discardedPairsAndData = []
      
      const filteredByMainCoinsPairsAndData = pairs.map((pair)=>{
        
        const baseAsset = pair.baseAsset
        const quoteAssets = pair.pairs.map(element=>element.replace(baseAsset, ""))

        if(quoteAssets[0] === "USDT" || quoteAssets[0] === "BTC" || quoteAssets[0] === "ETH" || quoteAssets[0] === "USDC" || quoteAssets[0] === "BNB" || quoteAssets[0] === "BUSD" || quoteAssets[0] === "DAI"){
          const pairs = quoteAssets
            .map(element=>(element === "USDT" || element === "BTC" || element === "ETH" || element === "USDC" || element === "BNB" || element === "BUSD" || element === "DAI") && `${baseAsset}${element}`)
          
          const pairsNoUndefined = pairs
            .filter(element=>element !== undefined && element)
          
          return {"baseAsset": baseAsset, "pairs": pairsNoUndefined}
        }   
        
        else if(baseAsset === "USDT") {return {"baseAsset": "USDT", "pairs": "USDTUSDC"}}

        else{
          discardedPairs.push(pair)          
          return undefined
        } 
      })
        .filter(element=>element !== undefined)

      
      return {filteredByMainCoinsPairsAndData, discardedPairsAndData}
    }

    // baseAssets de binance no encontrados en coinMarketCap
    const getBaseAssetsNotFoundedInCoinMarketCap = (binanceBaseAssetsNoRepeats, coinMarketCapBaseAssets)=>{
    const baseAssetsNotFoundedInCoinMarketCap = binanceBaseAssetsNoRepeats.filter(element => 
      !coinMarketCapBaseAssets.some(elemento => elemento === element)
    );
    return baseAssetsNotFoundedInCoinMarketCap
    }

  // baseAssets de coinMarketCap no encontrados en binance
  const getBaseAssetsNotFoundedInBinance = (coinMarketCapBaseAssets, binanceBaseAssetsNoRepeats)=>{
    const baseAssetsNotFoundedInBinance =  coinMarketCapBaseAssets.filter(element => 
      !binanceBaseAssetsNoRepeats.some(elemento => elemento === element)
   );
   return baseAssetsNotFoundedInBinance
  }



module.exports = getBinanceValidPairs