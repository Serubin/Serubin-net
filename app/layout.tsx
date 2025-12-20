import PlausibleProvider from "next-plausible";
import { ReactChildren } from "../lib/types";
import "../styles/globals.scss";

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
