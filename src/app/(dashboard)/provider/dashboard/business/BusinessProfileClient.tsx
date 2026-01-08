import BusinessInfo from '@/components/provider/business/business-info'
import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business | Fixora",
  description: "Manage your business information effectively with Fixora.",
};


const page = () => {
  return (
    <div>
      <BusinessInfo/>
    </div>
  )
}

export default page
