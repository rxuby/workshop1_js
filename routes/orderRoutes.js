const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth(["user", "admin"]), ctrl.getAll);
router.get("/:id", auth(["user", "admin"]), ctrl.getById);
router.post("/", auth(["user", "admin"]), ctrl.create);

module.exports = router;
