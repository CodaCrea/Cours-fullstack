const Thing = require('../models/Thing');
const fs = require('fs');

exports.createThing = async (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  try {
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
      ...thingObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    const result = await thing.save();
    if (result) {
      res.status(201).json({ message: 'Objet enregistré !' });
    }
  }
  catch (error) {
    res.status(400).json({ error });
  }
};

exports.modifyThing = async (req, res, next) => {
  const thingObject = req.file ? {
    ...JSON.parse(req.body.thing),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  try {
    const resultId = await Thing.findOne({ _id: req.params.id });
    delete thingObject._userId;
    if (resultId.userId != req.auth.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const result = await Thing.updateOne({
      _id: req.params.id
    },
      {
        ...thingObject, _id: req.params.id
      });
    if (result) {
      res.status(200).json({ message: 'Objet modifié' });
    }
  } catch (error) {
    res.status(400).json({ error });
  };
};

exports.deleteThing = async (req, res, next) => {
  try {
    const result = await Thing.findOne({ _id: req.params.id });
    if (result.userId != req.auth.userId) {
      res.status(401).json({ message: 'Not authorized' });
    } else {
      const filename = result.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        result.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Objet supprimé !' });
        if (!filename) {
          res.status(401).json({ error });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  };
};

exports.getOneThing = async (req, res, next) => {
  const result = await Thing.findOne({
    _id: req.params.id
  });
  try {
    if (result) {
      res.status(200).json(result);
    }
  }
  catch (error) {
    res.status(400).json({ error });
  };
};

exports.getAllThing = async (req, res, next) => {
  const result = await Thing.find();
  try {
    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json({ error });
  };
};