const Util = require('commonutils');
const logger = require('../logger');
const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!Util.verifyValidInputs([req.body.address, req.body.id])) {
      res.status(400).send({
        message: "Content invalid! "+JSON.stringify(req.body)
      });
      return;
    }
    User.findByPk(req.body.id)
    .then(data => {
      if (data) {
        res.send({message: "User already registered in database", data: data});
      } else {
        // Save User in the database
        User.create(req.body)
        .then(data => {
          logger.info(data)
          res.send(data);        
        })
        .catch(err => {
          logger.warn(err.message);
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });

    
  };


// Retrieve all Users from the database.
exports.findAll = (req, res) => {
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


// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
  };

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    User.update(req.body, {
      where: { id: id }
    })
      .then(num => {
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
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
  };

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    User.destroy({
      where: { id: id }
    })
      .then(num => {
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
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  };


// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

// Find all published Users
exports.findAllPublished = (req, res) => {
    User.findAll({ where: { published: true } })
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