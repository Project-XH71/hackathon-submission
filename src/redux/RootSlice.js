import { combineReducers } from 'redux';
import userReducer from './UserSlice';
// Import other slices

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here
});

export default rootReducer;
