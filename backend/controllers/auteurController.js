const auteurModel = require('../models/auteurModel');

exports.getAllAuteurs = async (req, res, next) => {
    try{
        const results= await auteurModel.findAll();
        res.json(results);
    } catch (error) {
        next(error);
    }
}

exports.getByIdAuteur = async(req, res,next)=>{
    try{
        const result = await auteurModel.findById(req.params.id_auteur, req.body);
        if(!result){
            return res.status(404).json({erreur: `Auteur ${req.params.id_auteur} non trouvé`});
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

exports.createAuteur = async (req, res, next) => {
    try{
        const newAuteur = await auteurModel.create(req.body);
        res.status(201).json(newAuteur);
    } catch (error) {
        next(error);
    }
}

exports.updateAuteur = async(req, res, next)=>{
    try{
        const result = await auteurModel.update(req.params.id_auteur, req.body);
        res.status(200).json(result);

        if(!result) {
            return res.status(404).json({ erreur: `Auteur ${req.params.id_auteur} non trouvé` });
        }
    }catch(error){
        next(error);
    }
}

exports.deleteAuteur = async(req, res, next)=>{
    const {id_auteur} = req.params;
    try{
        const result = await auteurModel.delete(id_auteur);
        if (!result) {
            return res.status(404).json({ erreur: `Auteur ${id_auteur} non trouvé` });
        }
        console.log(`Auteur avec ID ${id_auteur} supprimé avec succès.`);
        res.json({ message: "Auteur supprimé avec succès" });
    } catch (err) { next(err); }
};