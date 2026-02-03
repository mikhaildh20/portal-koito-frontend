"use client";

import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Button from "./Button";

export default function Filter({ children, onClick }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Import Bootstrap dropdown di client-side
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
        if (dropdownRef.current) {
          // Initialize dropdown
          new bootstrap.Dropdown(dropdownRef.current);
        }
      });
    }
  }, []);

  return (
    <div className="dropdown">
      <Button
        ref={dropdownRef}
        iconName="funnel"
        classType="primary dropdown-toggle border-start"
        title="Search or filter"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
      />
      <div className="dropdown-menu p-4 rounded-4" style={{ width: "350px" }}>
        {children}
        <div className="d-flex justify-content-end mt-3">
          <Button
            classType="primary"
            iconName="save"
            title="Apply"
            label="Apply"
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
}

Filter.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
};