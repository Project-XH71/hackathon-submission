const express = require('express');
const router = express.Router();
const controller = require('./controllers.js');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const rbac = require("../_auth/rbac.js");

router.use("/doctor", require("./doctor/routes.js"));
router.use("/lab_report", require("./lab_report/routes.js"));

// Route Status Check
router.get('/', verifySession() ,async(req,res) => {
    res.status(200).send("Medical-Case Route 2 -> OK");
})

//-----------------Medical Case----------------//

// Assign Patient to User
router.post('/data/create', verifySession() ,controller.createMedicalCaseData);

router.patch('/data/update', verifySession(),controller.updateMedicalCaseData);

router.get('/data/:medicalCaseId', verifySession(), controller.getMedicalCaseData);

router.delete('/data', verifySession(),controller.deleteMedicalCase);


router.get("/count", verifySession(), controller.geTotalNumberOfMedicalCases);

router.get("/user/count",verifySession(), controller.getTotalNumberOfUsers);


router.get("/search/vpa", verifySession(), controller.searchMedicalCaseByVPA);

// router.get('/roles', verifySession(), rbac(false) ,controller.getMedicalCaseRoles);

module.exports = router;
