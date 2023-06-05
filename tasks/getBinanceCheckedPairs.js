const getBinanceValidPairs = require("./getBinanceValidPairs")
const axios = require('axios');

const getBinanceCheckedPairs = async()=>{

    const {filteredByMainCoinsPairsAndData, filteredByMainCoinsPairs} = await getBinanceValidPairs(2000)

    const pairsFilteredBySelectedIndex = getPairsFilteredBySelectedIndex(filteredByMainCoinsPairs, 0)

    const paramToRequestToBinanceApi = setParamToRequestToBinanceApi(pairsFilteredBySelectedIndex.slice(0,250))

    const dataOfpairsFilteredBySelectedIndex =  await requestToBinanceApi(paramToRequestToBinanceApi)

    
       
    const {validPairsWithPriceSliced, validPairsNoPrice} = getCheckedPairs(dataOfpairsFilteredBySelectedIndex, 200)

   

    const pairs = validPairsWithPriceSliced.map(element=>element.pair)

    const baseAssets = validPairsWithPriceSliced.map(element=>element.baseAsset)
    
    const pairsSlicedRequest = setParamToRequestToBinanceApi(pairs)

    
    return {validPairsWithPriceSliced, pairsSlicedRequest, pairs, baseAssets}    
}

module.exports = getBinanceCheckedPairs


//de los pares validos totales. 
/*
primero una funcion que gestione las iteraciones. Entran todos los pares de getBinanceValidPairs y returna todos los pares que obtuvieron precio y los que no
otra que filtre los pares para la iteracion actual, 
otra que genere los params, 
otra que consulte y devuelva cuales obtuvieron precio y cuales no, 

*/



//-------------------------------------------------------FUNCIONES--------------------------------------------------------------------------//


const getPairsFilteredBySelectedIndex = (validPairs, selectedIndex)=>{
    const pairsFilteredBySelectedIndex = validPairs.map(element=>element[selectedIndex])
    
    return pairsFilteredBySelectedIndex
}


const setParamToRequestToBinanceApi = (validPairs) =>{
      
    const paramToBinanceApiRequest = validPairs.map((validPair, index)=>{        
            if(index === 0){
                return `[\"${validPair}\",`
            }
            else if(index < validPairs.length - 1){
                return `\"${validPair}\",`
            }    
            else if(index === validPairs.length - 1){            
                return `\"${validPair}\"]`
            }        
    })
    
    const queryParamsToBinanceApiRequestString = paramToBinanceApiRequest.join("")    
    return queryParamsToBinanceApiRequestString
}

