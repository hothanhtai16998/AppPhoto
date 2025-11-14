import { useAuthStore } from "@/stores/userAuthStore";
import { Button } from "../ui/button"
import { useNavigate } from "react-router";

function Logout() {

    const { signOut } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/signin");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }


    return (
        <Button onClick={handleLogout}>Thoát</Button>
    )
}

export default Logout