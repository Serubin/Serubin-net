import PlausibleProvider from "next-plausible";
import { ensurePortfolioCacheWarmup } from "../lib/portfolioImageCache";
import { ReactChildren } from "../lib/types";
import "../styles/globals.scss";

if (process.env.NODE_ENV === "development") {
  ensurePortfolioCacheWarmup();
}

export default function RootLayout({ children }: ReactChildren) {
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
          {children}
        </PlausibleProvider>
      </body>
    </html>
  );
}
