const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema }   = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;   // __ post login page
        req.flash("error", "you must be logged in to create listing");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {       // post login page
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next();
};

module.exports. validateListing = (req, res, next) => {
 let {error} = listingSchema.validate(req.body)
     // console.log(error);
     if(error){
        let errormsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, errormsg)
     }else{
     next();
     }
};

module.exports.validateReview = (req, res, next) => {
 let {error} = reviewSchema.validate(req.body.listing)
     //console.log(result);
     if(error){
        let errormsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, errormsg)
     }else{
     next();
     }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let {reviewId , id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the Author of this Review")
        return res.redirect(`/listings/${id}`)
    }
    next();
};

