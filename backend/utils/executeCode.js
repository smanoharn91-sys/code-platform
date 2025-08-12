const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const executeCode = async (code, language, input) => {
  const tempDir = path.join(__dirname, 'temp');
  await fs.mkdir(tempDir, { recursive: true });

  const fileMap = {
    c: { ext: '.c', compile: 'gcc -o program', run: './program' },
    cpp: { ext: '.cpp', compile: 'g++ -o program', run: './program' },
    java: { ext: '.java', compile: 'javac Main.java', run: 'java Main' },
    python: { ext: '.py', run: 'python3' }, // Ensure python3 is used
    javascript: { ext: '.js', run: 'node' },
  };

  const config = fileMap[language];
  if (!config) throw new Error(`Unsupported language: ${language}`);

  const fileName = `program${config.ext}`;
  const filePath = path.join(tempDir, fileName);

  try {
    // Write code to file
    await fs.writeFile(filePath, code);

    // Write input to file
    const inputPath = path.join(tempDir, 'input.txt');
    await fs.writeFile(inputPath, input);

    // Compile (if needed) and run
    let command = config.run;
    if (config.compile) {
      await new Promise((resolve, reject) => {
        exec(`${config.compile} ${fileName}`, { cwd: tempDir }, (err) => {
          if (err) reject(new Error(`Compilation error: ${err.message}`));
          else resolve();
        });
      });
      command = config.run;
    }

    // Execute the program with a timeout
    const output = await new Promise((resolve, reject) => {
      exec(
        `${command} ${fileName} < ${inputPath}`,
        { cwd: tempDir, timeout: 5000 }, // 5-second timeout
        (err, stdout, stderr) => {
          if (err || stderr) {
            reject(new Error(stderr || err.message));
          } else {
            resolve(stdout.trim());
          }
        }
      );
    });

    return output;
  } catch (error) {
    throw new Error(`Execution error: ${error.message}`);
  } finally {
    // Clean up files
    try {
      await fs.unlink(filePath);
      await fs.unlink(inputPath);
      if (config.compile) await fs.unlink(path.join(tempDir, 'program'));
    } catch (err) {
      console.error('Cleanup error:', err.message);
    }
  }
};

module.exports = { executeCode };