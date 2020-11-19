const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, default: ""},
  email: { type: String, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: "https://www.flaticon.es/svg/static/icons/svg/1077/1077114.svg" },
  userType: { type: String, enum: ["Flat Hunter", "Flat Owner "], default: "Flat Hunter" },
  gender: { type: String, enum: ["female", "male", "other"], default: "other" },
  hasPet: {type: Boolean, default: false},
  isSmoking: {type: Boolean, default: false},
  isStudying: {type: Boolean, default: false},
  isWorking: {type: Boolean, default: false},
  age: {type: Number, default: 18},
  maxBudget: {type: Number, default: 400},
  searchingFor: {
    Flatmates: {type: Number, default: 2},
    gender: {
      type: String,
      enum: ["female", "male", "indifferent"],
      default: "indifferent",
    },
    pets: { type: String, enum: ["I don`t want", "I don`t mind"], default: "I don`t mind"  },
    location: {type: String, default: "Barcelona"},
    minAge: {type: Number, default: 18},
    maxAge: {type: Number, default: 28},
  },
  favoriteFlats: [{ type: Schema.Types.ObjectId, ref: "Flat" }],
  favoriteFlatmates: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
