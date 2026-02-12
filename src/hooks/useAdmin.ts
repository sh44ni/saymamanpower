import useSWR from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error("Not authorized");
    return res.json();
});

export function useAdmin({ redirectTo = "", redirectIfFound = false } = {}) {
    const { data, error, isLoading } = useSWR("/api/auth/admin/me", fetcher);
    const router = useRouter();

    useEffect(() => {
        if (!redirectTo || isLoading) return;

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !data?.user) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && data?.user)
        ) {
            router.push(redirectTo);
        }
    }, [data, redirectIfFound, redirectTo, isLoading, router]);


    return {
        admin: data?.user,
        isLoading,
        isError: error,
    };
}
