import Axios from "axios";
import { toast } from "react-toastify";

// Action Types
export const SERVICE_EXAMPLE_GOT_EXAMPLES = "SERVICE_EXAMPLE_GOT_EXAMPLES";

// Action Creators
export const gotExamples = (examples) => {
  return { type: SERVICE_EXAMPLE_GOT_EXAMPLES, examples };
};

// Thunks, async functions basically
export const fetchExamples = () => async (dispatch) => {
  try {
    const res = await Axios.get("/api/example/examples");

    dispatch(gotExamples(res.data));
  } catch (error) {
    toast.error("There was an error fetching the examples");
  }
};

// Initial state of reducer
const init = {
  examples: [],
};

// Reducer
const reducer = (state = init, action) => {
  switch (action.type) {
    case SERVICE_EXAMPLE_GOT_EXAMPLES: {
      return { ...state, examples: action.examples };
    }
    default:
      return state;
  }
};

export default reducer;
