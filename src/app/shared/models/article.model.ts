/**
 * Represents an article with a title, content, and date.
 *
 * @interface Article
 */
export interface Article {
  /**
   * The document ID of the article (optional).
   * @type {string}
   */
  id?: string;

  /**
   * The title of the article.
   * @type {string}
   */
  title: string;

  /**
   * The content of the article.
   * @type {string}
   */
  content: string;

  /**
   * The date of the article in the format YYYY-MM-DD.
   * @type {string}
   */
  date: string;
}

/**
 * Represents articles organized by day.
 *
 * @interface DayArticles
 */
export interface DayArticles {
  /**
   * A mapping of dates to an array of articles.
   * @type {Article[]}
   */
  [key: string]: Article[];
}

/**
 * Represents articles organized by month.
 *
 * @interface MonthArticles
 */
export interface MonthArticles {
  /**
   * A mapping of month strings to DayArticles.
   * @type {DayArticles}
   */
  [key: string]: DayArticles;
}

/**
 * Represents articles organized by year.
 *
 * @interface YearArticles
 */
export interface YearArticles {
  /**
   * A mapping of year strings to MonthArticles.
   * @type {MonthArticles}
   */
  [key: string]: MonthArticles;
}
