import * as firebase from 'firebase';
import md5 from 'md5';

import { default as firebaseConfig } from '../firebase.config.json';

firebase.initializeApp(firebaseConfig);

export default firebase;

export const fireAuth = firebase.auth();
export const fireStore = firebase.firestore();
export const fireDatabase = firebase.database();
export const fireStorage = firebase.storage();

export const signInWithEmail = (email, password) => fireAuth.signInWithEmailAndPassword(email, password);

export const signOut = () => fireAuth.signOut();

export const getCurrentUser = () =>
  new Promise((resolve, reject) => {
    const unsubscribeFn = fireAuth.onAuthStateChanged(user => {
      unsubscribeFn();

      resolve(user);
    }, reject);
  });

export const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;

  const docRef = fireStore.doc(`users/${user.uid}`);
  const docSnapshot = await docRef.get();

  if (!docSnapshot.exists) {
    const {
      displayName,
      email,
      photoUrl,
      createdAt = new Date(),
    } = user;

    try {
      await docRef.set({
        displayName,
        email,
        createdAt,
        uid: user.uid,
        photoUrl: (photoUrl) ? photoUrl
          : `http://gravatar.com/avatar/${md5(user.email)}?d=identicon`,
        ...additionalData,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return docRef;
};
