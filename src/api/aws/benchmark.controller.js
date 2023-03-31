// const { promisify } = require('util');
// const exec = promisify(require('child_process').exec)

// const process = require("child_process");
// const cmd = process.spawn(command)

// const { exce } = require("node:child_process");
// const { spawn } = require('node:child_process')
const util = require('util');
const exec = util.promisify(require('child_process').exec);



module.exports.aws_compliance_audit_manager_control_tower = async(req,res) => {
    try {
        // const nameOutput = await exec('git config --global user.name')
        // const emailOutput = await exec('git config --global user.email')
        // const nameOutput = await exec('ls')
        // return { 
        //     name: nameOutput.stdout.trim(), 
        //     // email: emailOutput.stdout.trim()
        // }

        let output;
        // exce('ls ./', (error, stdout, stderr) => {
        //     if (error) {
        //         console.log(`error: ${error.message}`);
        //         return;
        //     }
        //     if (stderr) {
        //         console.log(`stderr: ${stderr}`);
        //         return;
        //     }
        //     output = stdout;
        // });
        const { stdout, stderr } = await exec('cd steampipe-mod-aws-compliance && steampipe check aws_compliance.benchmark.audit_manager_control_tower --output json');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

        // const command = spawn('ping', ["google.com"])
        // command.stdout.on('data', output => {
        //     // the output data is captured and printed in the callback
        //     console.log("Output: ", output.toString())
        // })
        
    } catch (error) {
        return res.status(500).send({message: error.message})
    }
}