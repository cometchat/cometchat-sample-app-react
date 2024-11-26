import { createContext, useReducer } from "react"
import { appReducer, defaultAppState } from "./appReducer";

export const AppContext = createContext({ appState: defaultAppState, setAppState: ({}) => { } });

export const AppContextProvider = ({ children }) => {
    const [appState, setAppState] = useReducer(appReducer, defaultAppState);

    return (
        <AppContext.Provider value={{
            appState,
            setAppState
        }}>
            {children}
        </AppContext.Provider>
    )
}