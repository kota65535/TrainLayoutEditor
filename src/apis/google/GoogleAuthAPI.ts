
export class GoogleAuthAPI {
  apiKey: string;
  clientId: string;
  scope: string;
  discoverDocs: string[];
  authInstance: any;
  onSignInStatusChanged: (isSignedIn: boolean) => void;

  constructor(apiKey: string, clientId: string, scope: string, discoverDocs: string[],
              onSignInStatusChanged: (isSignedIn: boolean) => void) {
    this.apiKey = apiKey;
    this.clientId = clientId;
    this.scope = scope;
    this.discoverDocs = discoverDocs;
    this.onSignInStatusChanged = onSignInStatusChanged;

  }

  init() {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          'apiKey': this.apiKey,
          'clientId': this.clientId,
          'scope': this.scope,
          'discoveryDocs': this.discoverDocs
        }).then( () => {
          this.authInstance = gapi.auth2.getAuthInstance();

          // Listen for sign-in state changes.
          this.authInstance.isSignedIn.listen(this.onSignInStatusChanged);
          resolve(this.isSignedIn());
        });
      })
    });
  }

  getCurrentUser() {
    return this.authInstance.currentUser.get();
  }

  isSignedIn() {
    return this.authInstance.isSignedIn.get();
  }

  signIn() {
    this.authInstance.signIn();
  }

  signOut() {
    if (! this.authInstance.isSignedIn.get()) {
      console.warn("Not signed in.");
      return;
    }
    this.authInstance.signOut();
  }

  revoke() {
    this.authInstance.disconnect();
  }

}

