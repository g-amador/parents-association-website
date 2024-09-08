import { Component, OnInit } from '@angular/core';

interface Article {
  title: string;
  content: string;
  date: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sidebarVisible = true;
  latestArticles: Article[] = [];
  currentIndex = 0;
  intervalId: any;

  ngOnInit() {
    this.loadLatestArticles();
    this.startCarouselRotation();
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }

  loadLatestArticles() {
    const articles = this.getArticlesFromLocalStorage();
    this.latestArticles = articles.slice(-3).reverse(); // Get the last 3 articles, in reverse order (latest first)
  }

  getArticlesFromLocalStorage(): Article[] {
    const articles = localStorage.getItem('articles');
    return articles ? JSON.parse(articles) : [];
  }

  startCarouselRotation() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.latestArticles.length;
    }, 5000); // Change every 5 seconds
  }

  stopCarouselRotation() {
    clearInterval(this.intervalId);
  }

  selectArticle(index: number) {
    this.stopCarouselRotation();
    this.currentIndex = index;
    this.startCarouselRotation();
  }

  prevArticle() {
    this.stopCarouselRotation();
    this.currentIndex = (this.currentIndex - 1 + this.latestArticles.length) % this.latestArticles.length;
    this.startCarouselRotation();
  }

  nextArticle() {
    this.stopCarouselRotation();
    this.currentIndex = (this.currentIndex + 1) % this.latestArticles.length;
    this.startCarouselRotation();
  }
}
