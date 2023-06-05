La informacion real time es tomada de la api de binance, pero como la api de binance no tiene market cap, circulante ni informacion antigua simple de tomar, uso tambien la api de coinmarket cap.

La seleccion de monedas a mostrar tiene cumplir la condicion de estar listada en binance, por lo tanto el proceso de seleccion de que monedas vas a ser mostradas es el siguiente:
    -Se pide todos los simbolos a binance
    -Se pide todos los simbolos a coin market cap
    -Se filtra uno sobre otro para conseguir un tercer array que va a ser el array maestro de symbolos

Sobre el array maestro los procesos son:
    -Pedir la informacion soliccitada y retornar un objeto
    -actualizar firebase
    -En caso de retraso se toman los datos de firebase y se avisa al cliente