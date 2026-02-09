import { Metadata } from "next";
import CategoryList from "@/components/customer/business-profile-list";
import React from "react";
import { CollectionPageSchema } from "@/components/seo";

// SEO: Generate metadata for categories page
export const metadata: Metadata = {
  title: "Home Services Categories | Homhelper",
  description:
    "Explore all home service categories on Homhelper. From cleaning and repairs to renovations and wellness - find verified professionals for every need.",
  keywords: [
    "home services categories",
    "service categories",
    "cleaning services",
    "repair services",
    "home renovation",
    "appliance repair",
    "beauty services",
    "packers and movers",
    "pest control",
  ],
  openGraph: {
    title: "Home Services Categories | Homhelper",
    description:
      "Browse all home service categories. Find trusted professionals for cleaning, repairs, renovations, and more.",
    url: "/customer/explore/categories",
  },
};

const Categories = () => {
  return (
    <>
      {/* SEO: Structured Data */}
      <CollectionPageSchema
        name="Home Service Categories"
        description="Browse all home service categories on Homhelper. Find verified professionals for cleaning, repairs, renovations, and more."
        url="/customer/explore/categories"
      />

      <div>
        <CategoryList isVisible={false} search={true} />
      </div>
    </>
  );
};

export default Categories;
