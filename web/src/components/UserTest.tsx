"use client";

import { useAuthStore } from "@/stores/authStore";
import { Button } from "./ui/button";
import Link from "next/link";

const UserTest = () => {
  const { user, loading, logout } = useAuthStore();

  const handleSignout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };
  return (
    <div>
      <p>User Test Component</p>
      <p className="text-base font-semibold">{user?.displayName}</p>
      {user ? (
        <Button onClick={handleSignout}>Logout</Button>
      ) : (
        <Button>
          <Link href="/sign-in">Sign-in</Link>
        </Button>
      )}
    </div>
  );
};

export default UserTest;
