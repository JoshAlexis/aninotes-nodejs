const express = require('express'),
router = express.Router(),
mysqlConnection = require('../database'),
httpStatus = require('http-status-codes'),
errorHandler = require('../errorHandling'),
utils = require('../utils'),
queries = require('../queryStrings')

router.get('/', (req, res) => {
   res.json({message: 'Sauces API!'})
})

router.get('/all', (req, res) => {
   mysqlConnection.query(queries.GET_ALL_DATA_SAUCE, (err, rows, fields) => {
      if(!err){
         res
         .status(httpStatus.StatusCodes.OK)
         .json(rows)
      }else{
         errorHandler.serverError(res)
         console.error(err);
      }
   })
})

router.get('/:id', (req, res ) => {
   const id = req.params.id
   mysqlConnection.query(queries.GET_BY_ID_SAUCE, [id], (err, rows, fields) => {
      if(!err){
         res
         .status(httpStatus.StatusCodes.OK)
         .json(rows)
      }else{
         errorHandler.serverError(res)
         console.error(err);
      }
   })
})

router.get('/name/:name', (req, res) => {
   const name = req.params.name
   mysqlConnection.query(queries.GET_BY_NAME_SAUCE, ['%'+name+'%'], (err, rows, fields) => {
      if(!err){
         res
         .status(httpStatus.StatusCodes.OK)
         .json(rows)
      }else{
         errorHandler.serverError(res)
         console.error(err);
      }
   })
})

router.post('/add', (req, res) => {
   if(utils.allFieldExists(req.body, 3)){
      const {Name, Viewed, Description, Comments, Link} = req.body
      mysqlConnection.query(queries.ADD_NEW_SAUCE, [Name, Viewed, Description, Comments, Link], (err, rows, fields) => {
         if(!err){
            res
            .status(httpStatus.StatusCodes.CREATED)
            .json({message: 'Data Added Successfully'})
         }else{
            errorHandler.serverError(res)
            console.error(err);
         }
      })
   }else{
      errorHandler.unprocessableEntityError(res)
   }
})

router.put('/update/:id', (req, res) => {
   if(utils.allFieldExists(req.body, 3)){
      const {Name, Viewed, Description, Comments, Link} = req.body
      const id = req.params.id
      mysqlConnection.query(queries.UPDATE_SAUCE, [Name, Viewed, Description, Comments, Link, id], (err, rows, fields) => {
         if(!err){
            res
            .status(httpStatus.StatusCodes.OK)
            .json({message: "Data Update Successfully"})
         }else{
            errorHandler.serverError(res)
            console.error(err);
         }
      })
   }else{
      errorHandler.serverError(res)
      console.error(err);
   }
})

router.delete('/delete/:id', (req, res) => {
   const id = req.params.id
   mysqlConnection.query(queries.DELETE_SAUCE, [id], (err, rows, fields) => {
      if(!err){
         res
         .status(httpStatus.StatusCodes.OK)
         .json({message: "Data Deleted Successfully"})
      }else{
         errorHandler.serverError(res)
         console.error(err);
      }
   })
})

module.exports = router