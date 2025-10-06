import { Navigate, Outlet, useLocation } from "react-router-dom";

function isAuthenticated() {
	return Boolean(localStorage.getItem("token") && localStorage.getItem("user"));
}

export default function PrivateRoute() {
	const location = useLocation();
	if (!isAuthenticated()) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}
	return <Outlet />;
}

