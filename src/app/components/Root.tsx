import { Outlet } from "react-router";
import { DatathonProvider } from "../contexts/DatathonContext";
import { AuthProvider } from "../contexts/AuthContext";

export function Root() {
  return (
    <AuthProvider>
      <DatathonProvider>
        <Outlet />
      </DatathonProvider>
    </AuthProvider>
  );
}