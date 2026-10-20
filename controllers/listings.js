const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const  mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {        // index route
     const allListings = await Listing.find({});
     res.render("listings/index.ejs", {allListings});
         
};

module.exports.renderNewForm = (req, res) => {   // New route
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {        // show route
    let {id} = req.params;
const listing = await Listing.findById(id).populate({
    path:"reviews",
    populate: {
    path: "author",
    },

})
.populate("owner");
    if(!listing){
        req.flash("error", "listing you requsted does not exist");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
   let response =await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()
 
   

    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry =response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);

        await newListing.save();
        req.flash("success", "Successfully added new listing");
    res.redirect("/listings")
};

module.exports.renderEditForm = async (req, res) => {   // Edit route
    let {id} = req.params;
    const listing = await Listing.findById(id);
       if(!listing){
        req.flash("error", "listing you requsted does not exist");
       return res.redirect("/listings");
    }
     req.flash("success", "Successfully Edit listing");
     let originalImageurl = listing.image.url;             //url ma change
     originalImageurl = originalImageurl.replace("/upload", "/upload/,w_250");
    res.render("listings/edit.ejs", { listing, originalImageurl });
};


module.exports.updateListing = async (req, res) => {    //update route
     let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(req.file){
      let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "Successfully updated listing");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async(req, res) => {       // Delete route
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Successfully deleted listing");
    res.redirect("/listings");
};