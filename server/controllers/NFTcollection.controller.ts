const Util = require('commonutils');
import logger from '../logger';
import db from "../models";
const NFTcollection = db.NFTcollection;
import Sequelize from 'sequelize';
const Op = Sequelize.Op;
import express from "express";


// Create and Save a new NFTcollection
exports.create = (req:express.Request, res:express.Response) => {
    // Validate request
    if (!Util.verifyValidInputs([req.body.address, req.body.userId,req.body.tx  ])) {
      res.status(400).send({
        message: "Content can not be empty! "+JSON.stringify(req.body)
      });
      return;
    }
  
    // Create a NFTcollection
    const newRecord = {
      address: req.body.address,
      tx: req.body.tx,
      userId: req.body.userId
    };
  
    // Save NFTcollection in the database
    NFTcollection.create(newRecord)
      .then((data: any) => {
        logger.info(data)
        res.send(data);        
      })
      .catch((err: Error) => {
        logger.warn(err.message);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the NFTcollection."
        });
      });
  };

// Retrieve all NFTcollections from the database.
exports.findAll = (req:express.Request, res:express.Response) => {
    
    NFTcollection.findAll()
      .then((data: any) => {
        res.send(data);
      })
      .catch((err: Error) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  }; 

// Find a single NFTcollection with an id
exports.findOne = (req:express.Request, res:express.Response) => {
    const id = req.params.id;
    NFTcollection.findByPk(id , {include: [{model: db.user}]} )
      .then((data: any) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find NFTcollection with id=${id}.`
          });
        }
      })
      .catch((err: Error) => {
        res.status(500).send({
          message: "Error retrieving NFTcollection with id=" + id
        });
      });
  };

// Update a NFTcollection by the id in the request
exports.update = (req:express.Request, res:express.Response) => {
    // Validate id  
    const id = req.params.id;
    if(!id){
      res.status(400).send({
        message: "Id not informed! "
      });
      return;
    }

    // Validate request
    if (!Util.verifyValidInputs([req.body.address, req.body.userId,req.body.tx  ])) {
      res.status(400).send({
        message: "Content can not be empty! "+JSON.stringify(req.body)
      });
      return;
    }

    //execute update
    NFTcollection.update(req.body, {
      where: { id: id }
    })
      .then((num: number) => {
        if (num == 1) {
          res.send({
            message: "NFTcollection was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update NFTcollection with id=${id}. Maybe NFTcollection was not found or req.body is empty!`
          });
        }
      })
      .catch((err: Error) => {
        res.status(500).send({
          message: "Error updating NFTcollection with id=" + id
        });
      });
  };

// Delete a NFTcollection with the specified id in the request
exports.delete = (req:express.Request, res:express.Response) => {
    // Validate id  
    const id = req.params.id;
    if(!id){
      res.status(400).send({
        message: "Id not informed! "
      });
      return;
    }

    //delete record
    NFTcollection.destroy({
      where: { id: id }
    })
      .then((num: number) => {
        if (num == 1) {
          res.send({
            message: "NFTcollection was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete NFTcollection with id=${id}. Maybe NFTcollection was not found!`
          });
        }
      })
      .catch((err: Error) => {
        res.status(500).send({
          message: "Could not delete NFTcollection with id=" + id
        });
      });
  };

  export {}