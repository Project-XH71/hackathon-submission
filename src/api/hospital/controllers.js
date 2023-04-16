const prisma = require("../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const _secure = require("../_secure");

module.exports.createHospital = async(req,res) => {
  try {
    const { name, latitude, longitude, address, pinCode, state, city } = req.body;
    const hospital = await prisma.hospital.create({
      data:{
        address,
        city,
        latitude,
        longitude,
        name,
        pinCode,
        state
      }
    })

    return res.send(hospital);
    
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
}


module.exports.addDoctorInHospital = async(req,res) => {
  try {
    const { doctorId, hospitalId, position } = req.body;

    const hospital = await prisma.doctor_hospital.create({
      data:{
        doctor:{
          connect:{
            id: doctorId
          }
        },
        hospital:{
          connect:{
            id: hospitalId
          }
        },
        position
      },
      include:{
        doctor: true,
        hospital: true
      }
    })

    return res.status(200).send(hospital)
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: error.message});
  }
}

module.exports.getDoctorsInHospital = async(req,res) => {
  try {
    const { hospitalId } = req.body;
    const doctors = await prisma.doctor_hospital.findMany({
      where:{
        hospitalId
      },
      include:{
        doctor: true,
        hospital: true
      }
    })

    return res.status(200).send(doctors)
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
}

module.exports.getHospitals = async(req,res) => {
  try {
    const hospitals = await prisma.hospital.findMany()

    return res.status(200).send(hospitals)
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
}

module.exports.getMedicalCasesInHospital = async(req,res) => {
  try {
    const { hospitalId } = req.body;
    const medicalCases = await prisma.medical_case.findMany({
      where:{
        medical_case_hospital:{
          every:{
            hospitalId: hospitalId
          }
        }
      },
      include:{
        diagnoses: true,
        patient: {
          include:{
            user:{
              include:{
                user_vpa: true
              }
            }
          }
        }

      }

    })
    return res.send(medicalCases)
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: error.message});
  }
}





