import CmsShell from "@/component/layout/CMS/CmsShell";
import { AuthProvider } from "@/context/AuthContext";

export default function PagesLayout({ children }) {
  return (
    <AuthProvider>
      <CmsShell>
        {children}
      </CmsShell>
    </AuthProvider>
  );
}
