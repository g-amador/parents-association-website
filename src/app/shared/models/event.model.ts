/**
 * Represents an event in the organization.
 *
 * @interface Event
 */
export interface Event {
  /**
   * The title of the event.
   * @type {string}
   */
  title: string;

  /**
   * The date of the event in the format YYYY-MM-DD.
   * @type {string}
   */
  date: string;

  /**
   * A brief description of the event (optional).
   * @type {string}
   */
  description?: string;
}
