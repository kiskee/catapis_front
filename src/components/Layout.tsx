import type { ReactNode } from "react";
import { UserDetailProvider } from "../context/UserDetailContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <UserDetailProvider>
      <div className="bg-black min-h-screen w-screen">{children}</div>
    </UserDetailProvider>
  );
}
