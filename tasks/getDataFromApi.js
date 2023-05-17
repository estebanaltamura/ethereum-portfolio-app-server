const axios = require('axios');


const getDataFromApi = async ()=>{
  try{
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: {
          'X-CMC_PRO_API_KEY': 'ce6af507-ac68-4afa-81cd-efe7c1303437',
      },
      params: {
        start: 1, // Índice de inicio de las criptomonedas (1 para empezar desde la primera)
        limit: 100, // Número de criptomonedas a obtener
        sort: 'market_cap',
        sort_dir: 'desc',
        convert: "USD",        
      }        
    })

    const cryptoCurrenciesPricesObject = {}

    response.data["data"]        
        .filter(crypto=> crypto.name === "Ethereum" || crypto.platform?.name === "Ethereum")     
        .map(element => cryptoCurrenciesPricesObject[element.name] = 
            {"id"         : String(element.id), 
            "symbol"      : String(element.symbol),                
            "price"       : String(element.quote.USD.price), 
            "cmc_rank"    : String(element.cmc_rank),
            "changes"     : {
                            "percent_change_1h"  : String(element.quote.USD.percent_change_1h),
                            "percent_change_24h" : String(element.quote.USD.percent_change_24h),
                            "percent_change_7d"  : String(element.quote.USD.percent_change_7d),
                            "percent_change_30d" : String(element.quote.USD.percent_change_30d),
                            "percent_change_60d" : String(element.quote.USD.percent_change_60d),
                            "percent_change_90d" : String(element.quote.USD.percent_change_90d),
                          },
            "market_cap"  : String(element.quote.USD.market_cap),
            "volume_24h"  : String(element.quote.USD.volume_24h),
            "logo"        : `https://s2.coinmarketcap.com/static/img/coins/64x64/${String(element.id)}.png`,
            "last_updated": String(element.last_updated)
            }
        )     
    
    return cryptoCurrenciesPricesObject
  }
  
  catch(error){
    console.log("error intentando traer data de la api de coinmarketcap")
    return null
  }

}

module.exports = getDataFromApi;


