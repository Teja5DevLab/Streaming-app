import React from "react";

export function ProgressBar({ isLoading }) {
  return (
    <div
      style={{
        width: !isLoading ? "0%" : "100%",
        transition: "width 0.2s ease-in-out",
        height: "3px",
        backgroundColor: "red",
        opacity: !isLoading ? 0 : 1,
      }}
    />
  );
}
