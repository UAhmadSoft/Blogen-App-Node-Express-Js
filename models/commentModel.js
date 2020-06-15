const mongoose = require('mongoose');

const commmentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'A Comment must belong to a post !'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Comment must belong to a User !'],
    },
    body: {
      type: String,
      required: [true, 'A Comment must has a body'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

commmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-password -passwordConfirm',
  });

  next();
});

commmentSchema.methods.getFormattedDate = function () {
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
  return myDate;
};

const Comment = mongoose.model('Comment', commmentSchema);

module.exports = Comment;
