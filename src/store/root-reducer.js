import { combineReducers } from "redux";

import {
  reducer as rejectionReducer,
  slice as rejectionSlice,
} from "../rejection/rejection-reducer";

export default combineReducers({
  [rejectionSlice]: rejectionReducer,
});
