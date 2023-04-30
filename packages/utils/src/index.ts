import { v4 } from "uuid";

/**
 * Generates a RFC4122 compliant UUIDv4.
 *
 * @example:
 * const result = generateUUIDv4()
 * // result: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
 */
export const generateUUIDv4 = v4;

/**
 * Simple logger function which prepends current time to string and logs it in
 * console. Always use this instead of console.log.
 *
 **/
export const Logger = {
  log: (...logMessages: any[]) => {
    console.log(new Date().toISOString(), ...logMessages);
  },
  /**
   * Returns a logger that always prints out the data using the format:
   * 'currentDateIsoString prefixValue - logMessages'
   * for example:
   * '2022-09-28T12:30:58.109Z ANALYTICS - Initialized analytics'
   */
  makePrefixedLogger: (prefix: string) => {
    return {
      log: (...logMessages: any[]) => {
        console.log(new Date().toISOString(), `${prefix} -`, ...logMessages);
      },
    };
  },
};

/** Sleeps for a given amount of time.
 * @param ms sleep duration in milliseconds */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((r) => setTimeout(r, ms));
}

