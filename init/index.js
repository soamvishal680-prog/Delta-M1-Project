const mongoose =  require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";


main()
.then( () => {                     // copy to app.js test connection
    console.log("connect to db");
}).catch(err => {
    console.log(err);
});
 
async function main(){
    await mongoose.connect( mongo_url);
};


const initDB = async () => {         // database to delete all data then insert datafrom data.js
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj , owner:"6a9b892d61dfc1b0870af6c1"}))
    await Listing.insertMany(initdata.data);
    console.log("data was initlised");
}

initDB();