const Util = require('commonutils');
const logger = require('../logger');
const db = require("../models");
const AuctionManager = db.auctionManager;
const Op = db.Sequelize.Op;

// Create and Save a new AuctionManager
exports.create = (req, res) => {
    // Validate request
    if (!Util.verifyValidInputs([req.body.address, req.body.tx, req.body.userId])) {
      res.status(400).send({
        message: "Content invalid! "+JSON.stringify(req.body)
      });
      return;
    }
  
    // Create a AuctionManager
    const auctionManager = {
      address: req.body.address,
      tx: req.body.tx,
      userId: req.body.userId
    };
  
    // Save AuctionManager in the database
    AuctionManager.create(auctionManager)
      .then(data => {
        logger.info(data)
        res.send(data);        
      })
      .catch(err => {
        logger.warn(err.message);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the AuctionManager."
        });
      });
  };

// Retrieve all AuctionManagers from the database.
exports.findAll = (req, res) => {
  
  //make query
  AuctionManager.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving auctionManagers."
      });
    });
};


// Find a single AuctionManager with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  AuctionManager.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find AuctionManager with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving AuctionManager with id=" + id
        });
      });
  };

// Update a AuctionManager by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    AuctionManager.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "AuctionManager was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update AuctionManager with id=${id}. Maybe AuctionManager was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating AuctionManager with id=" + id
        });
      });
  };

// Delete a AuctionManager with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    AuctionManager.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "AuctionManager was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete AuctionManager with id=${id}. Maybe AuctionManager was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete AuctionManager with id=" + id
        });
      });
  };

