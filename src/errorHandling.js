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

const unprocessableEntityError = (res) => {
   res
   .status(httpStatus.StatusCodes.UNPROCESSABLE_ENTITY)
   .json({message: "Fields are missing"})
}

module.exports = {
   notFoundError,
   serverError,
   unprocessableEntityError
};
