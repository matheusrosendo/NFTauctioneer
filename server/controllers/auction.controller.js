const Util = require('commonutils');
const logger = require('../logger');
const db = require("../models");
const Auction = db.auction;
const Op = db.Sequelize.Op;

// Create and Save a new Auction
exports.create = (req, res) => {
    // Validate request
    if (!Util.verifyValidInputs([req.body.auctionManagerId, req.body.tx, req.body.mintedNFTId])) {
      res.status(400).send({
        message: "Content can not be empty! "+JSON.stringify(req.body)
      });
      return;
    }
  
    // Save Auction in the database
    Auction.create(req.body)
      .then(data => {
        logger.info(data)
        res.send(data);        
      })
      .catch(err => {
        logger.warn(err.message);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Auction."
        });
      });
  };

// Retrieve all Auctions from the database.
exports.findAll = (req, res) => {
    
    Auction.findAll({include: [{model: db.auctionManager}, {model: db.mintedNFT }]})
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

// Find a single Auction with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Auction.findByPk(id, {include: [{model: db.auctionManager, include: [{model: db.user}]}, {model: db.mintedNFT, include:[{model: db.NFTcollection}] }]})
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Auction with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Auction with id=" + id
        });
      });
  };

// Update a Auction by the id in the request
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
    if (!Util.verifyValidInputs([req.body.auctionManagerId, req.body.tx, req.body.mintedNFTId])) {
      res.status(400).send({
        message: "Content can not be empty! "+JSON.stringify(req.body)
      });
      return;
    }

    //execute update
    Auction.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Auction was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Auction with id=${id}. Maybe Auction was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Auction with id=" + id
        });
      });
  };

// Delete a Auction with the specified id in the request
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
    Auction.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Auction was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Auction with id=${id}. Maybe Auction was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Auction with id=" + id
        });
      });
  };
