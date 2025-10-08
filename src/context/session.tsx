"use client";

import React from "react";
import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

interface IUser {
  id: number;
  name: string;
  email: string;
  picture?: string;
}

interface ISessionContext {
  isLoading: boolean;
  user?: IUser | null;
  error?: Error | null;
  refetch: () => void;
}

async function getMe(): Promise<IUser | null> {
  const response = await fetch(`${API_URL}/api/me`, { credentials: "include" });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

export const userContext = React.createContext<ISessionContext>({
  isLoading: true,
  refetch: () => {},
});

const SessionProvider: React.FC<{ children: Readonly<React.ReactNode> }> = ({
  children,
}) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryFn: getMe,
    queryKey: ["user"],
  });

  return (
    <userContext.Provider value={{ user: data, isLoading, refetch, error }}>
      {children}
    </userContext.Provider>
  );
};

export default SessionProvider;
