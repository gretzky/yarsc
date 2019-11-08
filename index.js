import React, {
  useEffect,
  useRef,
  useMemo,
  useReducer,
  useContext,
  createContext
} from "react";

const usePrevState = state => {
  const ref = useRef();

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return ref.current;
};

const useLogger = state => {
  const prevState = usePrevState(state);

  useEffect(() => {
    if (prevState === undefined) return;
    if (
      (process && process.env && process.env.NODE_ENV === "development") ||
      typeof __DEV__ !== undefined
    ) {
      if (prevState !== state) {
        console.log("prev state: ", prevState);
        console.log("current state: ", state);
      }
    }
  }, [state, prevState]);
};

const Context = createContext({
  state: {},
  dispatch: () => undefined
});

const thunk = (dispatch, state) => input =>
  input instanceof Function ? input(dispatch, state) : dispatch(input);

const Provider = ({ reducer, initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ state, dispatch: thunk(dispatch, state) }), [
    state,
    dispatch
  ]);

  useLogger(state);

  return (
    <Context.Provider state={initialState} value={value}>
      {children}
    </Context.Provider>
  );
};

const useStateContext = state => useContext(Context);

export { useStateContext };
export default Provider;
