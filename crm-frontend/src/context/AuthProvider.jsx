{/*Den här komponenten gör så att alla komponenter som ligger inom <AuthContext.Provider> har tillgång till samma state, dvs. auth och setAuth.
    Om något av children inuti <AuthContext.Provider> ändrar på auth, så uppdateras state i alla andra komponenter automatiskt.*/}
import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [activeDbKey, setActiveDbKey] = useState(null);

    return (
        <AuthContext.Provider value={{auth, setAuth, activeDbKey, setActiveDbKey}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;