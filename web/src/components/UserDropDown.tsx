import { useAuthStore } from "@/stores/authStore";
import { useUserDataStore } from "@/stores/userDataStore";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

const UserDropDown = () => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isEmployeeStatus, setIsEmployeeStatus] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ordersCount = useUserDataStore((state) => state.ordersCount);
  const isEmployee = useUserDataStore((state) => state.isEmployee);
  const walletBalance = useUserDataStore((state) => state.walletBalance);
  const isLoadingOrders = useUserDataStore((state) => state.isLoading);
  const refreshUserData = useUserDataStore((state) => state.refreshUserData);
  return (
    <div>
      <button className="flex items-center gap-2.5 py-2 px-3 rounded-xl hover:bg-gofarm-green/5 group border border-gofarm-green/20 hover:border-gofarm-green hoverEffect transition-all duration-200 hover:shadow-sm">
        <div className="relative">
          {user?.photoURL ? (
            <Image
              width={40}
              height={40}
              src={user?.photoURL}
              alt={user?.displayName || "user"}
              className="w-9 h-9 rounded-full object-cover border-2 border-gofarm-green/30 group-hover:border-gofarm-green transition-all ring-2 ring-white shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-gofarm-green to-gofarm-light-green flex items-center justify-center shadow-sm">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gofarm-green rounded-full border-2 border-white shadow-sm ring-1 ring-green-100" />
        </div>
        <div className="hidden lg:flex flex-col items-start">
          <span className="text-sm font-semibold text-gofarm-black group-hover:text-gofarm-green transition-colors">
            {user?.displayName?.split(" ")[0] || "User"}
          </span>
          <span className="text-xs text-gofarm-gray">My Account</span>
        </div>
      </button>
    </div>
  );
};

export default UserDropDown;
