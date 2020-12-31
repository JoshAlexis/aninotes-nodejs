const express = require('express'),
router = express.Router(),
mysqlConnection = require('../database'),
httpStatus = require('http-status-codes'),
errorHandler = require('../errorHandling')

router.get('/', (req, res) => {
   res.json({ message: "Pixiv API!" })
})

router.get('/all', (req, res) => {
   mysqlConnection.query("SELECT * FROM pixiv", (err, rows, fields) => {
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
   mysqlConnection.query("SELECT * FROM pixiv ORDER BY Id DESC LIMIT 1", (err, rows, fields) => {
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
   mysqlConnection.query("SELECT * FROM pixiv WHERE idPixiv = ? OR WHERE Id = ?", [idPixiv], (err, rows, fields) => {
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
   const { idPixiv, pixivName, Content, Quality, Favorite, Link } = req.body
   const newItem = {
      idPixiv,
      pixivName,
      Content,
      Quality,
      Favorite,
      Link
   }
   mysqlConnection.query(`INSERT INTO pixiv 
   (idPixiv,pixivName,Content,Quality,Favorite,Link)
   VALUES (?,?,?,?,?,?)`, [newItem], (err, rows, fields) => {
      if (!err) {
         res
         .status(httpStatus.StatusCodes.OK)
         .json({ message: "Data Added Successfully" })
      } else {
         if (err.code === 'ER_DUP_ENTRY') {
            res
            .status(httpStatus.StatusCodes.OK)
            .json({ message: "Duplicated entry" })
            return
         }
         errorHandler.serverError(res)
         console.error(err)
      }
   })

})

router.put('/:idPixiv', (req, res) => {
   mysqlConnection.query(`UPDATE pixiv SET idPixiv = ?,
   pixivName = ?, Content = ?, Favorite = ?, Link = ? WHERE id`)
})


module.exports = router;