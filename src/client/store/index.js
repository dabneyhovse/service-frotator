import { combineReducers } from "redux";
import frosh from "./frosh";
import singleFrosh from "./singleFrosh";

/**
 * this reducer will become part of the main reducer in the app
 *
 * yes ik this opens up security issues, but I expect
 * there to be some code review here when comptrollers approve
 * new services smh.
 *
 * I dont really expect anyone other than
 * the comptrollers to ever use this setup anyway.
 *
 * Also honor code noises lol
 */

const reducer = combineReducers({
  frosh,
  singleFrosh,
});

export default reducer;
