const axios = require('axios');



const getDataFromBinance = async (symbols)=>{
    try{
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbols=["ETHBTC","LTCBTC"]`)
  
      const dataBinance = {}
      
      console.log(response.data )

      const symbolsbinance = response.data        
        .map(element =>{
            dataBinance[element.symbol] =         
            {"last_price"         : String(element.lastPrice)             
            }
          return String(element.symbol)
        }
          
        )     
        
        //console.log(dataBinance, symbolsbinance)
        return {dataBinance, symbolsbinance}   
    }
    
    catch(error){
      console.log("error intentando traer data de la api de coinmarketcap", error)
      return null
    }
  }
  
  getDataFromBinance()


  module.exports = getDataFromBinance;
