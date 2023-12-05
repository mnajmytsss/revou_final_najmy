const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
    res.send("Group Project Team3 GorupJ")
});

module.exports = router;