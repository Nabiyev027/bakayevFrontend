import React from "react";
import "./NotFound.scss";

export default function NotFound() {
  return (
    <div className="not-found">
      <div>
        <h1>404</h1>
        <h2>Page Not Found</h2>

        <a href="/">Go to Homepage</a>
      </div>
    </div>
  );
}
