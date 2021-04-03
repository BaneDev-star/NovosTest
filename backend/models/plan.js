var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PlanSchema = new Schema({
  title: String,
  description: String,
  isCompleted: Boolean,
  userId: String,
  order: Number
});

var Plan = mongoose.model("Plan", PlanSchema);
module.exports = Plan;
