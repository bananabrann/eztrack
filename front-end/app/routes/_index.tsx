import { Navigate } from "react-router";

export default function IndexRedirect() {
  return <Navigate to="/login" replace />;
}