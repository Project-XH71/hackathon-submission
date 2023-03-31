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
    const { role, details } = req.body;
    let response = await UserRoles.getUsersThatHaveRole(role);

    // if(details){
    //     for(let index = 0; index < response.users.length; index++){
    //         response.users[index] = await prisma.user.findUnique({
    //             where:{
    //                 id: response.users[index]
    //             }
    //         })
    //     }
    // }
    return res.status(200).send(response);
}