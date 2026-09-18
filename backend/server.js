// Demarrer le serveur
require('dotenv').config();
const app = require("./app");
const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Le serveur est démarré avec sucess au port ${PORT}`);
});