import React from "react";

const Practicelayout = ({ children }) => {
  return (
    <div className="container mx-auto max-w-7xl text-foreground bg-background">
      {children}
    </div>
  );
};

export default Practicelayout;
