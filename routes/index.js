var express = require("express");
var router = express.Router();

router.post("/calculate", (req, res, next) => {
  let unitaryPrice = req.body.totalPrice / req.body.totalSize;
  let totalRoomPrice = 0;
  let totalPeople = 0;
  let roomInfo = req.body.rooms.map((ele) => {
    totalRoomPrice += unitaryPrice * ele.size;
    totalPeople += ele.peopleNumber;
    return {
      roomName: ele.name,
      price: unitaryPrice * ele.size,
      flatmateName: "",
      peopleNumber: ele.peopleNumber,
    };
  });

  let commonPrice = (req.body.totalPrice - totalRoomPrice) / totalPeople;

  for (let i = 0; i < roomInfo.length; i++) {
    roomInfo[i].price += commonPrice * roomInfo[i].peopleNumber;
  }

  req.body.flatmates.sort((a, b) => {
    if (a.people === b.people) {
      return a.budget < b.budget ? -1 : a.budget > b.budget ? 1 : 0;
    } else {
      return a.people < b.people ? -1 : 1;
    }
  });

  roomInfo.sort((a, b) => {
    if (a.peopleNumber === b.peopleNumber) {
      return a.price < b.price ? -1 : a.price > b.price ? 1 : 0;
    } else {
      return a.peopleNumber < b.peopleNumber ? -1 : 1;
    }
  });

  for (let i = 0; i < roomInfo.length && i < req.body.flatmates.length; i++) {
    roomInfo[i].flatmateName = req.body.flatmates[i].name;
  }

  res.json(roomInfo);
});

module.exports = router;
