import constants from '../constants';

export const setCurrentUser = user => ({
  type: constants.SET_CURRENT_USER,
  payload: user
});

export const setUserPosts = userPosts => ({
  type: constants.SET_USER_POSTS,
  payload: userPosts
});

export const setUserColors = colors => ({
  type: constants.SET_USER_COLORS,
  payload: colors
});
