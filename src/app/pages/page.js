"use client";

import Breadcrumb from "@/component/common/Breadcrumb";
import PortalContent from "@/component/layout/Portal/PortalContent";
import withAuth from "@/component/withAuth";

function PreviewPage() {
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

export default withAuth(PreviewPage);
