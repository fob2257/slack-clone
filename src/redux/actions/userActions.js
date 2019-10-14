import constants from '../constants';

export const setCurrentUser = user => ({ type: constants.SET_CURRENT_USER, payload: user });
