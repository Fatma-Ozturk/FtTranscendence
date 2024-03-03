// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    frontUrl: "http://localhost:80/",
    appurl:"http://localhost:3000/api/",
    profileImageUrl:"http://localhost:3000/profile-images/",
    appurlSocketGame:"http://localhost:3000/socket/game",
    appurlSocketDirectMessage:"http://localhost:3000/socket/direct-message",
    appurlSocketChatRoom:"http://localhost:3000/socket/chat-room",
    production: false,
  };

  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
