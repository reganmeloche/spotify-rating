export function NotFound(message) {
  this.message = message || 'Not found!';
  this.stack = (new Error()).stack;
}
NotFound.prototype = Object.create(Error.prototype);

export function ValidationError(message) {
  this.message = message || 'Invalid input!';
  this.stack = (new Error()).stack;
}
ValidationError.prototype = Object.create(Error.prototype);
