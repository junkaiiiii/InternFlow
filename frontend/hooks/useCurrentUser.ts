"use client";

import { useEffect, useState } from "react";
import { api } from "@/libs/api";
import { TPublicUser } from "@/types/types";

export default function useCurrentUser(): TPublicUser | null {
  const [user, setUser] = useState<TPublicUser | null>(null);

  useEffect(() => {
    api.get("/user/me")
      .then((res) => {
        setUser(res?.data?.user ?? null);
      });
  }, []);

  return user;
}
