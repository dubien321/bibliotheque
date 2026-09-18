const express = require('express');
const cors = require('cors');
const path= require('path');
const auteurRoutes = require('./routes/auteurRoutes');
const adherentRoutes = require('./routes/adherentRoutes');
const livreRoutes = require('./routes/livreRoutes');
const empruntRoutes = require('./routes/empruntRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(express.urlencoded({extended : true}))


const frontEndPath = path.join(__dirname, '..', 'frontend');

app.get('/', (req, res) => {
	res.sendFile(path.join(frontEndPath, 'index.html'));
});
app.use(express.static(frontEndPath));
app.use('/api/auteurs', auteurRoutes);
app.use('/api/adherents', adherentRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/emprunts', empruntRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(errorHandler);


module.exports=app;