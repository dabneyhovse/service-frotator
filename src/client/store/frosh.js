import Axios from "axios";
import { toast } from "react-toastify";
import { SERVICE_FROTATOR_GOT_SINGLE_FROSH } from "./singleFrosh";

/**
 * Creates a URL-encoded query string from a given set of parameters
 * Custom serializer needed to restore old behavior after breaking change
 * in Axios 0.28
 * @param {Object} params The parameters to encode into a query string
 * @returns {string} The URL-encoded query string
 */
function createQueryString(params) {
  return Object.keys(params).reduce((x, key) => {
      const value = params[key];
      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
          return x + `${x.length ? '&' : ''}${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
      } else {
          return x + `${x.length ? '&' : ''}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
  }, '');
}

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
    const res = await Axios.get("/api/frotator/frosh", { params: search, paramsSerializer: { serialize: createQueryString } });
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
    name: "",
    anagram: "",
    major: "",
    bio: "",
    sort: 1,
  },
  selectedFroshIdx: 0,
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
    case SERVICE_FROTATOR_GOT_SINGLE_FROSH: {
      return {
        ...state,
        selectedFroshIdx: state.list.findIndex(
          (fl) => fl.id == action.frosh.id
        ),
      };
    }
    default:
      return state;
  }
};

export default reducer;
