const express = require("express");
const router = express.Router();
const User = require("../services/user-service");
const Posts = require("../services/post-service");
const Bookingservice = require("../services/booking-service");
const BookingDetails = require("../services/booking-details-service");

// GET REQUESTS

// get a list of posts from the db
router.get("/posts", async (req, res, next) => {
  const postMap = await Posts.findAll();

  let postData = [];
  for (var i = 0; i < postMap.length; i++) {
    postData.push({
      title: postMap[i].title,
      slug: postMap[i].slug,
      id: postMap[i].id,
      body: postMap[i].body,
      img: postMap[i].img,
      addedby: postMap[i].username,
      hidden: postMap[i].hidden,
      recommended: postMap[i].recommended,
      address: postMap[i].address.all,
      country: postMap[i].address.country,
      city: postMap[i].address.city,
      availablestart: postMap[i].start,
      availableend: postMap[i].end,
      addedBy: postMap[i].addedBy,
      guest: postMap[i].max_guest_num
    });
  }
  res.send(postData);
});

// Pots by ID - Map
router.get("/apartments/:id", async (req, res, next) => {
  await Posts.findById({ _id: req.params.id })

    // Remove the following use push method instead
    .then(data => {
      res.send(data);
    })
    .catch(next);
});

// Search ROUTE - Results find by Query Params
router.get("/search", (req, res, next) => {
  Posts.findPostsByParams(
    req.query.country,
    req.query.end_date,
    req.query.start_date,
    req.query.guest_num
  )
    .then(found => {
      console.log(req.query);
      res.send(found);
    })
    .catch(next);
});

// Get the post by country
router.get("/country/:id", async (req, res, next) => {
  var countryData = await Posts.findCountry(req.params.id);

  let countryList = [];
  for (var i = 0; i < countryData.length; i++) {
    countryList.push({
      title: countryData[i].title,
      slug: countryData[i].slug,
      id: countryData[i].id,
      body: countryData[i].body,
      img: countryData[i].img,
      addedby: countryData[i].username,
      hidden: countryData[i].hidden,
      recommended: countryData[i].recommended,
      address: countryData[i].address.all,
      country: countryData[i].address.country,
      city: countryData[i].address.city,
      availablestart: countryData[i].start,
      availableend: countryData[i].end
    });
  }
  res.send(countryList);
});

//Top Destinations, based on number of bookings
router.get("/topdestinations", async (req, res, next) => {
  const sortBooks = await Bookingservice.sortBooks();
  let sorted = sortBooks.map(item => {
    return item.propertyid;
  });

  // returns the top 3 listing, depending how many times it booked
  res.send(sorted);
});

// POST REQUESTS

// creating apartment listing
router.post("/addproperty", async (req, res, next) => {
  const newpost = await Posts.add(req.body);
  res.send(newpost);
});

// add availibility of the property. Runs after creating apartment listing
router.post("/addavailability", async (req, res, next) => {
  const newpost = await Bookingservice.add(req.body);
  res.send(newpost);
});

// Upload Endpoint
// router.post("/upload", (req, res) => {
//   if (req.files === null) {
//     return res.status(400).json({ msg: "No file uploaded" });
//   }

//   const file = req.files.file;

//   file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send(err);
//     }

//     res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
//   });
// });

//ROUTES FOR Bookingservice & BookingDetails

// Book the property with the user's defined dates
// After add it to booking service,Runs after Book the property  so on property page booked dates are not avaliable anymore

router.post("/book-this-property", function(req, res, next) {
  BookingDetails.add(req.body).then(data => {
    Bookingservice.findById({ propertyid: data.property })
      .then(found => {
        found.booked.push(req.body.date);
        const updated = found.save();
        res.send(updated);
      })
      .catch(next);
  });
});

module.exports = router;
