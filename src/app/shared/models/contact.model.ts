/**
 * Represents a contact in the organization.
 *
 * @interface Contact
 */
export interface Contact {
  /**
   * The role of the contact within the organization.
   * @type {string}
   */
  role: string;

  /**
   * The name of the contact person (optional).
   * @type {string}
   */
  name?: string;

  /**
   * The email address of the contact person (optional).
   * @type {string}
   */
  email?: string;

  /**
   * The phone number of the contact person (optional).
   * @type {string}
   */
  phone?: string;

  /**
   * The image URL for the contact's profile picture (optional).
   * @type {string}
   */
  image?: string;
}
