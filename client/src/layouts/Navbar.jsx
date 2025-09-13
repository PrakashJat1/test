import ConfirmModal from "@/components/modals/ConfirmModal";
import ProfileViewModal from "@/components/modals/ProfileViewModal";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { Home, LogOut, User, UserCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "react-bootstrap";

const Navbar = ({
  title = "Dashboard",
  fullName = "Prakash",
  button = false,
}) => {
  const { logout } = useAuth();
  const user = useUser();

  const [isLogout, setIsLogOut] = useState(false);
  const [profileModal, setProfileModal] = useState(false);

  return (
    <>
      <header
        className="bg-white shadow-sm px-4 py-2 d-flex justify-content-between align-items-center w-100 "
        style={{ height: "10%" }}
      >
        {button}

        {/* Center: Title */}
        <div className="d-flex gap-2 text-center ">
          <Home size={30} style={{ marginTop: "3px" }} className="fw-bold" />
          <h5 className="mb-0 fw-bold  text-dark fs-3">{title}</h5>
        </div>

        {/* Right: Username and Logout */}
        <div className="d-flex align-items-center gap-4">
          <div
            onClick={() => setProfileModal(true)}
            className="d-flex align-items-center gap-1 text-primary fw-bold cursor-pointer"
            role="button"
          >
            <UserCircle size={25} className="text-primary" />
            <span style={{ fontSize: "20px" }}>{fullName}</span>
          </div>

          <LogOut
            size={25}
            className="text-danger cursor-pointer"
            onClick={() => setIsLogOut(true)}
            role="button"
          />
        </div>
      </header>

      <ConfirmModal
        show={isLogout}
        onConfirm={logout}
        onClose={() => setIsLogOut(false)}
        title="Confirm LogOut"
        message="Are you sure you want to logout ?"
      />

      <ProfileViewModal
        show={profileModal}
        onClose={() => setProfileModal(false)}
        user={user}
      />
    </>
  );
};

export default Navbar;
