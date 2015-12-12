/**
 * Created by Gordan on 10.12.2015..
 */

function ValidationError(user, messages) {
    this.user = user;
    this.messages = messages;
    this.stack = (new Error()).stack;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.name = 'ValidationError';

module.exports = ValidationError;