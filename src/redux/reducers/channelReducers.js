import constants from '../constants';

const initialState = {
  currentChannel: null,
  collection: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case constants.SET_CHANNEL_COLLECTION: {
      return {
        ...state,
        collection: payload,
      };
    }

    case constants.SET_CURRENT_CHANNEL: {
      return {
        ...state,
        currentChannel: payload,
      };
    }

    default: { return state; }
  }
};
