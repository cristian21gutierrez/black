const mongoose = require ("mongoose");

const connected = async ( ) => {
    try {
        const DB_URI =  process.env.CONNECT_DB;
        await mongoose.connect(DB_URI);
        console.log("Conexión a la BD exitosa");
        
    } catch (error) {
        console.log("Falló la conexión");
        
    }
}

module.exports = {
    connected,
}