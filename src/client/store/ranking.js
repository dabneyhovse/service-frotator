import Axios from "axios";
import { toast } from "react-toastify";

// Action Types
export const SERVICE_GOT_RANKINGS = "SERVICE_GOT_RANKINGS";

// Action Creators
export const gotRankings = (list) => {
  return { type: SERVICE_GOT_RANKINGS, list };
};

// Thunks, async functions basically
export const fetchRanking = () => async (dispatch) => {
  try {
    const res = await Axios.get("/api/frotator/frosh/ranking");
    dispatch(gotRankings(res.data));
  } catch (error) {
    toast.error("There was an error fetching the frosh rankings");
  }
};

export const updateRanking = (froshId, rank) => async (dispatch) => {
  try {
    const res = await Axios.put("/api/frotator/frosh/ranking", {
      froshId,
      rank,
    });
    dispatch(gotRankings(res.data));
  } catch (error) {
    toast.error("There was an error updating the ranking");
  }
};

// Initial state of reducer
const init = {
  list: [],
};

// Reducer
const reducer = (state = init, action) => {
  switch (action.type) {
    case SERVICE_GOT_RANKINGS: {
      return { ...state, list: action.list };
    }
    default:
      return state;
  }
};

export default reducer;
