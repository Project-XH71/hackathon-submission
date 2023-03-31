const prisma = require("../primsaInit");
const Passwordless = require("supertokens-node/recipe/passwordless");
const Session = require("supertokens-node/recipe/session");
const Dashboard = require("supertokens-node/recipe/dashboard");
const EmailVerification = require("supertokens-node/recipe/emailverification");
const EmailPassword = require("supertokens-node/recipe/emailpassword");
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const UserRoles = require("supertokens-node/recipe/userroles");
const { sendSignInEmail } = require("../api/_email/sendEmail");


module.exports = {
    supertokens: {
        // this is the location of the SuperTokens core.
        // connectionURI: "https://try.supertokens.com",
        connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
        apiKey: process.env.SUPERTOKENS_CONNECTION_API_KEY,
        
        


    },
    appInfo: {
        appName: process.env.SUPERTOKENS_CONNECTION_APP_NAME,
        apiDomain: process.env.SUPERTOKENS_CONNECTION_API_DOMAIN,
        websiteDomain: process.env.SUPERTOKENS_CONNECTION_WEBSITE_DOMAIN,
        
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        Passwordless.init({
            contactMethod: "EMAIL_OR_PHONE",
            flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
            emailDelivery:{
                service:{
                    sendEmail: async (supertokenData) => {
                        const alpha = await sendSignInEmail(supertokenData.email, supertokenData.urlWithLinkCode)
                        console.log(supertokenData, alpha);
                        return true;
                    }
                }
            }
        }),
        Session.init(),
        Dashboard.init({
            apiKey: process.env.SUPERTOKENS_CONNECTION_API_KEY,
        }),
        EmailPassword.init({
            override: {
                apis: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        signUpPOST: async function (input) {
                            // console.log(input);
                            if (originalImplementation.signUpPOST === undefined) {
                                throw Error("Should never come here");
                            }
                            
                            // First we call the original implementation of signUpPOST.
                            let response = await originalImplementation.signUpPOST(input);
                            let user;
                            // Post sign up response, we check if it was successful
                            if (response.status === "OK") {
                                let { id, email } = response.user;
                                user = await prisma.user.create({
                                    data:{
                                        id,
                                        email,
                                        name: "Unknown"
                                    }
                                })
                                // // These are the input form fields values that the user used while signing up
                                
                                // console.log(formFields);
                                // TODO: post sign up logic
                            }
                            return {...response, user};
                        }
                    }
                }
            }
        }),

        UserMetadata.init(),
        UserRoles.init()
    ],
};
