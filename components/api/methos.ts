

import { useCookies } from 'next-client-cookies';

const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
export async function createUser(email: string, name: string, password: string) {
    const result = await fetch(endpoint + '/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
    });
    if (result.ok) {
        return true;
    } else {
        return false;
    }
}

export async function loginUser(email: string, password: string) {
    const result = await fetch(endpoint + '/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    if (result.ok) {
        const cookieStore = useCookies();
        const jsonResult = await result.json();
        cookieStore.set('token', jsonResult["jwt"]);
        return true;
    } else {
        return false;
    }
}