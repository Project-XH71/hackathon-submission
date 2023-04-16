const prisma = require("../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const _secure = require("../_secure");

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


const ageCalculator = (dob) => {
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}



module.exports.createMedicalCaseData = async (req, res) => {
    let medicalCaseData;
    try {
      const { patientVpa, doctorId, hospitalId } = req.body;
  
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
            patientName: pvData.user.name,
            patientVpa: pvData.vpa,
            vitalSignature:{
                dob: pvData.user.user_metadata.dob,
                weight: 0,
                height: 0,
                bmi: 0,
                age: ageCalculator(pvData.user.user_metadata.dateOfBirth),
            }
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
                },
                medical_case_hospital:{
                    create:{
                        hospital:{
                            connect:{
                                id: hospitalId
                            }
                        }
                    }
                }

              },
            },

          },
          include: {
            doctor_visits: true,
            medical_case: {
                include:{
                    medical_case_hospital: {
                        include:{
                            hospital: true
                        }
                    }
                }
            }
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
  
      return res.send({ ...visit, medical_case: { ...visit.medical_case, data: medicalCaseData } });
    } catch (error) {
        console.log(error)
      return res.status(500).send({ message: error.message });
    }
};

module.exports.updateMedicalCaseData = async(req,res) => {
    let updatedData;
    try {
        const { data, medicalCaseid, hospitalId } = req.body;
        // const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(data));

        const updatedDataX = await prisma.$transaction(async (transaction) => {
            // Get Old Medical Case Data
            const getMedicalCase = await transaction.medical_case.findUnique({
                where:{
                    id: medicalCaseid
                }
            });

            // Get Old Secret Key
            const getSecretKey = await transaction.backend_escrow.findUnique({
                where:{
                    key: getMedicalCase.id
                }
            });

            // Decrypt Old Medical Case Data
            const decryptData = _secure.decryption.decryptData(getMedicalCase.data, getSecretKey.secretKey, getSecretKey.secretVI);

            // Update Medical Case Data
            updatedData = {...JSON.parse(decryptData), ...data};

            // Encrypt New Medical Case Data
            const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(updatedData));

            // Update Medical Case Data
            const x = await transaction.medical_case.update({
                where:{
                    id: getMedicalCase.id
                },
                data:{
                    data: cipher,
                    // medical_case_hospital:{
                    //     upsert:{
                    //         create:{
                    //             hospital:{
                    //                 connect:{
                    //                     id: hospitalId
                    //                 }
                    //             }
                    //         },
                    //         update:{
                    //             hospitalId: hospitalId
                    //         },
                    //         where:{
                    //             medicalCaseId_hospitalId:{
                    //                 medicalCaseId: getMedicalCase.id,
                    //                 hospitalId: hospitalId
                    //             }
                    //         }
                    //     }
                    // }
                }
            });

            // Update Secret Key
            await transaction.backend_escrow.update({
                where:{
                    id: getSecretKey.id
                },
                data:{
                    secretKey: secretKey,
                    secretVI: secretVI
                }
            });

            return x;
        });

        return res.send({...updatedDataX, data: updatedData});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}

module.exports.getMedicalCaseData = async(req,res) => {
    try {
        const { medicalCaseId } = req.params;

        console.log("From apiL:", medicalCaseId);

        const secretKeyData = await prisma.backend_escrow.findUnique({
            where:{
                key: medicalCaseId
            }
        });

        

        const medicalCase = await prisma.medical_case.findUnique({
            where:{
                id: medicalCaseId
            }
        });
        

        const decryptData = _secure.decryption.decryptData(medicalCase.data, secretKeyData.secretKey, secretKeyData.secretVI);


        return res.send({ ...medicalCase,  data: JSON.parse(decryptData)});

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}

module.exports.deleteMedicalCase = async(req,res) => {
    try {
        const { medicalCaseId } = req.body;

        const deletedData = await prisma.$transaction(async (transaction) => {
         
            // Delete Medical Case
            const deleteMedicalCase = await transaction.medical_case.delete({
                where: {
                    id: medicalCaseId
                }
            });

            // Delete Secret Key
            await transaction.backend_escrow.delete({
                where: {
                    key: medicalCaseId
                }
            });

            return deleteMedicalCase;
        });

        return res.send({...deletedData, message:"Medical History Deleted"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}

module.exports.createLabReport = async(req,res) => {

    const transaction = await prisma.$transaction();
    try {
        const { medicalCaseid, labReportData } = req.body;


        // -> Get Medical Case Data Secret Keys
        // -> Get Medical Case Data
        // -> Get User Metadata (Contains Birthdate)
        // -> Decrypt Medical Case Data (Contains Weight and Height of the User)
        // -> Calculate BMI
        // -> Add these Data to the Lab Report Data
        // -> Append the Lab Report Data from Request Body
        // -> Encrypt the Lab Report Data
        // -> Save the Secret key to the Backend Escrow Table
        // -> Save the Lab Report Data to the Medical Case Table



        // -> Get Medical Case Data Secret Keys
        const medicalCaseSecretKey = await prisma.backend_escrow.findUnique({
            where:{
                key: medicalCaseid
            }
        },transaction);
         

        // -> Get Medical Case Data
        const getMedicalCase = await prisma.medical_case.findUnique({
            where:{
                id: medicalCaseid
            },
            include:{
                patient:{
                    include:{
                        user: {
                            include:{
                                user_metadata: true,
                                user_vpa: true
                            },
                        }
                    }
                }
            }
        },transaction);


        // -> Get User Metadata (Contains Birthdate)
        const { dateOfBirth } = getMedicalCase.patient.user.user_metadata;
        

        // -> Decrypt Medical Case Data (Contains Weight and Height of the User)
        const decryptMedicalCaseData = _secure.decryption.decryptData(JSON.stringify(getMedicalCase.data), medicalCaseSecretKey.secretKey, medicalCaseSecretKey.secretVI);


        const { weight, height } = decryptMedicalCaseData;

        const labReportDataFinal = { ...labReportData, bmi: weight / (height * height), dateOfBirth: dateOfBirth,age: ageCalculator(dateOfBirth) , patientName: getMedicalCase.patient.user.name, patientVpa: getMedicalCase.patient.user.user_vpa.vpa };

        const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(labReportDataFinal));

        const labReport = await prisma.lab_report.create({
            data:{
                data: cipher,
                medical_case:{
                    connect:{
                        id: getMedicalCase.id
                    }
                }
            }
        }, transaction)

        await prisma.backend_escrow.upsert({
            where:{
                key: labReport.id 
            },
            create:{
                key: labReport.id,
                secretKey: secretKey,
                secretVI: secretVI
            },
            update:{
                secretKey: secretKey,
                secretVI: secretVI
            }
        }, transaction)

        await transaction.commit();

        return res.send({message: "Lab Report Created", labReport: { ...labReport, data: labReportDataFinal }});


    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({message: error.message});
    }
}








