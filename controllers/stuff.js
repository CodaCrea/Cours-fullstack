const Thing = require('../models/Thing');

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;
  delete thingObject._userId;
  const thing = new Thing({
    ...thingObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  thing.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
    .catch(error => { res.status(400).json({ error }) })
};

exports.modifyThing = (req, res, next) => {
  Thing.updateOne({
    _id: req.params.id
  },
    {
      ...req.body, _id: req.params.id
    })
    .then(() => res.status(200).json({
      message: 'Objet modifié'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};

exports.deleteThing = (req, res, next) => {
  Thing.deleteOne({
    _id: req.params.id
  })
    .then(() => res.status(200).json({
      message: 'Objet supprimé'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(400).json({
      error
    }));
};

exports.getAllThing = (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({
      error
    }));
};

// const likeSauce = async (req, res) => {
//   let sauce = await Sauce.findOne({ _id: req.params.id });
//   try {
//     if (sauce && sauce.userId === req.body.userId) {
//       res
//         .status(200)
//         .json({ message: "You can't like  or dislike your sauces !" });
//       // le créateur ne devrait pas pouvoir liké
//     } else {
//       console.log(sauce);
//       switch (req.body.like) {
//         case 0: //cas: req.body.like = 0
//           //const sauce = await Sauce.findOne({ _id: req.params.id })
//           if (sauce.usersLiked.find((user) => user === req.body.userId)) {
//             // on cherche si l'utilisateur est déjà dans le tableau usersLiked
//             await Sauce.updateOne(
//               { _id: req.params.id },
//               {
//                 // si oui, on va mettre à jour la sauce avec le _id présent dans la requête
//                 $inc: { likes: -1 }, // on décrémente la valeur des likes de 1 (soit -1)
//                 $pull: { usersLiked: req.body.userId }, // on retire l'utilisateur du tableau.
//               }
//             );
//             res.status(201).json({ message: "vote enregistré." });
//           }
//           if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
//             //mêmes principes que précédemment avec le tableau usersDisliked
//             await Sauce.updateOne(
//               { _id: req.params.id },
//               {
//                 $inc: { dislikes: -1 },
//                 $pull: { usersDisliked: req.body.userId },
//               }
//             );
//             res.status(201).json({ message: "vote enregistré." });
//           }
//           break;
//         case 1: //cas: req.body.like = 1
//           await Sauce.updateOne(
//             { _id: req.params.id },
//             {
//               // on recherche la sauce avec le _id présent dans la requête
//               $inc: { likes: 1 }, // incrémentaton de la valeur de likes par 1.
//               $push: { usersLiked: req.body.userId }, // on ajoute l'utilisateur dans le array usersLiked.
//             }
//           );
//           res.status(201).json({ message: "vote enregistré." });
//           break;
//         case -1: //cas: req.body.like = 1
//           await Sauce.updateOne(
//             { _id: req.params.id },
//             {
//               // on recherche la sauce avec le _id présent dans la requête
//               $inc: { dislikes: 1 }, // on décremente de 1 la valeur de dislikes.
//               $push: { usersDisliked: req.body.userId }, // on rajoute l'utilisateur à l'array usersDiliked.
//             }
//           );
//           res.status(201).json({ message: "vote enregistré." });
//           break;
//         default:
//           res.status(400).json({ message: "abd request" });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     const err = {
//       message: error.info,
//     };
//     res.status(error.statusCode).json(err);
//   }
// };