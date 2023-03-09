import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <header className="bg-gray-900 shadow">
        <div className="mx-auto py-6 px-4">
          <h1 className="text-white font-bold text-3xl">DataTable</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto py-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
