import CmsShell from "@/component/layout/CMS/CmsShell";
import 'bootstrap/dist/css/bootstrap.min.css'

export default function PagesLayout({ children }) {
  return <CmsShell>{children}</CmsShell>;
}
