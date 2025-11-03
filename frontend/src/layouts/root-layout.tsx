import { Footer } from "@/components/Footer";
import {Navbar} from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Outlet } from "react-router";

function RootLayout() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Navbar />
            <div className="relative flex min-h-svh flex-col bg-background">
                <Outlet />
            </div>
            <Footer/>
        </ThemeProvider>
    );
}

export default RootLayout;