const express = require('express');
const router = express.Router();
const controller = require('./controllers.js');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const rbac = require("../_auth/rbac.js");

router.use("/doctor", require("./doctor/routes.js"));

// Route Status Check
router.get('/', verifySession() ,async(req,res) => {
    res.status(200).send("Medical-Case Route -> OK");
})

//-----------------Medical Case----------------//

// Assign Patient to User
// router.post('/create/doctor-visit', verifySession(), rbac() ,controller.);





module.exports = router;
