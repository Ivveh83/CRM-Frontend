import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    {/* När en komponent wrappas av RequireAuth-komponenten, motsvaras den av Outlet och visas endast om ternary-villkoret är uppfyllt.
        
        👉 state={{ from: location }}
                – skickar med information om vilken sida användaren försökte nå innan den blev omdirigerad (t.ex. till login).
                – den sparas i React Routers “navigations-state” och kan läsas efteråt med useLocation().

        👉 replace
                – gör att omdirigeringen ersätter den aktuella historikposten, så att användaren inte kan trycka “Tillbaka” för att komma till den skyddade sidan igen.

        🧠 Kortfattat:
        state={{ from: location }} replace = “kom ihåg var användaren kom ifrån och ersätt historiken när du navigerar dit.” */}
    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.user
                ? <Navigate to='/unauthorized' state={{ from : location }} replace />
                : <Navigate to='/login' state={{from: location }} replace />
    );
}

export default RequireAuth;