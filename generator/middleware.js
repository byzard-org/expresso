module.exports = async (req, res, next) => {
  try {
    console.log("Went through [##MIDDLEWARE_NAME##]");
    return next();
  } catch (err) {
    return res.redirect("back");
  }
};
