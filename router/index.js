const userRouter = require("./tasksRouter");

const router = {
  run: function (req, res) {
    userRouter.run(req, res);
  }
};
module.exports = router;