const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let SceneModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const SceneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  level: {
    type: Number,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

SceneSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level,
  id: doc._id,
});

SceneSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return SceneModel.find(search).select('name age level _id').exec(callback);
};

// deletes a Scene from the database by using its id
SceneSchema.statics.deleteById = (SceneId, callback) => {
  SceneModel.deleteOne({ _id: convertId(SceneId) }).exec(callback);
};


SceneModel = mongoose.model('Scene', SceneSchema);

module.exports.SceneModel = SceneModel;
module.exports.SceneSchema = SceneSchema;
