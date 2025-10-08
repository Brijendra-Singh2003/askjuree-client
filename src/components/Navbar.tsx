"use client";

import React, { useContext } from "react";
import { API_URL } from "@/lib/constants";
import { GraduationCapIcon, LogInIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { userContext } from "@/context/session";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname } from "next/navigation";

function Navbar() {
  const { isLoading, user, error } = useContext(userContext);
  const pathname = usePathname();

  return (
    <div className=" px-4 py-2 fixed w-full top-0 flex items-center justify-between bg-background xl:bg-transparent">
      <Link href="/" className="p-1.5 flex items-center gap-2">
        <GraduationCapIcon className="size-6" />
        <h1 className="text-xl">Ask Juree</h1>
      </Link>

      {(!isLoading || error) &&
        (user ? (
          <div className="flex gap-2">
            <div className="text-right">
              <h4 className="text-sm">{user.name}</h4>
              <p className="text-muted-foreground text-sm overflow-ellipsis">
                {user.email}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full cursor-pointer">
                <Image
                  src={user.picture ?? "/"}
                  height={40}
                  width={40}
                  alt=""
                  className="size-10 rounded-full"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4">
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5" asChild>
                  <Link
                    href={{
                      pathname: `${API_URL}/api/logout`,
                      query: {
                        next: pathname,
                      },
                    }}
                  >
                    <LogOutIcon className="text-inherit" /> Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link
            href={{
              pathname: `${API_URL}/api/login`,
              query: {
                next: pathname,
              },
            }}
            className="flex items-center gap-1 text-foreground/70 hover:text-foreground hover:underline px-4 pt-1 pb-1.5 rounded-full"
          >
            <LogInIcon className="size-5" /> Login
          </Link>
        ))}
    </div>
  );
}

export default Navbar;
