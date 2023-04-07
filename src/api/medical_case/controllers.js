const prisma = require("../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");

// module.exports.createMedicalCaseByDoctor = async(req,res) => {
//     try {
//         const {doctorId} = (await UserMetadata.getUserMetadata(req.session.getUserId())).metadata;
//         const { patientVpa } = req.body;

//         const pvData = await prisma.user_vpa.findUnique({
//             where:{
//                 vpa: patientVpa
//             },
//             select:{
//                 userId: true
//             }
//         })

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
//                         data: "No Data"
//                     }
//                 },
//             },
//             include:{
//                 doctor_visits: true,
//                 medical_case: true
//             }
//         })

//         return res.send(visit);


//     } catch (error) {
//         return res.status(200).send()
//     }
// }




// module.exports.updateMedicalCase = async(req,res) => {
//     try {
//         const {doctorId} = (await UserMetadata.getUserMetadata(req.session.getUserId())).metadata;
//         const { patientVpa, data } = req.body;

//         const pvData = await prisma.user_vpa.findUnique({
//             where:{
//                 vpa: patientVpa
//             },
//             select:{ 
//                 userId: true
//             }
//         })

//         const visit = await prisma.visits.findMany({
//             where:{
//                 doctor_visits:{
//                      every:{
//                         doctorId: doctorId,
//                         patientId: pvData.userId
//                      }
//                 },   
//             },
//             select:{
//                 medical_case: true
//             }
//         })

//         const updatedMedicalCase = await prisma.medical_case.update({
//             where:{
//                 id: visit[0].medical_case.id
//             },
//             data:{
//                 data: data
//             }
//         })

//         return res.send(updatedMedicalCase);

//     } catch (error) {
//         return res.status(200).send()
//     }
// }



module.exports.createLabReport = async(req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}