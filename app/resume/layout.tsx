import { ReactChildren } from '../../lib/types';
import ResumeHead from '../../resume/components/ResumeHead';

// The submodule's own app/layout.tsx is a root layout — it renders <html>/<body>, which a
// nested layout must not. Render the shared head content instead and let the site's root
// layout provide the document shell.
export default function ResumeLayout({ children }: ReactChildren) {
  return (
    <>
      <ResumeHead />
      {children}
    </>
  );
}
