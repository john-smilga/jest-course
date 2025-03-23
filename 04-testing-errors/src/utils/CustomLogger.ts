import chalk from 'chalk';
import { AppCodes } from './AppCodes';

export class CustomLogger {
  static info(
    caller: string,
    code: AppCodes,
    details?: Record<string, unknown>
  ) {
    console.log(
      chalk.blue(`[INFO] [${caller}] ${code}`),
      details ? chalk.cyan(JSON.stringify(details, null, 2)) : ''
    );
  }

  static error(
    caller: string,
    code: AppCodes,
    details?: Record<string, unknown>
  ) {
    console.log(
      chalk.red(`[ERROR] [${caller}] ${code}`),
      details ? chalk.redBright(JSON.stringify(details, null, 2)) : ''
    );
  }
}
