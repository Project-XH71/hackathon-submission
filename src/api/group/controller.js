const UserRoles = require("supertokens-node/recipe/userroles");
const prisma = require("../../primsaInit.js");


module.exports.createRole = async(req,res) => {

    const { roles } = req.body;
    let response = [];
    for(let index = 0; index < roles.length; index++){
        response.push(await UserRoles.createNewRoleOrAddPermissions(roles[index].role, roles[index].permissions));      
    }


    return res.status(200).send(response);
    // const response = await UserRoles.createNewRoleOrAddPermissions("student", ["get-attendance","post-attendance"]);

}


module.exports.assignRole = async(req,res) => {
    const { userId, role, assignRoles } = req.body;
    if(assignRoles && assignRoles.length > 0){
        let response = [];
        for(let index = 0; index < assignRoles.length; index++){
            response.push(await UserRoles.addRoleToUser(userId, assignRoles[index]));
        }
        return res.status(200).send(response);
    }
    else{
        const response = await UserRoles.addRoleToUser(userId, role);
        return res.status(200).send(response);
    }
    
}


module.exports.getAllRoles = async(req,res) => {
    const response = await UserRoles.getAllRoles();
    return res.status(200).send(response);
}


module.exports.getAllUsersThatHaveRole = async(req,res) => {
    const { role } = req.body;
    const response = await UserRoles.getUsersThatHaveRole(role);
    return res.status(200).send(response);
}


module.exports.listUsersInGroup = async(req,res) => {
    const { groupId } = req.body;
    const response = await prisma.usersGroup.findMany({
        where:{
            groups:{
                id: groupId
            }
        },
        include:{
            users: true
        }
    })

    return res.status(200).send(response);
}

module.exports.addUsersToGroup = async(req,res) => {
    const userId = req.session.getUserId();
    const { groupId, user } = req.body;

    const checkIfUserAllowedToEdit = await prisma.groupEditAccess.findFirst({
        where:{
            groups:{
                id: groupId
            },AND:{
                users:{
                    id: userId
                }
            }
        }
    })

    if(!checkIfUserAllowedToEdit) return res.status(403).send("You are not allowed to edit this group");

    const response = await prisma.usersGroup.create({
        data:{
            groups:{
                connect:{
                    id: groupId
                }
            },
            users:{
                connect:{
                    sub: user.sub
                }
            }
        }
    })

    return res.status(200).send(response);

}

module.exports.deleteUsersFromGroup = async(req,res) => {
    const userId = req.session.getUserId();
    const { groupId, userGroupId } = req.body;

    const checkIfUserAllowedToEdit = await prisma.groupEditAccess.findFirst({
        where:{
            groups:{
                id: groupId
            },AND:{
                users:{
                    id: userId
                }
            }
        }
    })

    if(!checkIfUserAllowedToEdit) return res.status(403).send("You are not allowed to edit this group");

    const response = await prisma.usersGroup.delete({
        where:{
            id: userGroupId
            // usersId_groupsId:{
            //     usersId: user.sub,
            //     groupsId: groupId
            // }
        }
    })

    return res.status(200).send(response);

}