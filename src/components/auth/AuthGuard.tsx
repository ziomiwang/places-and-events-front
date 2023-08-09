import { ReactNode, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "redux/rootReducer";
import RegisterDemo from "components/registerdemo/RegisterDemo";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {

    const { name } = useSelector((state: RootState) => state.user);

    const { pathname } = useLocation();

    const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

    if (name === "") {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }
        return <RegisterDemo />;
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null);
        return <Navigate to={requestedLocation} />;
    }

    return <>{children}</>;
}
