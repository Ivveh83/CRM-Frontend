{/*Den här komponenten gör att jag slipper importera de två komponenterna nedan i resten av applikationen*/}
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export default useAuth;