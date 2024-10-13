# Parents Association Website

This is a template project for a Parents Home Association.  
- **In development:** uses local storage.  
- **In production:** uses Firestore.

The project is built with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.5.

## Getting Started

### FrontEnd quick setup

1.	Open `..\parents-association-website` in your VS code.

2.	```npm install```

3.	```ng serve```

### Use Compodoc for Front End Angular documentation

1. Open FrontEnd project with Visual Code

2. Open terminal by clicking on View -> Terminal

3. On the Terminal run the command:
   ```npm install @compodoc/compodoc```
4. Verify that the command added a reference to compodoc on the 'dependencies' of the file 'package.json'.

5. On the root of the file 'package.json', in the `scripts` key section the entry for compodoc should already be present. If not, add it as in the example below:
   ```
   {
      [...],
      "scripts": {
         [...]
         "compodoc": "npx compodoc -p tsconfig.json"
      },
      [...]
   }
   ```

6. Again, on the Terminal run the following command:
   ```
   npm run compodoc
   ```

7. The documentation should appear by consulting the file ```...\documentation\index.html``` on the FrontEnd project folder

### Setup Firestore 

1. Firebase CLI: Install Firebase CLI globally using npm:
   ```
   npm install -g firebase-tools
   ```

2. Run the following command to initialize Firebase in your project:
   ```
   firebase init
   ```

   Select the options for Hosting and Firestore when prompted.

   Choose your Firebase project from the list.
   
   For the public directory, specify dist/my-angular-app (replace my-angular-app with your project name).
   
   Choose Yes for configuring as a single-page app (rewrite all URLs to index.html).

3. Run the following command to add Firebase and AngularFire to your project:
   ```
   npm install firebase @angular/fire
   ```

4. Open your src/environments/environment.prod.ts file and add your Firebase config:

   ```
   export const environment = {
     production: true, // Production mode
     useLocalStorage: false, // Not using local storage for production
     firebaseConfig: {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID" // Optional
     }
   };
  ```

5. Run `ng build --configuration production` to build the project. The build artifacts will be stored in the `public/` directory.

6. Run the following command to deploy your application to Firebase Hosting:
   ```
   firebase deploy
   ```

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build --configuration production` to build the project. The build artifacts will be stored in the `public/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.


### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


