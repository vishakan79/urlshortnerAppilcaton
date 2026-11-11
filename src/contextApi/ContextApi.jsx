import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ContextApi = createContext();

const readToken = () => {
  try {
    const raw = localStorage.getItem("JWT_TOKEN");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const ContextProvider = ({ children }) => {
  const [token, setTokenState] = useState(readToken);

  const setToken = useCallback((value) => {
    setTokenState(value);
    try {
      if (value) localStorage.setItem("JWT_TOKEN", JSON.stringify(value));
      else localStorage.removeItem("JWT_TOKEN");
    } catch {
      /* storage unavailable */
    }
  }, []);

  const sendData = useMemo(() => ({ token, setToken }), [token, setToken]);

  return <ContextApi.Provider value={sendData}>{children}</ContextApi.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStoreContext = () => useContext(ContextApi);
