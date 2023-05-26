const axios = require('axios');
const getPairs = require("./getPairs.js")


/*
intervalo de 4 segundos{
    await fetch a binance. retorna dashboard
    invoca funcion que responde con info actualizada de fetch cada 5 minutos de coiin cap y complementa dashboard
    reescribe variable let global con el objeto dashboard para que en forma de funcion sea consultable el valor actualizado desde cualquier punto 
    de la aplicacion para poder configurar una response al pedido xxx/dashboard.
}

*/
getPairs.getPairs()

const getDashboardData = async()=>{
    
    setInterval(async()=>{
        try{
            const pairsRequest = await getPairs.pairs()
            const pairs = pairsRequest.requestToBinanceString
            const parValido = pairsRequest.parValidoPorBaseAsset
            
            const binanceResponse = await axios(`https://api.binance.com/api/v3/ticker/24hr?symbols=${pairs}`)
            const binanceData = binanceResponse.data
            
            
                   
            
            
            //precios principales monedas
            const mainCoinsPricesResponse = await axios(`https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","USDTDAI","BNBUSDT","BUSDUSDT"]`)
            const mainCoinsPricesData = mainCoinsPricesResponse.data
            
            
            const mainCoinsPrices = mainCoinsPricesData.map((element, index)=> {
                switch (element.symbol) {
                    case "BTCUSDT": 
                        return {"symbol": "BTC", "price": element.lastPrice}
                        
                    case "ETHUSDT": 
                        return {"symbol": "ETH", "price": element.lastPrice}
                        
                    case "USDTDAI": 
                        return {"symbol": "USDT", "price": element.lastPrice}
                        
                    case "BNBUSDT": 
                        return {"symbol": "BNB", "price": element.lastPrice}
                        
                    case "BUSDUSDT": 
                        return {"symbol": "BUSD", "price": element.lastPrice}
                                               
                }
            })
            mainCoinsPrices.push({ symbol: 'DAI', price: String(1 / mainCoinsPrices.find(element=>element.symbol === "USDT").price)}) // --- precios principales monedas
                       

            const mainCoinsObject = {
                BTC: mainCoinsPrices.find(element=>element.symbol ==="BTC").price,
                ETH: mainCoinsPrices.find(element=>element.symbol ==="ETH").price,
                USDT: mainCoinsPrices.find(element=>element.symbol ==="USDT").price,
                DAI: mainCoinsPrices.find(element=>element.symbol ==="DAI").price,
                BNB: mainCoinsPrices.find(element=>element.symbol ==="BNB").price,
                BUSD: mainCoinsPrices.find(element=>element.symbol ==="BUSD").price
            }

            console.log(mainCoinsObject)
            
            
            //------------------------------//



            //request pares a binance
            binanceData.forEach(element=>{
                //console.log(binanceData.length) // todos los pares de la response de binance
                
                const parData = parValido.find(elemento=>elemento.parValido === element.symbol)
                
                //console.log(parData)
                console.log(parData.parValido, parData.baseAsset, element.lastPrice, parData.quoteAsset, Math.fround(element.lastPrice * mainCoinsObject[parData.quoteAsset],18))



                //parValido.find(elemento=>elemento.parValido === element.symbol) !== undefined
                
                //console.log(element.symbol, element.lastPrice, mainCoinsPrices.find(elementx=>elementx.symbol === element.symbol))
                //console.log(element.symbol, parValido[0].parValido)
                
                //console.log(parValido.parValido)
                        //elemento.parValido===element
                    
                    
            })
           
        }
        
    
        catch(error){
            console.log("algo fallo", error)
        }
    
    },4000)
    
    
}
   
getDashboardData()