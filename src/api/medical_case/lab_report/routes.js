const express = require('express');
const router = express.Router();
const controller = require('./controllers.js');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const rbac = require("../../_auth/rbac.js");


// Route Status Check
router.get('/', verifySession() ,async(req,res) => {
    res.status(200).send("Lab-Case Route -> OK");
})

//-----------------Medical Case----------------//

// Assign Patient to User
router.post('/data/multiple', verifySession(), rbac(false), controller.getMultipleLabReports);

router.post('/data/create', verifySession(), rbac() ,controller.createLabReport);

router.patch('/data/update', verifySession(), rbac() ,controller.updateLabReport);

router.get('/data/:id', verifySession(), rbac(false), controller.getLabReport);

router.delete('/data', verifySession(), rbac(false) ,controller.deleteLabReport);




// router.get('/roles', verifySession(), rbac(false) ,controller.getMedicalCaseRoles);

module.exports = router;
