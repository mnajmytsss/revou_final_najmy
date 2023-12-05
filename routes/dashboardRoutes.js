const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
    res.send("Final Project Team3 Group G")
});

module.exports = router;