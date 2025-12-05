import CategoryList from "@/components/customer/business-profile-list";
import React from "react";

const Categories = () => {
  return (
    <div>
      <CategoryList isVisible={false} search={true} />
    </div>
  );
};

export default Categories;
