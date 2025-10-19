import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded">
      <LogOut />
      Logout
    </button>
  );
}
