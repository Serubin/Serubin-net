import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import { ensurePortfolioCacheWarmup } from "../lib/portfolioImageCache";
import getStaticContent from "../lib/contentData";
import { NavData, ReactChildren } from "../lib/types";
import Nav from "../components/nav";
import { NavInkProvider } from "../components/nav/NavInkContext";
import "../styles/globals.scss";

if (process.env.NODE_ENV === "development") {
  ensurePortfolioCacheWarmup();
}

export const metadata: Metadata = {
  metadataBase: new URL("https://serubin.net"),
  openGraph: {
    type: "website",
    siteName: "Solomon Rubin",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Solomon" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: ReactChildren) {
  const { nav } = getStaticContent(['nav']) as { nav: NavData };

  return (
    <html lang='en'>
      <head></head>
      <body>
        <PlausibleProvider
          domain='serubin.net'
          selfHosted
          trackOutboundLinks
          taggedEvents
        >
          <NavInkProvider>
            <Nav links={nav.links} />
            {children}
          </NavInkProvider>
        </PlausibleProvider>
      </body>
    </html>
  );
}
