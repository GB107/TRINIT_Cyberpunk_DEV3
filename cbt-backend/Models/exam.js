const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testname: { type: String },
  testduration: { type: Number },
  instructions: { type: String, required: true },
  sections: [{
    name: { type: String },
    marks: { type: Number, },
    schema: { type: String, },
    questionType: { type: String, },
    questions: [{
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctOption: { type: String,},
    }]
  }],
  createdby: { type: String, required: true },
  ratings: { type: Number, required: true },
  difficulty: { type: String, required: true },
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
