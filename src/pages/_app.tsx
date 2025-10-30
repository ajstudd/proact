import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { AppContextProvider } from "../contexts/AppContext";
import { store } from "../store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

import "../../global.css";
import { useRouter } from "next/router";

import HomeLayout from "components/HomeLayout";
import UnifiedLayout from "components/UnifiedLayout";
import AuthLayout from "components/LoggedOutLayout";

const roboto = Roboto({
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
  preload: true,
  subsets: ["latin-ext"],
  adjustFontFallback: true,
  fallback: ["sans-serif"],
});

const publicPages = ["/home", "/project/[id]", "/about", "/privacy-policy"];
const noAuthPages = ["/login", "/signup", "/onboarding", "/", "/otp/[email]"];

/**
 * Main application content wrapper handling authentication and layout selection.
 */
function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const auth = useAuth();

  if (auth.isLoading) {
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;
  }

  const isPublicRoute = publicPages.some(path => {
    if (path.includes('[')) {
      const baseRoute = path.split('/[')[0];
      return router.pathname.startsWith(baseRoute);
    }
    return router.pathname === path;
  });

  const isNoAuthRoute = noAuthPages.some(path => {
    if (path.includes('[')) {
      const baseRoute = path.split('/[')[0];
      return router.pathname.startsWith(baseRoute);
    }
    return router.pathname === path;
  });

  if (!auth.isAuthenticated && !isPublicRoute && !isNoAuthRoute) {
    router.replace("/login");
    return <p className="text-center text-gray-500 mt-20">Redirecting to login...</p>;
  }

  let Layout;
  if (isNoAuthRoute) {
    Layout = AuthLayout;
  } else if (auth.isAuthenticated) {
    Layout = UnifiedLayout;
  } else if (isPublicRoute) {
    Layout = HomeLayout;
  } else {
    Layout = HomeLayout;
  }

  return (
    <Layout>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}

export default function App(props: AppProps) {
  return (
    <main className={roboto.className}>
      <Provider store={store}>
        <AppContextProvider>
          <AuthProvider publicPages={[...publicPages, ...noAuthPages]}>
            <AppContent {...props} />
          </AuthProvider>
        </AppContextProvider>
      </Provider>
    </main>
  );
}
