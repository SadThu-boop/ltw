const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dgazaedgw",
  api_key: "732764653997657",
  api_secret: "6Hluf1o7N1jANUBeeRmnN09Ri-8",
});

module.exports = cloudinary;
