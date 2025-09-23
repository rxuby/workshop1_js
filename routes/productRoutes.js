const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", auth(["admin"]), ctrl.create);
router.put("/:id", auth(["admin"]), ctrl.update);
router.delete("/:id", auth(["admin"]), ctrl.delete);

module.exports = router;
