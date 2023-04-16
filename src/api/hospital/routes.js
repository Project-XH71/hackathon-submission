const express = require('express');
const router = express.Router();
const controller = require('./controllers.js');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const rbac = require("../_auth/rbac.js");


// Route Status Check
router.get('/', verifySession() ,async(req,res) => {
    res.status(200).send("Doctor Medical Route -> OK");
})


//-----------------Self Goverment Service----------------//

router.get("/all",verifySession(), rbac(), controller.getHospitals);

router.post("/doctor",verifySession(), rbac(), controller.addDoctorInHospital);

router.get("/doctor",verifySession(), rbac(), controller.getDoctorsInHospital);

router.post("/create", verifySession(), rbac(), controller.createHospital)

//-----------------Self Hospital Service----------------//


router.get('/medical-case/get', verifySession(), rbac() ,controller.getMedicalCasesInHospital);







module.exports = router;
