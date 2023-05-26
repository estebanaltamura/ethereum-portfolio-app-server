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

const axios = require('axios');

const getPairs = async()=>{
  const binanceBaseAssetsNoRepeats = await getBinanceBaseAssets()
  const coinMarketCapBaseAssets = await getCoinMarketCapBaseAssets(350)
  const baseAssetsInCommon = getBaseAssetsInCommon(binanceBaseAssetsNoRepeats, coinMarketCapBaseAssets)

  const pairs = await getBinancePairs(baseAssetsInCommon)
  const filteredPairsByMainCoins = getFilteredPairsByMainCoins(pairs)
  const filteredAndSortedPairsByMainCoins = getSortedElementPairs(filteredPairsByMainCoins)

  return filteredAndSortedPairsByMainCoins
}



//----------------------------------------------//FUNCIONES//------------------------------------------------------------------------//
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


    const getBaseAssetsInCommon =  (binanceBaseAssetsNoRepeats, coinMarketCapBaseAssets)=>{//------
      const uniqueBaseAssets = coinMarketCapBaseAssets  // --- array unico de simbolos compartidos ---
        .filter(element => binanceBaseAssetsNoRepeats.includes(element))
      return uniqueBaseAssets
    }

    const getBinancePairs = async(baseAssetsInCommon)=>{//------
      const binanceData = await getBinanceData()
    
      const pairs = baseAssetsInCommon.map((baseAssetElement)=>{ // --- pares en binance por cada symbol
        const binanceDataFilteredByBaseAsset = binanceData
          .filter(binanceDataElement=>binanceDataElement.baseAsset===baseAssetElement)
        
        const pairs = binanceDataFilteredByBaseAsset
          .map(e=>e.symbol)
        
        return {"baseAsset": baseAssetElement, "pairs": pairs}      
      })
    
      return pairs
    }

    const getFilteredPairsByMainCoins = (pairs)=>{
      
      const filteredPairs = pairs.map((element)=>{
        const baseAsset = element.baseAsset
        
        const quoteAssets = element.pairs
          .map(elemento=>elemento.replace(baseAsset,""))
          
        const filtered = quoteAssets
          .map(quoteAssetElement=>{
            if(
              quoteAssetElement.includes("USDT")||
              quoteAssetElement.includes("BTC") ||
              quoteAssetElement.includes("ETH") ||
              quoteAssetElement.includes("DAI") ||
              quoteAssetElement.includes("BNB") ||
              quoteAssetElement.includes("BUSD")
            ){return `${baseAsset}${quoteAssetElement}`}  
          })

      return {"baseAsset": baseAsset, "pairs": filtered}
      })

      return getNoUndefinedElements(filteredPairs)
    }


    const getNoUndefinedElements = (filteredPairsByMainCoins)=>{
      
      const filteredAndSortedPairsByMainCoins = filteredPairsByMainCoins.map((filteredPair)=>{
        const pairsNoUndefined = filteredPair.pairs.filter(element=>element!==undefined)
        return {"baseAsset": filteredPair.baseAsset, "pairs": pairsNoUndefined }
      })
    
      return filteredAndSortedPairsByMainCoins 
    }


    const getSortedElementPairs = (filteredPairsByMainCoins)=>{

      const sortedElementsPairs = filteredPairsByMainCoins.map((element)=>{
        const baseAsset = element.baseAsset
        
        console.log(element.pairs)
        element.pairs
          .forEach(elemento=>elemento.replace(baseAsset,""))

        const quoteAssets = element.pairs

        const quoteAssetsSorted = []
        
        quoteAssets.forEach(quoteAssets=>{
          if (quoteAssets.includes("USDT")) quoteAssetsSorted[0] = "USDT"
          if (quoteAssets.includes("BTC"))  quoteAssetsSorted[1] = "BTC"
          if (quoteAssets.includes("ETH"))  quoteAssetsSorted[2] = "ETH"
          if (quoteAssets.includes("DAI"))  quoteAssetsSorted[3] = "DAI"
          if (quoteAssets.includes("BNB"))  quoteAssetsSorted[4] = "BNB"
          if (quoteAssets.includes("BUSD")) quoteAssetsSorted[5] = "BUSD"
        })
            
        return {"baseAsset": element.baseAsset, "pairs": quoteAssetsSorted}        
      })
      
      return getNoUndefinedElements(sortedElementsPairs)
    }  

//----------------------------------------------------------------------------------------------------------------------------------------//

getPairs()    
    

   



    






  



   

    





    // const parValidoPorBaseAsset = paresPorBaseAsset.map(element=>{ // --- pares filtrados por baseassets especificos         
    //     //if(element.pares.includes(`${element.baseAsset}BTC`))       return {"baseAsset": element.baseAsset, "quoteAsset": "BTC", "parValido": `${element.baseAsset}BTC`}
    //     //else if(element.pares.includes(`${element.baseAsset}ETH`))  return {"baseAsset": element.baseAsset, "quoteAsset": "ETH", "parValido": `${element.baseAsset}ETH`}    
    //     //else if(element.pares.includes(`${element.baseAsset}USDT`)) return {"baseAsset": element.baseAsset, "quoteAsset": "USDT","parValido": `${element.baseAsset}USDT`}
    //     //else if(element.pares.includes(`${element.baseAsset}DAI`)) return {"baseAsset": element.baseAsset, "quoteAsset": "DAI","parValido": `${element.baseAsset}DAI`}  
    //     return {"baseAsset": element.baseAsset, "quoteAsset": element.pares[0].replace(element.baseAsset, ""), "parValido": element.pares[0]}
    // })
    
    // const requestToBinanceArray = parValidoPorBaseAsset.map((element, index)=>{        
    //     if(index === 0){
    //         return `[\"${element.parValido}\",`
    //     }
    //     else if(index < parValidoPorBaseAsset.length - 1){
    //         return `\"${element.parValido}\",`
    //     }    
    //     else if(index === parValidoPorBaseAsset.length - 1){            
    //         return `\"${element.parValido}\"]`
    //     }
    // })
    
    // const requestToBinanceString = requestToBinanceArray.join("")

    // pairs = {parValidoPorBaseAsset, requestToBinanceString}

    // return {parValidoPorBaseAsset, requestToBinanceString}





// module.exports = {
// pairs: ()=> pairs,
// getPairs}
















