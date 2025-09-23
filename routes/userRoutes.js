const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth(["admin"]), ctrl.getAll);
router.get("/:id", auth(["admin"]), ctrl.getAllById);
router.post("/", auth(["admin"]), ctrl.create);
router.put("/:id", auth(["admin"]), ctrl.update);
router.delete("/:id", auth(["admin"]), ctrl.delete);

module.exports = router;