const requestToBinanceApi = async(queryParams)=>{
    // intenta primer indice, incluye en un array los que tienen precio, incluye en otro array a los que hay que iterar
    try{
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbols=${queryParams}`)
      const pairsOfResponseBinanceApi = response.data
      return pairsOfResponseBinanceApi   
    }
    catch(error){          
      console.log(error, "request invalida")            
    }
          
}


const getCheckedPairs = (selectedValidPairsResponse, quantityPairs)=>{
   
    const validPairsWithPriceFull = []
    const validPairsNoPrice = []

    selectedValidPairsResponse.forEach(element=>{    
        let quoteAsset

        if(element.symbol.slice(1,).includes("USDT")) quoteAsset = "USDT"
        if(element.symbol.slice(1,).includes("BTC"))  quoteAsset = "BTC"
        if(element.symbol.slice(1,).includes("ETH"))  quoteAsset = "ETH"
        if(element.symbol.slice(1,).includes("USDC")) quoteAsset = "USDC"
        if(element.symbol.slice(1,).includes("BNB"))  quoteAsset = "BNB"
        if(element.symbol.slice(1,).includes("BUSD")) quoteAsset = "BUSD"
        if(element.symbol.slice(1,).includes("BUSD")) quoteAsset = "DAI"  

        const baseAsset = element.symbol.replace(quoteAsset, "")

        if(Number(element.lastPrice) !== 0){
            validPairsWithPriceFull.push({
                "pair"              : element.symbol, 
                "baseAsset"         : baseAsset,
            })
        }
                
        else{validPairsNoPrice.push({
            "pair"              : element.symbol, 
            "baseAsset"         : baseAsset})
        }
    })   
    
    const validPairsWithPriceSliced = validPairsWithPriceFull.slice(0,quantityPairs)
return {validPairsWithPriceSliced, validPairsNoPrice}

}  







// const getCheckedPairs = (selectedValidPairsResponse, quantityPairs)=>{
   
//     const validPairsWithPriceFull = []
//     const validPairsNoPrice = []

//     selectedValidPairsResponse.forEach(element=>{    
//         let quoteAsset

//         if(element.symbol.slice(1,).includes("USDT")) quoteAsset = "USDT"
//         if(element.symbol.slice(1,).includes("BTC"))  quoteAsset = "BTC"
//         if(element.symbol.slice(1,).includes("ETH"))  quoteAsset = "ETH"
//         if(element.symbol.slice(1,).includes("USDC")) quoteAsset = "USDC"
//         if(element.symbol.slice(1,).includes("BNB"))  quoteAsset = "BNB"
//         if(element.symbol.slice(1,).includes("BUSD")) quoteAsset = "BUSD"
//         if(element.symbol.slice(1,).includes("BUSD")) quoteAsset = "DAI"  

//         const baseAsset = element.symbol.replace(quoteAsset, "")

//         if(Number(element.lastPrice) !== 0){
//             validPairsWithPriceFull.push({
//                 "pair"              : element.symbol, 
//                 "baseAsset"         : baseAsset,
//                 "quoteAsset"        : quoteAsset,
//                 "price"             : element.lastPrice, 
//                 "priceChange"       : element.priceChange, 
//                 "priceChangePercent": element.priceChangePercent, 
//                 "highPrice"         : element.highPrice, 
//                 "lowPrice"          : element.lowPrice,
//                 "baseAssetVolume"   : element.volume,
//                 "quoteAssetVolume"  : element.quoteVolume,
//                 "source"            : "http-initial-request"}   
//             )
//         }
        
        
//         else{validPairsNoPrice.push({
//             "pair"              : element.symbol, 
//             "baseAsset"         : baseAsset,           
//             "price"             : Number(element.lastPrice), 
//             "hasPrice"          : Number(element.lastPrice) !== 0})}
//     })   
    
//     const validPairsWithPriceSliced = validPairsWithPriceFull.slice(0,quantityPairs)
// return {validPairsWithPriceSliced, validPairsNoPrice}

// }  











// const getValidPairsData = (selectedValidPairsResponse)=>{
   
//     const validPairsData = selectedValidPairsResponse.map(element=>{
//         let quoteAsset

//         if(element.symbol.slice(1,).includes("USDT")) quoteAsset = "USDT"
//         if(element.symbol.slice(1,).includes("BTC"))  quoteAsset = "BTC"
//         if(element.symbol.slice(1,).includes("ETH"))  quoteAsset = "ETH"
//         if(element.symbol.slice(1,).includes("USDC")) quoteAsset = "USDC"
//         if(element.symbol.slice(1,).includes("BNB"))  quoteAsset = "BNB"
//         if(element.symbol.slice(1,).includes("BUSD")) quoteAsset = "BUSD"
//         if(element.symbol.slice(1,).includes("BUSD")) quoteAsset = "DAI"
      
//         const baseAsset = element.symbol.replace(quoteAsset, "")

//         return {
//             "pair"              : element.symbol, 
//             "baseAsset"         : baseAsset,
//             "quoteAsset"        : quoteAsset,
//             "price"             : element.lastPrice, 
//             "priceChange"       : element.priceChange, 
//             "priceChangePercent": element.priceChangePercent, 
//             "highPrice"         : element.highPrice, 
//             "lowPrice"          : element.lowPrice,
//             "baseAssetVolume"   : element.volume,
//             "quoteAssetVolume"  : element.quoteVolume,
//             "source"            : "http-initial-request"}
//         })

// return validPairsData

// }  

//----------------------------------------------------------------------------------------------------------------------------------------//



// tarea lograr conseguir mediante iteraciones automaticas la maxima cantidad de pares posibles
    

   



    






  



   

    





    // const parValidoPorBaseAsset = paresPorBaseAsset.map(element=>{ // --- pares filtrados por baseassets especificos         
    //     //if(element.pares.includes(`${element.baseAsset}BTC`))       return {"baseAsset": element.baseAsset, "quoteAsset": "BTC", "parValido": `${element.baseAsset}BTC`}
    //     //else if(element.pares.includes(`${element.baseAsset}ETH`))  return {"baseAsset": element.baseAsset, "quoteAsset": "ETH", "parValido": `${element.baseAsset}ETH`}    
    //     //else if(element.pares.includes(`${element.baseAsset}USDT`)) return {"baseAsset": element.baseAsset, "quoteAsset": "USDT","parValido": `${element.baseAsset}USDT`}
    //     //else if(element.pares.includes(`${element.baseAsset}DAI`)) return {"baseAsset": element.baseAsset, "quoteAsset": "DAI","parValido": `${element.baseAsset}DAI`}  
    //     return {"baseAsset": element.baseAsset, "quoteAsset": element.pares[0].replace(element.baseAsset, ""), "parValido": element.pares[0]}
    // })
    
    

    // pairs = {parValidoPorBaseAsset, requestToBinanceString}

    // return {parValidoPorBaseAsset, requestToBinanceString}



    //-------------------------ANOTADOR----------------------------//

    // const getFilteredPairsByMainCoins = (pairs)=>{
      
    //   const filteredPairs = pairs.map((element)=>{
    //     const baseAsset = element.baseAsset
        
    //     const quoteAssets = element.pairs
    //       .map(elemento=>elemento.replace(baseAsset,""))
          
    //     const filtered = quoteAssets
    //       .map(quoteAssetElement=>{
    //         if(
    //           quoteAssetElement.includes("USDT")||
    //           quoteAssetElement.includes("BTC") ||
    //           quoteAssetElement.includes("ETH") ||
    //           quoteAssetElement.includes("DAI") ||
    //           quoteAssetElement.includes("BNB") ||
    //           quoteAssetElement.includes("BUSD")
    //         ){return `${baseAsset}${quoteAssetElement}`}  
    //       })

    //   return {"baseAsset": baseAsset, "pairs": filtered}
    //   })

    //   return getNoUndefinedElements(filteredPairs)
    // }


    // const getNoUndefinedElements = (filteredPairsByMainCoins)=>{
      
    //   const filteredAndSortedPairsByMainCoins = filteredPairsByMainCoins.map((filteredPair)=>{
    //     const pairsNoUndefined = filteredPair.pairs.filter(element=>element!==undefined)
    //     return {"baseAsset": filteredPair.baseAsset, "pairs": pairsNoUndefined }
    //   })
    
    //   return filteredAndSortedPairsByMainCoins 
    // }


    // const getSortedElementPairs = (filteredPairsByMainCoins)=>{

    //   const sortedElementsPairs = filteredPairsByMainCoins.map((element)=>{
    //     const baseAsset = element.baseAsset
               
    //     element.pairs
    //       .forEach(elemento=>elemento.replace(baseAsset,""))

    //     const quoteAssets = element.pairs

    //     const quoteAssetsSorted = []
        
    //     quoteAssets.forEach(quoteAssets=>{
    //       if (quoteAssets.includes("USDT")) quoteAssetsSorted[0] = baseAsset === 'USDT' ? 'USDTDAI' : `${baseAsset}USDT`
    //       if (quoteAssets.includes("BTC"))  quoteAssetsSorted[1] = baseAsset === 'BTC'  ? 'BTCUSDT' : `${baseAsset}BTC`
    //       if (quoteAssets.includes("ETH"))  quoteAssetsSorted[2] = baseAsset === 'ETH'  ? 'ETHUSDT' : `${baseAsset}ETH`
    //       if (quoteAssets.includes("DAI"))  quoteAssetsSorted[3] = baseAsset === 'DAI'  ? 'DAIUSDT' : `${baseAsset}DAI`
    //       if (quoteAssets.includes("BNB"))  quoteAssetsSorted[4] = baseAsset === 'BNB'  ? 'BNBUSDT' : `${baseAsset}BNB`
    //       if (quoteAssets.includes("BUSD")) quoteAssetsSorted[5] = baseAsset === 'BUSD' ? 'BUSDUSDT' : `${baseAsset}BUSD`
    //     })
            
    //     return {"baseAsset": element.baseAsset, "pairs": quoteAssetsSorted}        
    //   })
      
    //   return getNoUndefinedElements(sortedElementsPairs)
    // }  


    // const setValidPairs = (validPairsMultipleCoins)=>{
      
    //   const validPairs = validPairsMultipleCoins.map((element, index)=>{          
    //     return element.pairs[0]         
    //   })

      
    //   return validPairs
    // }
    
    //----------------------------------------------------------------------------------------------------------//


//console.log("sortedPairs", sortedPairs.length)

  //console.log(noUSDT(sortedPairs).inputLenghth, noUSDT(sortedPairs)['usdt founded'], noUSDT(sortedPairs).return)
  //const filteredPairsByMainCoins = getFilteredPairsByMainCoins(pairs)
  //const filteredAndSortedPairsByMainCoins = getSortedElementPairs(filteredPairsByMainCoins)
  //const selectedValidPairs = setValidPairs(filteredAndSortedPairsByMainCoins)
  // OUTPUT PARES DE BINANCE










  // const paramToRequestToBinanceApi = setParamToRequestToBinanceApi(selectedValidPairs)
  
  // const selectedValidPairsResponse = await requestToBinanceApi(paramToRequestToBinanceApi)
  
 
  // const selectedValidPairsData = getSelectedValidPairsData(selectedValidPairsResponse)
    
  
  // return {selectedValidPairs, selectedValidPairsData} 
  











