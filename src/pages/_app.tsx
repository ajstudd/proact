import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { ChakraProvider } from "@chakra-ui/react";
import { AppContextProvider } from "../contexts/AppContext";
import { store } from "../store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




import "../../global.css";
import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";

// Layouts
import HomeLayout from "components/HomeLayout"; // Public Layout
import { MainLayout } from "components/Layout"; // General Logged-in Layout
import ContractorLayout from "components/ContractorLayout"; // Contractor-Specific Layout
import GovernmentLayout from "components/GovernmentLayout"; // Government-Specific Layout
import AuthLayout from "components/LoggedOutLayout"; // Login/Register Layout

const roboto = Roboto({
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
  preload: true,
  subsets: ["latin-ext"],
  adjustFontFallback: true,
  fallback: ["sans-serif"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const publicPages = ["/home"];
  const noAuthPages = ["/login", "/signup", "/onboarding", "/", "/otp/[email]"];

  const auth = useAuth([...publicPages, ...noAuthPages]);

  // ✅ Prevent rendering protected pages before checking auth
  if (!auth.isAuthenticated && !publicPages.includes(router.pathname) && !noAuthPages.includes(router.pathname)) {
    return <p className="text-center text-gray-500 mt-20">Redirecting...</p>; // ✅ Show message instead of blank screen
  }

  // 🛠️ **Dynamically Assign Layout**
  let Layout = HomeLayout; // Default public layout
  if (noAuthPages.includes(router.pathname)) {
    Layout = AuthLayout; // Login/Register pages
  } else if (auth.isAuthenticated) {
    switch (auth.user?.role) {
      case "government":
        Layout = GovernmentLayout;
        break;
      case "contractor":
        Layout = ContractorLayout;
        break;
      default:
        Layout = HomeLayout;
    }
  }

  return (
    <main className={roboto.className}>
      <Provider store={store}>
        <AppContextProvider>
          <Layout>
            <ChakraProvider>
              <Component {...pageProps} />
              <ToastContainer position="top-right" autoClose={3000} />
            </ChakraProvider>
          </Layout>
        </AppContextProvider>
      </Provider>
    </main>
  );
}
