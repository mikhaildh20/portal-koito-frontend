import Breadcrumb from "@/component/common/Breadcrumb";
import PortalContent from "@/component/layout/Portal/PortalContent";

export default function PreviewPage() {
  return (
    <>
      <Breadcrumb 
      title="Preview"
      items={[]}
      />

      <div
        className="card border-0 shadow-lg"
        style={{
          maxHeight: "80vh",
          overflow: "auto"
        }}
      >
        <PortalContent />
      </div>
    </>
  );
}
