let axios = require("axios").default;
const mongoose = require("mongoose");
const Flat = require("../models/Flat");

mongoose
  .connect("mongodb://localhost:27017/backend-server", {
    useUnifiedTopology: true,
    keepAlive: true,
    useNewUrlParser: true,
  })
  .then(() => console.log(`Connected to database`))
  .catch((err) => console.error(err));

let authOptions = {
  method: 'POST',
  url: 'https://api.idealista.com/oauth/token',
  params: {
    'grant_type': 'client_credentials'
  },
  headers: {
    'Authorization': 'Basic YXN1bHdrZ3hrMnIzcHFjODI2MXJodWN1bjh1dnZ1bGw6azRKQTJpejJwblNj',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
};


axios.request(authOptions).then(response => {
    const access_token = response.data.access_token;
    let searchOptions = {
        method: 'POST',
        url: 'https://api.idealista.com/3.5/es/search',
        params: {
            'operation': 'rent',
            'propertyType': 'homes',
            'center': '41.389469,2.1655539',
            'distance': 15000,
            'maxItems': 50,
            'numPage': 1
        },
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    }    
    for (let i = 1; i <= 40; i++)
    {
        searchOptions.params.numPage = i;
        axios.request(searchOptions).then(response => {
            response.data.elementList.forEach(element => {
                Flat.create({
                    title: element.suggestedTexts.title,
                    description: element.suggestedTexts.subtittle,
                    price: element.price,
                    rooms: element.rooms,
                    restrooms: element.bathrooms,
                    neighborhood: element.district,
                    elevator: element.hasLift,
                    balcony: element.exterior,
                    address: element.address,
                    squareMeters: element.size,
                    flatImages: [element.thumbnail]
                  }).then(ele=>{
                    console.log(`la llamada numero ${i} ha terminado correctamente`)
                  }).catch(error=>{
                      console.log(error)
                  })
            });
        })
        .catch(error => {
            console.error(error);
        })
    }

}).catch(error => {
	console.error(error);
});