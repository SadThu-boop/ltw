const { now } = require("mongoose");
const PhotoModel = require("../db/photoModel.js");

module.exports.getPhotos = async (req, res) => {
  try {
    const Photos = await PhotoModel.find();
    res.status(200).json(Photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.createPhoto = async (req, res) => {
  try {
    const newPhotoData = req.body;

    const newPhoto = new PhotoModel(newPhotoData);
    const savedPhoto = await newPhoto.save();

    res.status(201).json(savedPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPhoto = await PhotoModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPhoto = await PhotoModel.findByIdAndRemove(id);

    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;

    const Photo = await PhotoModel.find({ user_id: id });
    if (!Photo) {
      res.status(404).json({ message: "Photo not found" });
    } else {
      res.status(200).json(Photo);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getCountPT = async (req, res) => {
  try {
    const { id } = req.params;
    const photoCount = await PhotoModel.countDocuments({ user_id: id });
    const photos = await PhotoModel.find({ user_id: id });
    const totalComments = photos.reduce((total, photo) => {
      if (photo.comments) {
        return total + photo.comments.length;
      } else {
        return total;
      }
    }, 0);
    res.status(200).json({ count: photoCount, totalComments: totalComments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports.UploadPhoto = async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ error: "No photo uploaded" });
    }

    const uploadedFile = req.files.photo[0];

    const newPhoto = new PhotoModel({
      file_name: uploadedFile.path,
      user_id: req.body.userId,
      date_time: Date.now(),
    });
    console.log(req.body);
    const savedPhoto = await newPhoto.save();
    return res.status(201).json({
      message: "Photo uploaded successfully",
      photo: savedPhoto,
      photo_id: savedPhoto._id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.writeCM = async (req, res) => {
  try {
    const { photoId, comment } = req.body;
    console.log(photoId);

    const Photo = await PhotoModel.findOne({ _id: photoId });
    const newComment = {
      comment: comment,
    };
    Photo?.comments?.push(newComment);
    const updatedPhoto = await Photo.save();
    res.status(200).json({ success: true, photo: updatedPhoto });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
