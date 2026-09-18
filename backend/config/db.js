// --recuperer Pool 
const {Pool} = require('pg');
const errorHandler = require('../middlewares/errorHandler');

// --instancier le Pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false }: false,
});
console.log('Base de données ciblée :', process.env.DB_NAME);
pool.connect((err, client, release)=>{
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données');
        release();
});

module.exports= pool;