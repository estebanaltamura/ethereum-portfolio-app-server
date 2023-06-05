const axios = require('axios');
const getBinanceCheckedPairs = require("./getBinanceCheckedPairs")



const getCoinMarketCapData = async(quantityBaseAssetsInRequest, baseAssets) =>{
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
    
    console.log(responseCoinMarketCap.data["data"].length, baseAssets.length)

    const coinMarketCapFilteredResponse = responseCoinMarketCap.data["data"].filter(element=>{    
        if (baseAssets.includes(element.symbol)){
            console.log(element.symbol)
            return baseAssets.includes(element.symbol)

        }
        
    })

    const coinMarketCapFilteredResponseHandled = coinMarketCapFilteredResponse.map(element=>{
        return {
                    "symbol"        : element.symbol,
                    "name"          : element.name,
                    "rank"          : element.cmc_rank,
                    "circulating"   : element.circulating_supply,
                    "marketCap"     : element.quote.USD.market_cap
                }
    })

    

    
    

    // const coinMarketCapBaseAssets = responseCoinMarketCap.data["data"]        
    // .map(element =>{
    //     return {
    //         "symbol"        : element.symbol,
    //         "name"          : element.name,
    //         "rank"          : element.cmc_rank,
    //         "circulating"   : element.circulating_supply,
    //         "marketCap"     : element.quote.USD.market_cap
    //     }
    // }) 

   
    
    //console.log(coinMarketCapFilteredResponse)
    //return coinMarketCapBaseAssets
    }
    catch(error){
        console.log("error intentando traer los baseAssets de coinmarketcap", error)
        return null
    }
}

const a = async()=>{
    const {validPairsWithPriceSliced, pairsSlicedRequest, pairs, baseAssets} = await getBinanceCheckedPairs() 
    
    getCoinMarketCapData(2000, baseAssets)
}

   
a()



