import { red } from 'colors';

export function error(message: string): void {
  console.log(red(`Error: ${message}`));
  process.exit(1);
}
