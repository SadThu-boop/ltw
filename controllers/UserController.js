const UserModel = require("../db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.getUsers = async (req, res) => {
  try {
    const Users = await UserModel.find();
    res.status(200).json(Users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUserData = req.body;
    const newUser = new UserModel(newUserData);
    newUser.password = await bcrypt.hash(newUser.password, 14);
    const savedUser = await newUser.save();

    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const User = await UserModel.findById(id);

    if (!User) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(User);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    const userId = user._id;
    const expiresIn = "1h";

    const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn }); // Tạo token
    console.log(token);
    console.log("hello");
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};
