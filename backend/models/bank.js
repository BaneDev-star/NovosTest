var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BankSchema = new Schema({
  title: String,
  description: String,
  userId: String,
  order: Number
});

var Bank = mongoose.model("Bank", BankSchema);
module.exports = Bank;
