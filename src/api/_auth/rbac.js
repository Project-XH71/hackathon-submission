const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const UserRoles = require("supertokens-node/recipe/userroles");
const { Error: STError } = require("supertokens-node/recipe/session");
const permission = require("./permission.json");
const _ = require('lodash');

const apiReducer = async (urlArray, userScopes, reqMethod) => {
    try {
        let obj = {}, allowedScopes = [];
        obj = {...permission};
        let index=0

        for(let i=0; i<urlArray.length; i++){
            if(urlArray[i].length === 0) continue;
            if (obj.hasOwnProperty(`/${urlArray[i]}`)) {
                obj = {...obj[`/${urlArray[i]}`]};
                allowedScopes = obj.scopes[reqMethod];
            }
            else {
                if(!_.isEmpty(obj) && obj.hasOwnProperty(`/${urlArray[i]}`)){
                    obj = {...obj[`/${urlArray[i]}`]};
                    allowedScopes = obj.scopes[reqMethod];
                }
                if(!_.isEmpty(obj) && obj.hasOwnProperty(`/*`)){
                    obj = {...obj[`/*`]};
                    allowedScopes = obj.scopes[reqMethod];
                }
            }
        }
        // console.log(allowedScopes, userScopes)
        return {status: await allowedScopes.some(r=> userScopes.includes(r)), allowedScopes, userScopes};
    } catch (error) {
        console.log(error);
        throw new Error("Cannot Authorize!");
    }
}

const auth2 = (strict=true) => async(req,res,next) => {
    try {
        if(!req.session) throw new Error("Not Authorized");
        const userScopes = await req.session.getClaimValue(UserRoles.UserRoleClaim);
        const urlArray = req.originalUrl.split("/");
        const access = await apiReducer(urlArray,userScopes, req.method);
        // console.log(access);
        if ((userScopes === undefined || !access.status) && strict) {
            // this error tells SuperTokens to return a 403 to the frontend.
            
            throw new STError({
                type: "INVALID_CLAIMS",
                message: `User is not an [${access.allowedScopes}]`,
                payload: [{
                    id: UserRoles.UserRoleClaim.key
                }]
            })
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(403).send(error.message);
    }
}

module.exports = auth2;