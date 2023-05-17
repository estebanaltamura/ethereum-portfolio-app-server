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
    const param3 = url.split("/")[3]
       
    
    const updatedData = await getUpdatedData.updatedData()
        
    console.log(updatedData)
   
    
    
    
    
    


  
  
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  
  console.log(`Servidor HTTP escuchando en el puerto ${port}`);
});





