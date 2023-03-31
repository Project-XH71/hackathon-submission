const AWS = require('aws-sdk');

const SES_CONFIG = {
    accessKeyId: 'AKIASUATZHOXSJNRJK3G',
    secretAccessKey: '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',
    region: 'ap-south-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

module.exports.sendSignInEmail = async (email, link) => {
    let params = {
        Source: 'educacy.io@gmail.com',
        Destination: {
            ToAddresses: [
                email
            ],
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `Click here to sign in: ${link}`,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Sign in to your account',
            }
        },
    };

    return AWS_SES.sendEmail(params).promise();
}

// let sendEmail = (recipientEmail, name) => {
//     let params = {
//       Source: '<email address you verified>',
//       Destination: {
//         ToAddresses: [
//           recipientEmail
//         ],
//       },
//       ReplyToAddresses: [],
//       Message: {
//         Body: {
//           Html: {
//             Charset: 'UTF-8',
//             Data: 'This is the body of my email!',
//           },
//         },
//         Subject: {
//           Charset: 'UTF-8',
//           Data: `Hello, ${name}!`,
//         }
//       },
//     };
//     return AWS_SES.sendEmail(params).promise();
// };

// let sendTemplateEmail = (recipientEmail) => {
//     let params = {
//       Source: '<email address you verified>',
//       Template: '<name of your template>',
//       Destination: {
//         ToAddresse': [ 
//           recipientEmail
//         ]
//       },
//       TemplateData: '{ \"name\':\'John Doe\'}'
//     };
//     return AWS_SES.sendTemplatedEmail(params).promise();
// };

// module.exports = {
//   sendEmail,
//   sendTemplateEmail,
// };