import constants from '../constants';

const initialState = {
  currentUser: null,
  isLoading: true,
  userPosts: {},
  colors: {}
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case constants.SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: payload,
        isLoading: false
      };
    }

    case constants.SET_USER_POSTS: {
      return {
        ...state,
        userPosts: payload
      };
    }

    case constants.SET_USER_COLORS: {
      return {
        ...state,
        colors: payload
      };
    }

    default: {
      return state;
    }
  }
};
