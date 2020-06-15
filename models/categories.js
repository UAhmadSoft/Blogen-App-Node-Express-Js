const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A Category must have a title'],
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  summary: {
    type: String,
    required: [true, 'A Categories must has a summary'],
    minlength: [50, "A Category's Summary must NOT be less than 50 characters"],
  },
});

categoriesSchema.methods.getFormattedDate = function () {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let month = monthNames[this.date.getMonth()];
  let date = this.date.getDate();
  let year = this.date.getFullYear();

  let myDate = month + ' ' + date + ' ' + year;
  //   console.log(`my date is ${myDate}`);
  return myDate;
};

const catModel = mongoose.model('categories', categoriesSchema);

module.exports = catModel;
