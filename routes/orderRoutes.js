const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);

module.exports = router;
