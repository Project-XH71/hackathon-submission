import { combineReducers } from 'redux';
import userReducer from './UserSlice';
import hospitalReducer from "./MyHospitalSlice";
// Import other slices

const rootReducer = combineReducers({
  user: userReducer,
  hospital: hospitalReducer
  // Add other reducers here
});

export default rootReducer;
