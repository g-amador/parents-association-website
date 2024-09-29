import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'parents_association_website';

  ngOnInit() {
    // Log the environment configuration

    // Check if Firebase config exists
    if (!environment.firebaseConfig) {
      console.error('Firebase Config not found in the environment file.');
    }
  }
}
