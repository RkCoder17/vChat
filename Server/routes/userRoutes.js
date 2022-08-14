const {register, login, getAllUsers, setAvatar}    = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register",register);

router.post("/login",login);

router.post("/setAvatar/:id",setAvatar)

router.get("/getAllUsers/:id",getAllUsers)

// router.get("/logout/:id", logOut);
module.exports = router;