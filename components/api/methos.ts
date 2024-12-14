import { Cookies } from "next-client-cookies";
import { UserData } from "../types/user";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SpaceData } from "../types/space";

const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
export async function createUser(
  email: string,
  name: string,
  password: string
) {
  const result = await fetch(endpoint + "/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, password }),
  });
  if (result.ok) {
    return true;
  } else {
    return false;
  }
}

export async function loginUser(
  email: string,
  password: string,
  cookieStore: Cookies
) {
  const result = await fetch(endpoint + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (result.ok) {
    const jsonResult = await result.json();
    cookieStore.set("token", jsonResult["token"], { expires: 1 });
    return true;
  } else {
    return false;
  }
}

export function logoutUser(cookieStore: Cookies) {
  cookieStore.remove("token");
  return true;
}

export async function fetchUserData(
  cookieStore: Cookies,
  useRouter: AppRouterInstance
) {
  const token = cookieStore.get("token");
  if (!token) {
    return undefined;
  }
  const result = await fetch(endpoint + "/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (result.ok) {
    return (await result.json()) as UserData;
  } else {
    if (result.status === 401) {
      invalidToken(useRouter, cookieStore);
    }
    return undefined;
  }
}

export async function fetchSpacesData(
  cookieStore: Cookies,
  useRouter: AppRouterInstance
) {
  const token = cookieStore.get("token");
  if (!token) {
    return undefined;
  }
  const result = await fetch(endpoint + "/api/spaces", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (result.ok) {
    return (await result.json()) as SpaceData[];
  } else {
    if (result.status === 401) {
      invalidToken(useRouter, cookieStore);
    }
    return undefined;
  }
}

export function invalidToken(
  useRouter: AppRouterInstance,
  cookieStore: Cookies
) {
  cookieStore.remove("token");
  useRouter.push("/login?invalidToken=1");
}
