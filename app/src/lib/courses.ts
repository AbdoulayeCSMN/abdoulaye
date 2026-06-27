export interface Course {
  slug: string;
  title: string;
  contentPath?: string;
}

export interface Subdomain {
  slug: string;
  name: string;
  courses: Course[];
}

export interface Domain {
  slug: string;
  name: string;
  subdomains: Subdomain[];
}

export const domains: Domain[] = [
  {
    slug: "web-development",
    name: "Développement Web",
    subdomains: [
      {
        slug: "frontend",
        name: "Frontend",
        courses: [
          { slug: "html-css", title: "HTML & CSS" },
          { slug: "react", title: "React.js" },
          { slug: "nextjs", title: "Next.js" },
        ],
      },
      {
        slug: "backend",
        name: "Backend",
        courses: [
          { slug: "nodejs", title: "Node.js" },
          { slug: "express", title: "Express.js" },
        ],
      },
    ],
  },
  {
    slug: "data-science",
    name: "Data Science",
    subdomains: [
      {
        slug: "python",
        name: "Python",
        courses: [
          { slug: "numpy-pandas", title: "NumPy & Pandas" },
          { slug: "scikit-learn", title: "Scikit-learn" },
        ],
      },
    ],
  },
];
