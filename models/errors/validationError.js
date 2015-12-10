/**
 * Created by Gordan on 10.12.2015..
 */

function ValidationError(messages) {
    this.messages = messages;
    this.stack = Error().stack;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.name = 'ValidationError';

module.exports = ValidationError;