const prisma = require("../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const _secure = require("../_secure");
const { DateTime } = require('luxon');




// [POST] /appointment/create
module.exports.createAppointment = async (req, res) => {
    try {
        let userId = req.session.getUserId();
        const { doctorId, time, type, description, filter, long, lat, locationId } = req.body;

        if(filter === "remote-create"){
            const remoteCreateAppointment = await prisma.remote_appointment.create({
                data:{
                    lat,
                    long,
                    locationId,
                    appointment:{
                        create:{
                            status: "pending",
                            type: "remote-"+type,
                            description: description,
                            patient:{
                                connect:{
                                    userId: userId
                                }
                            },
                        }
                    }
                },
                include:{
                    patient:{
                        select:{
                            user:{
                                select:{
                                    name: true,
                                }
                            }
                        }
                    },
                    appointment: true 
                }
            })

            return res.status(200).send(remoteCreateAppointment)
        }

        const appointmentDateTime = DateTime.fromObject({
            year: time.year,
            month: time.month,
            day: time.day,
            hour: time.hour,
            minute: time.minute,
          }).toJSDate();

        const appointment = await prisma.appointment.create({
            data:{
                time: appointmentDateTime,
                doctor:{
                    connect:{
                        id: doctorId
                    }
                },
                patient:{
                    connect:{
                        userId: userId
                    }
                },
                status: "pending",
                type: type,
                description: description
            },
            include:{
                doctor:{
                    select:{
                        user:{
                            select:{
                                name: true,
                            }
                        }
                    }
                },
                patient:{
                    select:{
                        user:{
                            select:{
                                name: true,
                            }
                        }
                    }
                }
            }
        })


        return res.status(200).send(appointment)
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message})
    }
};


// [POST] /appointment/fetch
module.exports.fetchAppointments = async (req, res) => {
    try {
        const { filter, locationId } = req.body;
        let appointments
        if(filter === "get-my-appointments"){
            let userId = req.session.getUserId();
            appointments = await prisma.appointment.findMany({
                where:{
                    patient:{
                        userId: userId
                    }
                },
                include:{
                    doctor:{
                        select:{
                            user:{
                                select:{
                                    name: true,
                                }
                            }
                        }
                    },
                    patient:{
                        select:{
                            user:{
                                select:{
                                    name: true,
                                }
                            }
                        }
                    }
                }
            })
        }
        else if(filter === "get-doctor-appointments"){
            let userId = req.session.getUserId();
            
            console.log("get-doctor-appointments ",userId);
            const doctor = await prisma.doctor.findUnique({
                where:{
                    userId: userId
                },
                select:{
                    id: true
                }
            });

            console.log(doctor)
            appointments = await prisma.appointment.findMany({
                where:{
                    doctorId: doctor.id
                },
                include:{
                    doctor:{
                        select:{
                            user:{
                                select:{
                                    name: true,
                                }
                            }
                        }
                    },
                    patient:{
                        select:{
                            user:{
                                select:{
                                    name: true,
                                }
                            }
                        }
                    }
                }
            })
        }

        else if(filter === "get-remote-appoinments-location"){
            appointments = await prisma.remote_appointment.findMany({
                where:{
                    locationId: locationId,
                },
                include:{
                    appointment: true
                }
            })


        }

        else {
            const { appointmentId } = req.body;
            const appointment = await prisma.appointment.findUnique({
                where:{
                    id: appointmentId
                },
                include:{
                    doctor:{
                        include:{
                            user: true
                        }
                    },
                    patient:{
                        include:{
                            user: {
                                include: {
                                    user_vpa: true
                                }
                            }

                        }
                    }
                }
            });

            return res.status(200).send(appointment);
        }
        

        return res.status(200).send(appointments)



    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message})
    }
}

// [POST] /appointment/update
module.exports.updateAppointment = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await prisma.appointment.update({
            where:{
                id: appointmentId
            },
            data:{
                status: status
            }
        })

        return res.status(200).send(appointment)
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message})
    }
}

// [POST] /appointment/delete
module.exports.deleteAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointment = await prisma.appointment.delete({
            where:{
                id: appointmentId
            }
        })

        return res.status(200).send(appointment)
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message})
    }
}


// module.exports.remoteCreateAppointment = async (req, res) => {

// }