const { spawn } = require('child_process');

// This script will spawn a new process to run the npm start command inside the Chat directory.
const child = spawn('npm', ['run', 'start'], {
  stdio: 'inherit',
  cwd: './Chat',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});
