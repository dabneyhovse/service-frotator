import Axios from "axios";
import { toast } from "react-toastify";

// Action Types
export const SERVICE_FROTATOR_GOT_SINGLE_FROSH =
  "SERVICE_FROTATOR_GOT_SINGLE_FROSH";

export const SERVICE_FROTATOR_ADDED_COMMENT = "SERVICE_FROTATOR_ADDED_COMMENT";
export const SERVICE_FROTATOR_TOGGLE_FAVORITE =
  "SERVICE_FROTATOR_TOGGLE_FAVORITE";
// Action Creators
export const gotSingleFrosh = (frosh) => {
  return { type: SERVICE_FROTATOR_GOT_SINGLE_FROSH, frosh };
};

export const toggleFroshFavorite = (favorite) => ({
  type: SERVICE_FROTATOR_TOGGLE_FAVORITE,
  favorite,
});

export const addedComment = (comment) => {
  return { type: SERVICE_FROTATOR_ADDED_COMMENT, comment };
};

// Thunks, async functions basically
export const fetchSingleFrosh = (id) => async (dispatch) => {
  try {
    const res = await Axios.get(`/api/frotator/frosh/${id}`);
    dispatch(gotSingleFrosh(res.data));
  } catch (error) {
    // TODO 404 frosh not found
    toast.error("There was an error fetching this frosh.");
  }
};

export const postNewComment = (comment) => async (dispatch) => {
  try {
    const res = await Axios.post("/api/frotator/comments", comment);
    dispatch(addedComment(res.data));
  } catch (error) {
    toast.error("There was an error posting your comment");
  }
};

export const favoriteFrosh = (froshId, favorite) => async (dispatch) => {
  try {
    const res = await Axios.post("/api/frotator/frosh/favorite", {
      froshId,
      favorite,
    });
    dispatch(toggleFroshFavorite(favorite));
  } catch (error) {
    toast.error("There was an error favoriting this frosh");
  }
};

// Initial state of reducer
const init = {
  frosh: {
    "frotator-comments": [],
    favorite: false,
    bio: {},
  },
};

// Reducer
const reducer = (state = init, action) => {
  switch (action.type) {
    case SERVICE_FROTATOR_GOT_SINGLE_FROSH: {
      return { ...state, frosh: action.frosh };
    }
    case SERVICE_FROTATOR_ADDED_COMMENT: {
      return {
        ...state,
        frosh: {
          ...state.frosh,
          "frotator-comments": [
            ...state.frosh["frotator-comments"],
            action.comment,
          ],
        },
      };
    }
    case SERVICE_FROTATOR_TOGGLE_FAVORITE: {
      return { ...state, frosh: { ...state.frosh, favorite: action.favorite } };
    }
    default:
      return state;
  }
};

export default reducer;
