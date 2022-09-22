import Axios from "axios";
import { toast } from "react-toastify";

// Action Types
export const SERVICE_FROTATOR_GOT_FROSH = "SERVICE_FROTATOR_GOT_FROSH";
export const SERVICE_FROTATOR_GOT_FROSH_CARDS =
  "SERVICE_FROTATOR_GOT_FROSH_CARDS";
export const SERVICE_FROTATOR_SET_PAGE = "SERVICE_FROTATOR_SET_PAGE";
export const SERVICE_FROTATOR_SET_SEARCH = "SERVICE_FROTATOR_SET_SEARCH";

// Action Creators
export const gotFrosh = (rows, pages) => {
  return { type: SERVICE_FROTATOR_GOT_FROSH, rows, pages };
};
export const gotFroshCards = (frosh) => {
  return { type: SERVICE_FROTATOR_GOT_FROSH_CARDS, frosh };
};
export const froshListSetPage = (page) => {
  return { type: SERVICE_FROTATOR_SET_PAGE, page };
};

export const setSearch = (search) => {
  return { type: SERVICE_FROTATOR_SET_SEARCH, search };
};

// Thunks, async functions basically
export const fetchFrosh = (search) => async (dispatch) => {
  try {
    const res = await Axios.get("/api/frotator/frosh", { params: search });
    if (search.cards) {
      dispatch(gotFroshCards(res.data.rows));
      return;
    }

    dispatch(gotFrosh(res.data.rows, res.data.count));
  } catch (error) {
    toast.error("There was an error fetching the frosh");
  }
};

// Initial state of reducer
const init = {
  list: [],
  cards: [],
  page: 1,
  count: 1,
  search: {
    dinnerGroup: "any",
  },
};

// Reducer
const reducer = (state = init, action) => {
  switch (action.type) {
    case SERVICE_FROTATOR_GOT_FROSH: {
      return { ...state, list: action.rows, count: action.pages };
    }
    case SERVICE_FROTATOR_GOT_FROSH_CARDS: {
      return { ...state, cards: action.frosh };
    }
    case SERVICE_FROTATOR_SET_PAGE: {
      return { ...state, page: action.page };
    }
    case SERVICE_FROTATOR_SET_SEARCH: {
      return { ...state, search: action.search };
    }
    default:
      return state;
  }
};

export default reducer;
