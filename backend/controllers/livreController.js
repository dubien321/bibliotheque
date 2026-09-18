const path = require('path');
const LivreModel = require('../models/livreModel');

exports.getAllLivres = async (req, res, next) => {
    try{
        const results = await LivreModel.findAll();
        res.status(200).json(results);
    }catch (error) {
        next(error);
    }
}

exports.getByIdLivres = async(req,res, next)=>{
    try {
        const results = await LivreModel.findById(req.params.id_livre, req.body);
        res.json(results)
    } catch (error) {
        
    }
}

exports.createLivre = async (req, res, next) => {
    const {titre, date_publication, id_auteur} = req.body;
    try{
        const result = await LivreModel.createLivre({ titre, date_publication, id_auteur });
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }  
}

exports.updateLivre = async(req, res, next)=>{
    const {id_livre} = req.params;
    const {titre, id_auteur, statut = null} = req.body;
    try{
        const result = await LivreModel.updateLivre(id_livre, { titre, id_auteur, statut });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}

exports.deleteLivre = async(req, res, next)=>{
    const {id_livre} = req.params;
    try{
        const result= await LivreModel.deleteLivre(id_livre);
        res.status(204).json(result);
    }catch(error){
        next(error);
    }
}
exports.getAllLivresByNameAuteur = async (req, res, next) => {
    const search = req.query.search || '';
    try {
        const results = await LivreModel.findByNameAuteur(search);
        res.status(200).json(results);
    }   catch (error) {
        next(error);
    }  
}