// pages/_app.tsx
import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { Kdam_Thmor_Pro } from "next/font/google";
import { Vazirmatn } from "next/font/google";

const kdamThmorPro = Kdam_Thmor_Pro({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kdam",
});

const vazir = Vazirmatn({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vazir",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {" "}
      <style jsx global>{`
        html {
          --font-kdam: ${kdamThmorPro.style.fontFamily};
          --font-vazir: ${vazir.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);
