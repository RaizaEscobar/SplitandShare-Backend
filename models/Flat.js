const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const flatSchema = new Schema({
  title: {type: String, required: true, unique: true, default: "Flat Title"},
  description: {type: String, required: true, unique: true, default: "Flat Description"},
  flatImages : [{type: String, default: "https://image.freepik.com/foto-gratis/casa-aislada-campo_1303-23773.jpg"}],
  price: {type: Number, default: 0}, //
  contact: {type: String, default: "Contact details"},
  rooms: {type: Number, default: 0}, //
  restrooms: {type: Number, default: 0}, //
  neighborhood: {type: String, default: "Barcelona"},
  aircondition: {type: Boolean, default: false},
  elevator: {type: Boolean, default: false},
  balcony: {type: Boolean, default: false},
  parking: {type: Boolean, default: false},
  address: {type: String, default: "Street Number, District, PC..."},
  centralHeating: {type: Boolean, default: false},
  squareMeters: {type: Number, default: 0}, //
  furnished: {type: Boolean, default: false},
  terrace: {type: Boolean, default: false},
  swimmingPool: {type: Boolean, default: false},
  storeRoom: {type: Boolean, default: false},
  builtinWardrobes: {type: Boolean, default: false},
  flatOwner: Schema.Types.ObjectId
});

const Flat = mongoose.model("Flat", flatSchema);

module.exports = Flat;