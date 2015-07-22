var path = require('path'),
    util = require('util'),
    http = require('http');

function CustomError(status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, CustomError);

    if (status) this.status = status;
    this.message = message || http.STATUS_CODES[status] || 'Error';
}

util.inherits(CustomError, Error);
CustomError.prototype.name = "CustomError";
exports.CustomError = CustomError;