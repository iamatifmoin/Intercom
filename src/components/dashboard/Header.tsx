import React from "react";
import { MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#006eff] flex items-center justify-center">
              <MessageCircle size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 ml-2">Intercom</h1>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-4 text-right">
            <p className="text-sm font-medium text-gray-900">
              {auth.currentUser?.name}
            </p>
            <p className="text-xs text-gray-500">{auth.currentUser?.email}</p>
          </div>

          <div className="flex items-center">
            {auth.currentUser?.avatar ? (
              <img
                src={auth.currentUser.avatar}
                alt={auth.currentUser?.name || ""}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300" />
            )}

            <button
              onClick={handleLogout}
              className="ml-3 p-1 rounded-full hover:bg-gray-100"
              title="Logout"
            >
              <LogOut size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
