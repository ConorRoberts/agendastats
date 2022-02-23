import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Drawer, Modal, Button } from "@components/form";
import { Home, Menu, Login, Logout } from "@components/Icons";
import useAuth from "hooks/useAuth";
import { useRouter } from "next/router";
import StatsForm from "./StatsForm";
import useRole from "@hooks/useRole";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showStatsForm, setShowStatsForm] = useState(false);
  const [auth] = useAuth();
  const router = useRouter();
  const [role, roleLoading] = useRole();

  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  return (
    <div>
      {showStatsForm && (
        <Modal onClose={() => setShowStatsForm(false)}>
          <div className="w-screen max-w-4xl">
            <h2 className="font-light text-center mb-4">New Entry</h2>
            <StatsForm />
          </div>
        </Modal>
      )}
      {menuOpen && (
        <Drawer onClose={() => setMenuOpen(false)}>
          <div className="flex flex-col h-full">
            {auth && (
              <Link href="/auth/sign-out" passHref>
                <div className="nav-drawer-button mt-auto">
                  <Logout className="w-6 h-6" />
                  <p>Logout</p>
                </div>
              </Link>
            )}
            {!auth && (
              <Link href="/auth/sign-in" passHref>
                <div className="nav-drawer-button mt-auto">
                  <Login className="w-6 h-6" />
                  <p>Login</p>
                </div>
              </Link>
            )}
          </div>
        </Drawer>
      )}

      {/* Bottom Navigation */}
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 dark:border-t shadow-center-md dark:border-gray-600 flex justify-evenly items-center dark:bg-gray-900 bg-white z-30 pb-4">
          <Link href="/" passHref>
            <div className="small-screen-nav-button">
              <Home className="small-screen-nav-button-icon" />
            </div>
          </Link>
          <div className="small-screen-nav-button">
            <Menu
              className="small-screen-nav-button-icon"
              onClick={() => setMenuOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="hidden md:flex z-30 justify-start px-6 gap-6 items-center fixed top-0 left-0 right-0 py-6 bg-gray-100 bg-opacity-90 backdrop-filter backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-90 rounded-xl">
        <Menu
          className="w-6 h-6 cursor-pointer primary-hover"
          onClick={() => setMenuOpen(true)}
        />
        <Link href="/" passHref>
          <div className="big-screen-nav-button">
            <p>Home</p>
          </div>
        </Link>
        {/* <Link href="/games" passHref>
          <div className="big-screen-nav-button">
            <p>Games</p>
          </div>
        </Link> */}

        {role === "admin" && (
          <div className="ml-auto">
            <Button onClick={() => setShowStatsForm(true)}>New Entry</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
