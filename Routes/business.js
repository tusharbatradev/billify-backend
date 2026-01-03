const express = require("express");
const businessController = require("../Controllers/business");

const businessRouter = express.Router();

businessRouter.post("/create", businessController.createBusiness);
businessRouter.post("/login", businessController.loginBusiness);

module.exports = businessRouter;
