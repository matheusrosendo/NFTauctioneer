const Util = require('commonutils');
const logger = require('../logger');
const db = require("../models");
const MintedNFT = db.mintedNFT;
const Op = db.Sequelize.Op;

// Create and Save a new MintedNFT
exports.create = (req, res) => {
    // Validate request
    if (!Util.verifyValidInputs([req.body.NFTcollectionId, req.body.blockchainTokenId, req.body.tx  ])) {
      res.status(400).send({
        message: "Content can not be empty! "+JSON.stringify(req.body)
      });
      return;
    }
    
    // Save MintedNFT in the database
    MintedNFT.create(req.body)
      .then(data => {
        logger.info(data)
        res.send(data);        
      })
      .catch(err => {
        logger.warn(err.message);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the MintedNFT."
        });
      });
  };

// Retrieve all MintedNFTs or all specific from a collection.
exports.findAll = (req, res) => {
  const NFTcollectionId = req.params.NFTcollectionId;
  const condition = NFTcollectionId ? {
    NFTcollectionId: { [Op.eq]: `${NFTcollectionId}` } 
  } : null;

  MintedNFT.findAll({where: condition})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  };

// Find a single MintedNFT with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    MintedNFT.findByPk(id, {include: [{model: db.NFTcollection}]} )
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find MintedNFT with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving MintedNFT with id=" + id
        });
      });
  };

// Update a MintedNFT by the id in the request
exports.update = (req, res) => {
    // Validate id  
    const id = req.params.id;
    if(!id){
      res.status(400).send({
        message: "Id not informed! "
      });
      return;
    }

    // Validate request
    if (!Util.verifyValidInputs([req.body.NFTcollectionId, req.body.blockchainTokenId, req.body.tx  ])) {
      res.status(400).send({
        message: "Content can not be empty! "+JSON.stringify(req.body)
      });
      return;
    }

    //execute update
    MintedNFT.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "MintedNFT was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update MintedNFT with id=${id}. Maybe MintedNFT was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating MintedNFT with id=" + id
        });
      });
  };

// Delete a MintedNFT with the specified id in the request
exports.delete = (req, res) => {
    // Validate id  
    const id = req.params.id;
    if(!id){
      res.status(400).send({
        message: "Id not informed! "
      });
      return;
    }

    //delete record
    MintedNFT.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "MintedNFT was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete MintedNFT with id=${id}. Maybe MintedNFT was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete MintedNFT with id=" + id
        });
      });
  };
