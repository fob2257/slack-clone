import constants from '../constants';

export const setCurrentChannel = channel => ({ type: constants.SET_CURRENT_CHANNEL, payload: channel });

export const setChannelCollection = channels => ({ type: constants.SET_CHANNEL_COLLECTION, payload: channels });
