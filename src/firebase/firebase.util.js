import * as firebase from 'firebase';
import md5 from 'md5';

import { default as firebaseConfig } from '../firebase.config.json';

firebase.initializeApp(firebaseConfig);

export default firebase;

export const fireAuth = firebase.auth();
export const fireStore = firebase.firestore();
export const fireDatabase = firebase.database();
export const fireStorage = firebase.storage();

export const signInWithEmail = (email, password) =>
  fireAuth.signInWithEmailAndPassword(email, password);

export const signOut = () => fireAuth.signOut();

export const getCurrentUser = () =>
  new Promise((resolve, reject) => {
    const unsubscribeFn = fireAuth.onAuthStateChanged(user => {
      unsubscribeFn();

      resolve(user);
    }, reject);
  });

export const getUser = async user => {
  if (!user) return;

  const userRef = fireDatabase.ref(`users/${user.uid}`);
  const userSnapshot = await userRef.once('value');
  const userData = userSnapshot.val();

  return userData;
};

export const createUser = async (user, additionalData = {}) => {
  if (!user) return;
  const userRef = fireDatabase.ref(`users/${user.uid}`);
  const userData = await getUser(user);

  if (!userData) {
    const { displayName, email, photoUrl, createdAt = new Date() } = user;

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        uid: user.uid,
        photoUrl: photoUrl
          ? photoUrl
          : `http://gravatar.com/avatar/${md5(user.email)}?d=identicon`,
        ...additionalData
      });
    } catch (error) {
      console.error(error);
    }
  }

  return userRef;
};
