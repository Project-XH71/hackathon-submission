const express = require('express');
const router = express.Router();
const controller = require('./benchmark.controller');


router.get('/', (req,res) => {
    return res.status(200).send({message: "AWS Benchmark API"})
});

router.get('/amct', controller.aws_compliance_audit_manager_control_tower);



module.exports = router;