// Action Types
export const SERVICE_FROTATOR_ADD_SPAM = "SERVICE_FROTATOR_ADD_SPAM";

// Action Creators
export const frotatorAddSpam = (spam) => {
  return { type: SERVICE_FROTATOR_ADD_SPAM, spam };
};

// Initial state of reducer
const init = [];

// Reducer
const reducer = (state = init, action) => {
  switch (action.type) {
    case SERVICE_FROTATOR_ADD_SPAM: {
      return [...state, action.spam];
    }
    default:
      return state;
  }
};

export default reducer;
