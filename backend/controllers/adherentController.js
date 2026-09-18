const AdherentModel = require('../models/adherentModel');

exports.getAllAdherents = async (req, res, next) => {
    try{
        const results= await AdherentModel.findAllAdherents();
        res.status(200).json(results);
    }catch (error) {
        next(error);
    }
}

exports.getByIdAdherent = async(req, res,next)=>{
    const {id_adherent} = req.params;
    try{
        const result = await AdherentModel.findByIdAdherent(id_adherent);
        if(!result){
            return res.status(404).json({erreur: `Adhérent ${id_adherent} non trouvé`});
        }
        res.status(200).json(result);
    }catch (error) {
        next(error);
    }
}

exports.getHistoriqueAdherent = async (req, res, next) => {
    try {
        const result = await AdherentModel.getHistoriqueAdherent(req.params.id_adherent);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

exports.createAdherent = async (req, res, next) => {
    const {nom_adherent, contact} = req.body;
    try{
        const result = await AdherentModel.createAdherent({ nom_adherent, contact });
        res.status(201).json(result);
    }catch (error) {
        next(error);
    }
}

exports.updateAdherent = async(req, res, next)=>{
    try{
        const result = await AdherentModel.updateAdherent(req.params.id_adherent, req.body);
        res.status(200).json(result);
    }
    catch(error){
        next(error);
    }
}

exports.deleteAdherent = async(req, res, next)=>{
    try{
        await AdherentModel.deleteAdherent(req.params.id_adherent);
        res.status(204).send();
    }catch(error){
        next(error);
    }
}
