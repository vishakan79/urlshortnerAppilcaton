import { Navigate } from "react-router-dom";
import { useStoreContext } from "../contextApi/ContextApi";

const ProtectedRoute = ({ children }) => {
  const { token } = useStoreContext();
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
