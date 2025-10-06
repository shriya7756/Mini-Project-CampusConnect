import { useEffect, useState } from 'react';

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	year?: string;
	major?: string;
}

export function getStoredUser(): AuthUser | null {
	try {
		const raw = localStorage.getItem('user');
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function setStoredUser(user: AuthUser | null) {
	if (!user) {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		return;
	}
	localStorage.setItem('user', JSON.stringify(user));
}

export function useAuthUser() {
	const [user, setUser] = useState<AuthUser | null>(getStoredUser());

	useEffect(() => {
		const onStorage = () => setUser(getStoredUser());
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, []);

	return { user, setUser: (u: AuthUser | null) => { setStoredUser(u); setUser(u); } };
}

