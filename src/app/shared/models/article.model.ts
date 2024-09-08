export interface Article {
  title: string;
  content: string;
  date: string;
}

export interface DayArticles {
  [key: string]: Article[];
}

export interface MonthArticles {
  [key: string]: DayArticles;
}

export interface YearArticles {
  [key: string]: MonthArticles;
}
