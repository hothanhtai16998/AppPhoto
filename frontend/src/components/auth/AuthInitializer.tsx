
import { useAuthStore } from "@/stores/userAuthStore";
import { useEffect } from "react";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { initializeApp, isInitializing } = useAuthStore();

    useEffect(() => {
        // This effect runs once on mount to start the auth check.
        initializeApp();
    }, [initializeApp]);

    // While initializing, show a full-page loader (or nothing).
    // This prevents the rest of the app from rendering prematurely.
    if (isInitializing) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p>Loading Application...</p>
            </div>
        );
    }

    // Once initialization is complete, render the actual application.
    return <>{children}</>;
};

export default AuthInitializer;
