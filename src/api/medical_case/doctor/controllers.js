const prisma = require("../../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");

module.exports.createMedicalCaseByDoctor = async(req,res) => {
    try {
        const {doctorId} = (await UserMetadata.getUserMetadata(req.session.getUserId())).metadata;
        const { patientVpa } = req.body;

        const pvData = await prisma.user_vpa.findUnique({
            where:{
                vpa: patientVpa
            },
            select:{
                userId: true
            }
        })

        const visit = await prisma.visits.create({
            data:{
                doctor_visits:{
                    create:{
                        doctor:{
                            connect:{
                                id: doctorId
                            }
                        },
                        patient:{
                            connect:{
                                userId: pvData.userId
                            }
                        },
                    }
                },
                medical_case:{
                    create:{
                        data: "No Data"
                    }
                },
            },
            include:{
                doctor_visits: true,
                medical_case: true
            }
        })

        return res.send(visit);


    } catch (error) {
        return res.status(200).send()
    }
}

module.exports.getListOfUserMedicalVisits = async(req,res) => {
    try {
        const {doctorId} = (await UserMetadata.getUserMetadata(req.session.getUserId())).metadata;
        
        const visitData = await prisma.visits.findMany({
            where:{
                doctor_visits:{
                     every:{
                        doctorId: doctorId
                     }
                },   
            },
            select:{
                medical_case: true
            }
        })

        return res.status(200).send(visitData);


    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}

// module.exports.updateVisits = async(req,res) => {
//     try {
        
//     } catch (error) {
//         return res.status(500).send({error: error.message});
//     }
// }

module.exports.addDignosesbyDoctor = async(req,res) => {
    try {
        const { medicalCaseId, diagnoses, diagnoseAt  } = req.body;
        // const {doctorId} = (await UserMetadata.getUserMetadata(req.session.getUserId())).metadata;

        const diagnosis = await prisma.diagnoses.create({
            data:{
                medical_case:{
                    connect:{
                        id: medicalCaseId
                    }
                },
                diagnoses,
                diagnoseAt: diagnoseAt || new Date()
            }
        });

        return res.status(200).send(diagnosis);


    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}

module.exports.updateDignosesbyDoctor = async(req,res) => {
    try {
        const { medicalCaseId, diagnoses, diagnoseAt, diagnoseId  } = req.body;
        const {doctorId} = (await UserMetadata.getUserMetadata(req.session.getUserId())).metadata;

        const diagnosis = await prisma.diagnoses.update({
            where:{
                id: diagnoseId
            },
            data:{
                diagnoses,
                diagnoseAt: diagnoseAt || undefined        
            }
        });
        return res.status(200).send(diagnosis);


    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}

module.exports.deleteDignosesbyDoctor = async(req,res) => {
    try {
        const { medicalCaseId, diagnoseId  } = req.body;
        const {doctorId} = (await UserMetadata.getUserMetadata(req.session.getUserId())).metadata;

        const diagnosis = await prisma.diagnoses.delete({
            where:{
                id: diagnoseId
            }
        });
        return res.status(200).send(diagnosis);
    }
    catch (error) {
        return res.status(500).send({message: error.message});
    }
}

