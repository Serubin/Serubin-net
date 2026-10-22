import PlausibleProvider from "next-plausible";
import getStaticContent from "../lib/contentData";
import { NavData, ReactChildren } from "../lib/types";
import Nav from "../components/nav";
import { NavInkProvider } from "../components/nav/NavInkContext";
import "../styles/globals.scss";

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
