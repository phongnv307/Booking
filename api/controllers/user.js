import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export const getAllUser = async (req, res) => {
  const page = req.body.page || 1;
  const limit = req.body.limit || 10;

  const options = {
    page: page,
    limit: limit,
  };

  try {
    const users = await User.paginate({}, options);
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json(err);
  }
}

export const searchUserByEmail = async (req, res) => {
  const page = req.body.page || 1;
  const limit = req.body.limit || 10;

  const options = {
      page: page,
      limit: limit,
  };

  const email = req.query.email;

  try {
      const productList = await User.paginate({ email: { $regex: `.*${email}.*`, $options: 'i' } }, options);

      res.status(200).json({ data: productList });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
}

