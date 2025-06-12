const getCurrentUser = (req, res) => {

  if (!req.user) {
    return res.status(401).json({ user: null });
  }

  res.status(200).json({ user: req.user });
};

module.exports = { getCurrentUser };