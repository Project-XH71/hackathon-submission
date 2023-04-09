const prisma = require("../../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const _secure = require("../../_secure");

const ageCalculator = (dob) => {
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// module.exports.createMedicalCaseByDoctor = async(req,res) => {
//     console.log("Ima at here")

//     const transaction = await prisma.$transaction();
//     try {
//         const {doctorId} = (await UserMetadata.getUserMetadata(req.session.getUserId())).metadata;
//         const { patientVpa } = req.body;

//         // -> Retrve Patient Metadata, Userdata and VPA Data
//         // -> Create Medical Case Data with Patient Metadata
//         // -> Encrypt Medical Case Data
//         // -> Store Medical Case Data in Medical Case Table
//         // -> Store Secret Key in Backend Escrow Table

 

//         const pvData = await prisma.user_vpa.findUnique({
//             where:{
//                 vpa: patientVpa
//             },
//             include:{
//                 user: {
//                     include:{
//                         user_metadata: true
//                     }
//                 }
//             }
//         }, transaction)

//         const medicalCaseData = {
//             dob: (pvData.user.user_metadata.dob),
//             weight: 0,
//             height: 0,
//             bmi: 0,
//             patientName: pvData.user.name,
//             patientVpa: pvData.vpa,
//             age: ageCalculator(pvData.user.user_metadata.dateOfBirth)
//         }

//         const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(medicalCaseData));


//         const visit = await prisma.visits.create({
//             data:{
//                 doctor_visits:{
//                     create:{
//                         doctor:{
//                             connect:{
//                                 id: doctorId
//                             }
//                         },
//                         patient:{
//                             connect:{
//                                 userId: pvData.userId
//                             }
//                         },
//                     }
//                 },
//                 medical_case:{
//                     create:{
//                         data: cipher,
//                     }
//                 },
//             },
//             include:{
//                 doctor_visits: true,
//                 medical_case: true
//             }
//         })
        
//         await prisma.backend_escrow.create({
//             data:{
//                 key: visit.medicalCaseId,
//                 secretKey: secretKey,
//                 secretVI: secretVI
//             }
//         }, transaction);

//         await transaction.commit()

//         return res.send({...visit, medical_case:{data: medicalCaseData}});


//     } catch (error) {
//         await transaction.rollback();
//         return res.status(200).send({message: error.message})
//     }
// }

module.exports.createMedicalCaseByDoctor = async (req, res) => {
    console.log("I'm at here");
    let medicalCaseData;
    try {
      const { doctorId } = (
        await UserMetadata.getUserMetadata(req.session.getUserId())
      ).metadata;
      const { patientVpa } = req.body;
  
      const visit = await prisma.$transaction(async (transaction) => {
        // -> Retrieve Patient Metadata, Userdata and VPA Data
        const pvData = await transaction.user_vpa.findUnique({
          where: {
            vpa: patientVpa,
          },
          include: {
            user: {
              include: {
                user_metadata: true,
              },
            },

          }
        });
  
        // -> Create Medical Case Data with Patient Metadata
        medicalCaseData = {
          dob: pvData.user.user_metadata.dob,
          weight: 0,
          height: 0,
          bmi: 0,
          patientName: pvData.user.name,
          patientVpa: pvData.vpa,
          age: ageCalculator(pvData.user.user_metadata.dateOfBirth),
        };
  
        // -> Encrypt Medical Case Data
        const { cipher, secretKey, secretVI } =
          _secure.encryption.encryptData(JSON.stringify(medicalCaseData));
  
        // -> Store Medical Case Data in Medical Case Table
        // -> Store Secret Key in Backend Escrow Table
        const visit = await transaction.visits.create({
          data: {
            doctor_visits: {
              create: {
                doctor: {
                  connect: {
                    id: doctorId,
                  },
                },
              },
            },
            medical_case: {
              create: {
                data: cipher,
                patient:{
                    connect:{
                        userId: pvData.userId,
                    }
                }
              },
            },
          },
          include: {
            doctor_visits: true,
            medical_case: true,
          }});
  
        await prisma.backend_escrow.create({
          data: {
            key: visit.medicalCaseId,
            secretKey: secretKey,
            secretVI: secretVI,
          }
        });
  
        return visit;
      });
  
      return res.send({ ...visit, medical_case: { data: medicalCaseData } });
    } catch (error) {
        console.log(error)
      return res.status(500).send({ message: error.message });
    }
 };

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

