import * as actionType from '../actions/actionTypes';

const INITAL_LOCATION = {};

const location = (state = INITAL_LOCATION, action) => {
  switch (action.type) {
    // update the location of the app ( basepath.com/here => basepath.com/there ) because react router wont do it through redux's connect()
    case actionType.SET_LOCATION:
      return { ...action.location };
    default:
      return state;
  }
};

export default location;
