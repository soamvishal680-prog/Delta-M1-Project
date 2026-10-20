const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");   // add listing model
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage: storage });

const listingController = require("../controllers/listings.js");
router
.route("/")            
.get(   wrapAsync (listingController.index) )  //  index route  
.post(  validateListing, isLoggedIn,  upload.single("listing[image]"), wrapAsync (listingController.createListing) );   // create route


router.get("/new", isLoggedIn, listingController.renderNewForm);       // New route

router.route("/:id")
.get( wrapAsync(listingController.showListing))    // show route
.put(                                             // update route
     isLoggedIn, 
    upload.single("listing[image]"),
    isOwner,validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));   // delete route
 
 router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));  // Edit route

 
 
module.exports = router;