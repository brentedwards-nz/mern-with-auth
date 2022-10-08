const testHandler = async (req, res) => {
  return res.status(200).json({
    testHandler: {
      success: true,
    },
  });
};

module.exports = testHandler;