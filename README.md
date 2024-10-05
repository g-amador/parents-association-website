# ParentsAssociationWebsite

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## FrontEnd setup

1.	Open `..\parents-association-website` in your VS code.

2.	```npm install```

3.	```ng serve```

## Use Compodoc for Front End Angular documentation

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
