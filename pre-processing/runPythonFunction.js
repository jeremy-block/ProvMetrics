const { spawnSync } = require("child_process");
/**
 *Spawn a command on the terminal that will wait till it finishes execution to continue javascript runtime
 *
 * @param {string} command the command you wish to run
 * @param {string} scriptPath the path to the file or the first argument to be sent to StdIn on the terminal
 * @param {Array} args A Javascript array to be expanded and handed to the process
 * @param {boolean} debug Flag to switch on or off the debug statements.
 * @return {string} Whatever is returned on Standard Out.
 */
const spawnSyncProcess = (command, scriptPath, args, debug=false) => {
    const process = spawnSync(command, [scriptPath, ...args]);
    if(debug) console.log("process output", process.output[1].toString())
      
  if (process.error) {
    throw process.error;
  }

  if (process.status !== 0) {
    throw new Error(`Command '${command}' failed with status ${process.status}`);
  }
    return process.output[1].toString();
}


module.exports = { spawnSyncProcess };









// const { spawn } = require("child_process");
// async function runPythonScript(scriptPath, args) {
//     // Spawn a new Python process
//     const pythonProcess = spawn("python3.10", [scriptPath, ...args]);
    
//     // Listen for output from the Python process
//     pythonProcess.stdout.on("data", (data) => {
//         console.log(`Python script output: ${data}`);
//         return data.toString();
//     });
    
//     // Listen for any errors that occur during the execution
//     pythonProcess.stderr.on("data", (data) => {
//         console.error(`Error executing Python script: ${data}`);
//         return data.toString();
//     });
    
//     // Listen for the Python process to exit
//     pythonProcess.on("close", (code) => {
//         console.log(`Python script exited with code ${code}`);
//         return code;
//     });
// }

// const { promisify } = require("util");
// // Wrap the spawning process in a promise
// const SpawnProcess = (command, scriptPath, args) => {
//   return new Promise((resolve, reject) => {
//     const process = spawn(command, [scriptPath, ...args]);
//     let output = "";
//     let error = "";

//     // // Listen to the output of the process
//     process.stdout.on("data", (data) => {
//       output = data.toString();
//       // console.log("Process output:", output);
//       //     resolve(output)
//     });

//     // Listen to the error output of the process
//     process.stderr.on("data", (data) => {
//       error = data.toString();
//       // resolve(error)
//       // console.error("Process error:", error);
//     });

//     // Handle process exit event
//     process.on("close", (code) => {
//       if (code === 0) {
//         //   console.log("🚀 ~ file: runPythonFunction.js:90 ~ process.on ~ output:", output)
//         //   console.log("🚀 ~ file: runPythonFunction.js:90 ~ process.on ~ error:", error)
//         return resolve([output, error]);
//       } else {
//         return reject(new Error(`Process exited with code ${code}`));
//       }
//     });
//   });
// };
// spawnProcess = promisify(SpawnProcess);


