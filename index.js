const http = require('http');
const getUpdatedData = require("./tasks/getUpdatedData")
const getDataFromFirebase = require("./tasks/getDataFromFirebase")


getUpdatedData.getUpdatedData()




const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');


    const url = req.url
    const param1 = url.split("/")[1]
    const param2 = url.split("/")[2]
      
    const updatedData = await getUpdatedData.updatedData()
        
    if(typeof updatedData === "object"){
      if(param1 === "ALL"){
        res.statusCode = 200;  // OK
        res.end(JSON.stringify({data: updatedData.data, sinchronicityStatus: updatedData.sinchronicityStatus, delayApi:updatedData.delayApi, message:updatedData.message}))        
        }
      else if(param1 === "LIST"){
        res.statusCode = 200;  // OK
        res.end(JSON.stringify({data: Object.keys(updatedData.data), sinchronicityStatus: updatedData.sinchronicityStatus, delayApi:updatedData.delayApi, message:updatedData.message}))        
      }
      else if(updatedData.data.hasOwnProperty(param1)){
        if(param2 === "ALL"){
          res.statusCode = 200;  // OK
          res.end(JSON.stringify({data: updatedData.data[param1], sinchronicityStatus: updatedData.sinchronicityStatus, delayApi:updatedData.delayApi, message:updatedData.message}))
        }
      
        else if(updatedData.data[param1].hasOwnProperty(param2)){  
          res.statusCode = 200;  // OK
          res.end(JSON.stringify({data: updatedData.data[param1][param2], sinchronicityStatus: updatedData.sinchronicityStatus, delayApi:updatedData.delayApi, message:updatedData.message}))         
        } 
        else{
          res.statusCode = 400;  // BAD REQUEST
          res.end("Invalid request. Input ALL or a valid cryptocurrency property e.g.:/Ethereum/price or /Ethereum/ALL")
        }
      }
      else{
        res.statusCode = 400;  // BAD REQUEST
        res.end("Invalid request. Input LIST or a cryptocurrency name as first parameter e.g.:/LIST or /Ethereum/validProperty")
      }
    }
    else{
      //res.statusCode = 500;  // BAD REQUEST
      res.end("The server is not able to fulfil the request")
    }
    

 
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  
  console.log(`Servidor HTTP escuchando en el puerto ${port}`);
});





