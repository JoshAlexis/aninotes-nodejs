const httpStatus = require('http-status-codes')

const notFoundError = (req, res) => {
   res
   .status(httpStatus.StatusCodes.NOT_FOUND)
   .json({message: "Not Found!"})
}

const serverError = (res) => {
   res
   .status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
   .json({message: "Internal Server Error"})
}

module.exports = {
   notFoundError,
   serverError
};
