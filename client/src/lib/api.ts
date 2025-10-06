export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function authHeaders() {
	const token = localStorage.getItem('token');
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path: string) {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		headers: { ...authHeaders() },
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data?.message || 'Request failed');
	return data;
}

export async function apiPost(path: string, body: unknown) {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...authHeaders() },
		body: JSON.stringify(body),
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data?.message || 'Request failed');
	return data;
}

