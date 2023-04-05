const prisma = require("../../primsaInit.js");
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

module.exports.

module.exports.updateVisits = async(req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}


