import Navbar from "@/app/scenes/navbar";
import HomePage from "@/app/scenes/homePage";
import ProfilePage from "@/app/scenes/profilePage";

export default function Home() {
    return (
        <div>
            <Navbar/>
            <HomePage/>
            <ProfilePage/>
        </div>
    )
}
