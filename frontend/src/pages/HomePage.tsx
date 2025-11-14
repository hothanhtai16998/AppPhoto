import Logout from "@/components/auth/Logout"
import { useAuthStore } from "@/stores/userAuthStore";

function HomePage() {
    const user = useAuthStore((s) => s.user);


    return (
        <div>
            {user?.username}
            <Logout />
        </div>
    )
}

export default HomePage