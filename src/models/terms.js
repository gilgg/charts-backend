const mongoose = require("mongoose");

const termsSchema = mongoose.Schema({
  type: {
    type: Number,
    required: true,
  },
  terms: {
    type: Array,
    required: true,
    default: [],
  },
});

const Terms = mongoose.model("Terms", termsSchema, "TERMS");
module.exports = Terms;
