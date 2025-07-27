// pages/_app.tsx
import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import "../src/app/globals.css";
import { useEffect } from "react";
import { Kdam_Thmor_Pro } from "next/font/google";

const kdamThmorPro = Kdam_Thmor_Pro({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kdam",
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Add font class to body after mount
    document.body.classList.add(kdamThmorPro.variable);
    return () => {
      document.body.classList.remove(kdamThmorPro.variable);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
