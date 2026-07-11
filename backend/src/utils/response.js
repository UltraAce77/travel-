class Response {
   constructor(data, message = "Success", status = 200, type = "success") {
      (this.data = data), (this.message = message), (this.status = status), (this.type = type);
   }
}

module.exports = Response;
