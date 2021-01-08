const express = require('express'),
router = express.Router(),
mysqlConnection = require('../database'),
httpStatus = require('http-status-codes'),
errorHandler = require('../errorHandling'),
utils = require('../utils'),
queries = require('../queryStrings')

router.get('/', (req, res) => {
   res.json({message: "Illustrators API"})
})

router.get('/all', (req, res) => {
   mysqlConnection.query(queries.GET_ALL_DATA_ILLUSTRATORS, (err, rows, fields) => {
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

router.get('/:id', (req, res) => {
   const id = req.params.id
   mysqlConnection.query(queries.GET_BY_ID_ILLUSTRATOR, [id], (err, rows, fields) => {
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
   mysqlConnection.query(queries.GET_BY_NAME_ILLUSTRATOR, ['%'+name+'%'], (err, rows, fields) => {
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

router.get('/source/:source', (req, res) => {
   const source = req.params.source
   mysqlConnection.query(queries.GET_BY_SOURCE_ILLUSTRATOR, ['%'+source+'%'], (err, rows, fields) => {
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
   if(utils.allFieldExists(req.body, 2)){
      const { Name, Source, Content, Comments } = req.body
      mysqlConnection.query(queries.ADD_ILLUSTRATOR, [Name, Source, Content, Comments], (err, rows, fields) => {
         if(!err){
            res
            .status(httpStatus.StatusCodes.OK)
            .json({message: "Data Added Succesfully"})
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
   if(utils.allFieldExists(req.body, 2)){
      const { Name, Source, Content, Comments } = req.body
      const id = req.params.id
      mysqlConnection.query(queries.UPDATE_ILLUSTRATOR, [Name, Source, Content, Comments, id], (err, rows, fields) => {
         if(!err){
            res
            .status(httpStatus.StatusCodes.OK)
            .json({message: "Data Updated Succesfully"})
         }else{
            errorHandler.serverError(res)
            console.error(err);
         }
      })
   }else{
      errorHandler.unprocessableEntityError(res)
   }
})

router.delete('/delete/:id', (req, res) => {
   const id = req.params.id
   mysqlConnection.query(queries.DELETE_ILLUSTRATOR, [id], (err, rows, fields) => {
      if(!err){
         res
         .status(httpStatus.StatusCodes.OK)
         .json({message: "Data Deleted Succesfully"})
      }else{
         errorHandler.serverError(res)
         console.error(err);
      }
   })
})

module.exports = router