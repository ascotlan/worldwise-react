import { useContext } from "react";
import { AuthContext } from "../context/FakeAuthContext";

function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext being called outside of the AuthProvider");
  return context;
}

export default useAuthContext;