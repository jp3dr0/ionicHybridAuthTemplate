// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCqUVGsgHt0YaObFz1_kY4Pv7iKDHtzIkM",
    authDomain: "fs1prod-423e0.firebaseapp.com",
    databaseURL: "https://fs1prod-423e0.firebaseio.com",
    projectId: "fs1prod-423e0",
    storageBucket: "fs1prod-423e0.appspot.com",
    messagingSenderId: "316382507193"
  },
  emailAPI: "apiphp", // api para enviar emails
  firebaseBackend: true,
  
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
