const express = require('express'),
router = express.Router(),
mysqlConnection = require('../database'),
httpStatus = require('http-status-codes'),
errorHandler = require('../errorHandling'),
utils = require('../utils'),
queries = require('../queryStrings')

router.get('/', (req, res) => {
   res.json({ message: "Pixiv API!" })
})

router.get('/all', (req, res) => {
   mysqlConnection.query(queries.GET_ALL_DATA_PIXIV, (err, rows, fields) => {
      if (!err) {
         res
         .status(httpStatus.StatusCodes.OK)
         .json(rows)
      } else {
         errorHandler.serverError(res)
         console.error(err)
      }
   })
})

router.get('/last', (req, res) => {
   mysqlConnection.query(queries.GET_LAST_ENTRY_PIXIV, (err, rows, fields) => {
      if (!err) {
         res
         .status(httpStatus.StatusCodes.OK)
         .json(rows)
      } else {
         errorHandler.serverError(res)
         console.error(err);
      }
   })
})

router.get('/:idPixiv', (req, res) => {
   const idPixiv = req.params.idPixiv
   mysqlConnection.query(queries.GET_BY_ID_PIXIV, [idPixiv, idPixiv], (err, rows, fields) => {
      if (!err) {
         res
         .status(httpStatus.StatusCodes.OK)
         .json(rows)
      } else {
         errorHandler.serverError(res)
         console.error(err)
      }
   })
})

router.post('/add', (req, res) => {

   if(utils.allFieldExists(req.body, 1)){
      const { idPixiv, pixivName, Content, Quality, Favorite, Link } = req.body
      mysqlConnection.query(queries.ADD_NEW_ENTRY_PIXIV, [idPixiv, pixivName, Content, Quality, Favorite, Link], (err, rows, fields) => {
         if (!err) {
            res
            .status(httpStatus.StatusCodes.CREATED)
            .json({ message: "Data Added Successfully" })
         } else {
            if (err.code === 'ER_DUP_ENTRY') {
               res
               .status(httpStatus.StatusCodes.OK)
               .json({ message: "Duplicated register" })
               return
            }
            errorHandler.serverError(res)
            console.error(err)
         }
      })
   }else{
      errorHandler.unprocessableEntityError(res)
   }

})

router.put('/update/:id', (req, res) => {
   if(utils.allFieldExists(req.body,1)){
      const {idPixiv, pixivName, Content, Quality, Favorite, Link } = req.body
      const id = req.params.id
      mysqlConnection.query(queries.UPDATE_PIXIV,
      [idPixiv, pixivName, Content, Quality, Favorite, Link, id],
      (err, rows, fields) => {
         if(!err){
            res
            .status(httpStatus.StatusCodes.OK)
            .json({ message: "Data Updated Successfully" })
         }else{
            errorHandler.serverError(res)
         }
      })
   }else{
      errorHandler.unprocessableEntityError(res)
   }
})


module.exports = router;