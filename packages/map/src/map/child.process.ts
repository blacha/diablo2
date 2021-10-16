import { spawn } from 'child_process';

export async function run(
  cmd: string,
  args: string[],
): Promise<{ cmd: string; args: string[]; exitCode: number; stdout: string; stderr: string; duration: number }> {
  const startTime = Date.now();

  const child = spawn(cmd, args);

  const stdout: string[] = [];
  const stderr: string[] = [];

  child.stdout.on('data', (chunk: string) => stdout.push(chunk));
  child.stderr.on('data', (chunk: string) => stderr.push(chunk));

  return new Promise((resolve) => {
    child.on('exit', (exitCode: number) => {
      resolve({
        cmd,
        args,
        exitCode,
        stdout: stdout.join('').trim(),
        stderr: stderr.join('').trim(),
        duration: Date.now() - startTime,
      });
    });
  });
}
