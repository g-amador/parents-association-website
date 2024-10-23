/**
 * Represents a user in the system.
 *
 * @interface User
 */
export interface User {
  /**
   * The user's email address.
   * @type {string}
   */
  email: string;

  /**
   * The user's password.
   * @type {string}
   */
  password: string;

  /**
   * The recovery password for the user.
   * @type {string}
   */
  recoveryPassword: string;
}
