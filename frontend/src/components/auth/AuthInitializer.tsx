
import { useAuthStore } from "@/stores/userAuthStore";
import { useEffect } from "react";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { accessToken, user, refresh, fetchMe } = useAuthStore();

    useEffect(() => {
        const init = async () => {
            try {
                // If there's no access token, try to get a new one with the refresh token
                if (!accessToken) {
                    await refresh();
                } 
                // If there IS an access token but no user data, fetch the user's data
                // This can happen after the refresh() call above completes
                else if (!user) {
                    await fetchMe();
                }
            } catch (error) {
                // This error is expected if the user is not logged in, so we can ignore it.
                console.log("User is not logged in.");
            }
        };

        init();
    }, [accessToken]); // Re-run if accessToken changes (e.g., after refresh())

    return <>{children}</>;
};

export default AuthInitializer;
