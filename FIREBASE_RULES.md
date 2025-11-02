# Firebase security rules (development suggestions)

These rules are intended for development/testing. They restrict reads/writes so that users can only access their own documents and their own storage files.

IMPORTANT: Review and tighten these rules before moving to production.

## Firestore (rules)

Use these rules in the Firestore Rules tab:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Subcollections under users (e.g., songs, playlists)
      match /{subCollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Deny everything else by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

## Storage (rules)

Use these rules in the Storage Rules tab:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Files under users/{userId}/** are readable/writable by that authenticated user only
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Deny all other access by default
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}

## Notes and next steps
- When testing locally, you may use more permissive rules (e.g., allow read, write: if true) but do NOT use them in production.
- After you enable these rules, make sure your app signs users in via Firebase Auth and uses the authenticated user's uid when writing data (the current code stores under `users/{uid}` and `users/{uid}/songs`).
- If you need server-side functions for complex authorization, consider Cloud Functions with callable endpoints.

If you want, I can also:
- Move playlists to a `users/{uid}/playlists` subcollection (rather than storing an array on the user doc).
- Add rules examples for role-based access or public playlists.

Tell me if you want me to change data shape (user doc vs. subcollections) and I'll update the code accordingly.