const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.uploadImage, ctrl.create);
router.put("/:id", ctrl.uploadImage, ctrl.update);
router.delete("/:id", ctrl.delete);

module.exports = router;
