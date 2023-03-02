const Util = require('commonutils');
import logger from '../logger';
import db from "../models";
const User = db.user;
import Sequelize from 'sequelize';
const Op = Sequelize.Op;
import express from "express";

// Create and Save a new User
exports.create = (req:express.Request, res:express.Response) => {
    // Validate request
    if (!Util.verifyValidInputs([req.body.address, req.body.id])) {
      res.status(400).send({
        message: "Content invalid! "+JSON.stringify(req.body)
      });
      return;
    }
    User.findByPk(req.body.id)
    .then((data:any) => {
      if (data) {
        res.send({message: "User already registered in database", data: data});
      } else {
        // Save User in the database
        User.create(req.body)
        .then((data:any) => {
          logger.info(data)
          res.send(data);        
        })
        .catch((err: Error) => {
          logger.warn(err.message);
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });
      }
    })
    .catch((err: Error) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + req.body.id
      });
    });

    
  };


// Retrieve all Users from the database.
exports.findAll = (req:express.Request, res:express.Response) => {
  // if keyword was passed it mounts the condition (returns records where keyword found in address or description)
  const keyword = req.query.keyword;
  var condition = keyword ? {
    [Op.or]: [
      { address: { [Op.like]: `%${keyword}%` } },
      { description: { [Op.like]: `%${keyword}%` } }
    ]
  } : null;

  //make query
  User.findAll({ where: condition })
    .then((data: any) => {
      res.send(data);
    })
    .catch((err:any) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};


// Find a single User with an id
exports.findOne = (req:express.Request, res:express.Response) => {
    const id = req.params.id;
    User.findByPk(id)
      .then((data: any) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch((err:any) => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
  };

// Update a User by the id in the request
exports.update = (req:express.Request, res:express.Response) => {
    const id = req.params.id;
  
    User.update(req.body, {
      where: { id: id }
    })
      .then((num: number) => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch((err:any) => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
  };

// Delete a User with the specified id in the request
exports.delete = (req:express.Request, res:express.Response) => {
    const id = req.params.id;
  
    User.destroy({
      where: { id: id }
    })
      .then((num: number) => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch((err:any) => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  };


// Delete all Users from the database.
exports.deleteAll = (req:express.Request, res:express.Response) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then((num: number) => {
      res.send({ message: `${num} Users were deleted successfully!` });
    })
    .catch((err:any) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

// Find all published Users
exports.findAllPublished = (req:express.Request, res:express.Response) => {
    User.findAll({ where: { published: true } })
      .then((data: any) => {
        res.send(data);
      })
      .catch((err:any) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  };
