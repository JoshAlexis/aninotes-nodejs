const express = require('express'),
app = express(),
morgan = require('morgan'),
pixivApi = require('./routes/pixiv.routes'),
saucesApi = require('./routes/sauces.routes'),
illustratorsApi = require('./routes/illustrators.routes'),
errorHandler = require('./errorHandling'),
PORT = process.env.PORT || 3000

//Config
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
//Setting Routes
app.use("/api/pixiv", pixivApi)
app.use("/api/sauces", saucesApi)
app.use("/api/illustrators", illustratorsApi)
app.use(errorHandler.notFoundError)

app.get("/", (req, res) => {
   res.json({ message: "Hello world" })
})
app.listen(PORT, () => {
   console.log(`Server running on port: ${PORT}`);
})