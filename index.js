const http = require('http');
const getUpdatedData = require("./tasks/getUpdatedData")
const getDataFromFirebase = require("./tasks/getDataFromFirebase")


getUpdatedData.getUpdatedData()




const server = http.createServer(async (req, res) => {
  
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const url = req.url
    const param1 = url.split("/")[1]
    const param2 = url.split("/")[2]
      
    const updatedData = await getUpdatedData.updatedData()
        
    if(typeof updatedData === "object"){
      if(updatedData.data.hasOwnProperty(param1)){
        if(param2 === "ALL"){
          res.statusCode = 200;  // OK
          res.end(JSON.stringify({data: updatedData.data[param1], sinchronicityStatus: updatedData.sinchronicityStatus, delayApi:updatedData.delayApi, message:updatedData.message}))
        }
        else if(updatedData.data[param1].hasOwnProperty(param2)){  
          res.statusCode = 200;  // OK
          res.end(JSON.stringify({data: updatedData.data[param1][param2], sinchronicityStatus: updatedData.sinchronicityStatus, delayApi:updatedData.delayApi, message:updatedData.message}))         
        } 
      }
    }

 
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  
  console.log(`Servidor HTTP escuchando en el puerto ${port}`);
});





