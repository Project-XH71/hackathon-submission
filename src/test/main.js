const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

module.exports.getGitUser = async function getGitUser () {
  // Exec output contains both stderr and stdout outputs
  const nameOutput = await exec('git config --global user.name')
  const emailOutput = await exec('git config --global user.email')

  return { 
    name: nameOutput.stdout.trim(), 
    email: emailOutput.stdout.trim()
  }
};