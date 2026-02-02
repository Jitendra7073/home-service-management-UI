export const specializationOptions = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Carpentry",
  "Painting",
  "Cleaning",
  "Gardening",
  "Appliance Repair",
  "General Maintenance",
  "Other",
];

export const experienceOptions = [
  { label: "0-1 years", value: 0 },
  { label: "1-3 years", value: 2 },
  { label: "3-5 years", value: 4 },
  { label: "5-10 years", value: 7 },
  { label: "10+ years", value: 15 },
];

export const skillLevelOptions = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Expert", value: "EXPERT" },
];

export const employmentTypeOptions = [
  {
    label: "Business-Based",
    value: "BUSINESS_BASED",
    description: "Works exclusively for your business",
  },
  {
    label: "Global Freelancer",
    value: "GLOBAL_FREELANCE",
    description: "Can work with multiple businesses",
  },
];

export const staffStatusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

export const paymentStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Paid", value: "PAID" },
  { label: "Failed", value: "FAILED" },
];
