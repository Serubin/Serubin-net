import { ReactChildren } from '../lib/types';
import '../styles/globals.scss';


export default function RootLayout({ children }: ReactChildren) {
  return (
    <html lang="en">
      <head />
      <body>
        <>{children}</>
      </body>
    </html>
  );
}
