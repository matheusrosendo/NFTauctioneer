const Util = require('commonutils');
const logger = require('../logger');
const db = require("../models");
const Bid = db.bid;
const Op = db.Sequelize.Op;

// Create and Save a new Bid
exports.create = (req, res) => {
    // Validate request
    if (!Util.verifyValidInputs([req.body.auctionId, req.body.tx, req.body.userId, req.body.blockchainIndex])) {
      res.status(400).send({
        message: "Content can not be empty! "+JSON.stringify(req.body)
      });
      return;
    }
  
    // Save Bid in the database
    Bid.create(req.body)
      .then(data => {
        logger.info(data)
        res.send(data);        
      })
      .catch(err => {
        logger.warn(err.message);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Bid."
        });
      });
  };

// Retrieve all Bids from the database.
exports.findAll = (req, res) => {
    
    Bid.findAll()
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

// Find a single Bid with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Bid.findByPk(id, {include: [{model: db.auction, include: [{model: db.auctionManager}]}, {model: db.user }]})
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Bid with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Bid with id=" + id
        });
      });
  };

// Update a Bid by the id in the request
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
    if (!Util.verifyValidInputs([req.body.auctionId, req.body.tx, req.body.userId, req.body.blockchainIndex])) {
      res.status(400).send({
        message: "Content can not be empty! "+JSON.stringify(req.body)
      });
      return;
    }

    //execute update
    Bid.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Bid was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Bid with id=${id}. Maybe Bid was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Bid with id=" + id
        });
      });
  };

// Delete a Bid with the specified id in the request
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
    Bid.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Bid was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Bid with id=${id}. Maybe Bid was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Bid with id=" + id
        });
      });
  };
