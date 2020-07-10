// INSTRUCTIONS
/*
  Create a new resource model that uses the User
  as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  Your model must contain at least three attributes
  other than the associated user and the timestamps.

  Your model must have at least one helpful virtual
  or query function. For example, you could have a
  book's details output in an easy format: book.format()
*/

const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true 
  },
  content: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  websiteURL:{
    type: String,
    required:true
  },
  status: {
    type: String,
    enum: ['Hot', 'Warm'],
  }
}, {
  timestamps: true
});

// Query Helpers
DealSchema.query.hot = function () {
  return this.where({
    status: 'Hot'
  })
};

DealSchema.query.warm = function () {
  return this.where({
    status: 'Warm'
  })
};

module.exports = mongoose.model('Deal', DealSchema);