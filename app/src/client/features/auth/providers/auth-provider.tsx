"use client";

import { createContext, useEffect } from "react";
import { useStore } from "../../../stores";

export const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const userSlice = useStore.useSlice.user();

	useEffect(() => {
		userSlice.fetchCurrentUser();
	}, [userSlice.fetchCurrentUser]);

	return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
