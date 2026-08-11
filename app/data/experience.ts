export const experience = [
  {
    company: "Centra Construction Group",
    logo: "/centra-logo.png",
    website: "https://www.centrawindows.com",
    discipline: "Senior Software Developer · Langley, BC",
    marker: "June 2023 — Present",
    intro: "Modernizing enterprise applications, digitizing shop-floor workflows, and exploring AI-driven planning across five Western Canadian branches.",
    stack: ["Next.js", "TypeScript", "C#", ".NET", "Redux", "Ant Design", "Playwright", "OpenAI API"],
    products: [
      { name: "CentraCalendar", type: "Scheduling platform", note: "A calendar-based system that coordinates manufacturing, installation, and shipping with real-time tracking and shared workflow visibility across departments.", tags: ["Scheduling", "Operations", "Cross-department"] },
      { name: "CentraManufacture", type: "Manufacturing platform", note: "A production application that surfaces live manufacturing insights, supports workflow optimization, and helps teams identify bottlenecks while maintaining quality control.", tags: ["Manufacturing", "Live insights", "Workflow optimization", "Mobile-first"] },
      { name: "CentraMetrics", type: "Performance dashboard", note: "A centralized dashboard for operational metrics across production, scheduling, and service, giving teams clearer data for day-to-day decisions.", tags: ["Analytics", "Data visualization", "Operational metrics"] },
      { name: "CentraService", type: "Service management", note: "A post-installation workflow system for logging, scheduling, and resolving repairs, warranty claims, and ongoing maintenance requests.", tags: ["Service workflows", "Warranty claims", "Scheduling"] },
      { name: "CentraRequest", type: "Internal operations", note: "A centralized platform for internal requests including share purchases, vacation forms, employee onboarding, and terminations.", tags: ["Request management", "Administration", "Workflow automation"] },
      { name: "CentraCustomers", type: "Customer management", note: "A CRM system that maintains client records and interactions, providing teams across branches with a unified view of customer data.", tags: ["CRM", "Customer data", "Multi-branch"] },
      { name: "CentraAccess", type: "Access management", note: "An internal permissions tool that manages user roles and security levels across Centra applications to support consistent authorization and data protection.", tags: ["Authorization", "User roles", "Security"] },
      { name: "CentraWindows.com", type: "Company website", note: "Centra’s primary marketing and customer engagement website, combining product information and lead generation with backend quoting and service-request integrations.", tags: ["Marketing", "Lead generation", "Systems integration"] },
    ],
  },
  {
    company: "GenXys Healthcare Systems",
    logo: "/genxys-logo-square.png",
    website: "https://genxys.com",
    discipline: "Full-Stack Developer · Vancouver, BC",
    marker: "July 2019 — June 2023",
    intro: "Modernized clinical SaaS products, built reusable UI foundations, and automated operational workflows across the GenXys product suite.",
    stack: ["React", "Redux", "C#", ".NET", "Azure DevOps", "Material UI", "SendGrid", "Selenium"],
    products: [
      { name: "GenXys Portal", type: "Provider portal", note: "The Canadian and United States portal where healthcare providers purchase licenses and manage their accounts and preferences.", tags: ["Healthcare SaaS", "Licensing", "Account management"] },
      { name: "TreatGx", type: "Precision prescribing", note: "A clinical decision-support product that combines a patient’s genetics, current clinical evidence, and entered health information to generate safer, more effective medication options.", tags: ["Pharmacogenetics", "Clinical evidence", "Decision support"] },
      { name: "ReviewGx", type: "Medication review", note: "A medication therapy management tool that brings together evidence-based pharmacogenomics, deprescribing insights, and clinical laboratory data for comprehensive reviews.", tags: ["Medication therapy", "Pharmacogenomics", "Clinical data"] },
      { name: "Alogogen", type: "Algorithm authoring", note: "An internal application used by algorithm developers to create and maintain complex pharmacogenetic algorithms.", tags: ["Internal tools", "Algorithms", "Pharmacogenetics"] },
      { name: "TrackGx", type: "Patient tracking", note: "A mobile-first application that helps patients monitor and report the efficacy of their prescriptions over time.", tags: ["Mobile-first", "Patient experience", "Medication tracking"] },
      { name: "LabGx", type: "Laboratory platform", note: "A laboratory application that supports uploading and processing genetic data from lab results.", tags: ["Laboratory workflows", "Genetic data", "Data processing"] },
      { name: "Patient Dashboard", type: "Patient portal", note: "A patient-facing portal for securely viewing laboratory reports and medication reviews in one place.", tags: ["Patient portal", "Lab reports", "Medication reviews"] },
    ],
  },
  {
    company: "Earlier Technical Career",
    discipline: "Technical Support & Junior Systems Administration",
    marker: "2010 — 2018",
    intro: "Supported users, applications, and infrastructure across renewable energy, oil and gas, and manufacturing environments.",
    stack: ["Desktop Support", "Networking", "Application Support", "Server Support", "Systems Administration", "Windows", "Active Directory", "Mail Server"],
    products: [
      { name: "Technical support & systems administration", type: "IT operations", note: "Provided desktop, network, application, and server support across renewable energy, oil and gas, and manufacturing organizations.", tags: ["Desktop support", "Network support", "Application support", "Server support"] },
    ],
  },
];

export const techIcons: Record<string, string> = {
  "Next.js": "nextdotjs", TypeScript: "typescript", "C#": "csharp", ".NET": "dotnet",
  Redux: "redux", "Ant Design": "antdesign", Playwright: "playwright", "OpenAI API": "openai",
  React: "react", "Azure DevOps": "azuredevops", "Material UI": "mui", SendGrid: "sendgrid",
  Selenium: "selenium",
};
