'use strict';
// All portfolio content is embedded here so the website has no JSON/Markdown requests.
const STATIC_CONTENT = {
  "data": {
    "site": {
      "name": "Sazad Ahemad",
      "availability": "Available for DevOps & System Administration roles",
      "role": "DevOps Engineer · Linux Administrator · Cloud Infrastructure",
      "location": "Bhubaneswar, India",
      "languages": [
        "English",
        "Hindi",
        "Odia"
      ],
      "profileImage": "assets/profile.jpg",
      "summary": "I build, automate and operate reliable infrastructure — from Linux servers and AWS environments to CI/CD pipelines and monitoring platforms."
    },
    "about": {
      "heading": [
        "Infrastructure-minded.",
        "Operations-focused.",
        "Always improving."
      ],
      "paragraphs": [
        "I enjoy working with Linux systems, troubleshooting technical issues and deploying applications in cloud environments. My background spans technical support, software development, AWS deployments and business operations — giving me both hands-on engineering depth and practical ownership.",
        "My focus is simple: reduce manual work, improve reliability and make systems easier to deploy, monitor and maintain."
      ],
      "stats": [
        {
          "value": "3+",
          "label": "Years across support, software and operations"
        },
        {
          "value": "3",
          "label": "Production-style infrastructure projects"
        },
        {
          "value": "24/7",
          "label": "Reliability and operations mindset"
        }
      ]
    },
    "focus": [
      {
        "title": "Infrastructure as Code",
        "description": "Designing repeatable AWS environments with Terraform and configuration automation with Ansible."
      },
      {
        "title": "Observability",
        "description": "Building monitoring and alerting workflows with Prometheus, Grafana, Alertmanager and exporters."
      },
      {
        "title": "Cloud-native foundations",
        "description": "Strengthening Kubernetes, container networking and production operations knowledge."
      }
    ],
    "skills": [
      {
        "title": "Cloud & IaC",
        "items": [
          "AWS",
          "Terraform",
          "Ansible",
          "EC2",
          "IAM",
          "S3",
          "RDS",
          "Auto Scaling",
          "Load Balancer",
          "CloudWatch"
        ]
      },
      {
        "title": "DevOps",
        "items": [
          "GitLab CI/CD",
          "Jenkins",
          "Docker",
          "Git",
          "Deployment Automation",
          "Release Support"
        ]
      },
      {
        "title": "Systems",
        "items": [
          "Linux Administration",
          "Windows Administration",
          "Server Deployment",
          "System Monitoring",
          "PowerShell",
          "Python Scripting"
        ]
      },
      {
        "title": "Web Stack",
        "items": [
          "Nginx",
          "PHP-FPM",
          "Core PHP",
          "Laravel",
          "ReactJS",
          "JavaScript",
          "MySQL",
          "WordPress"
        ]
      }
    ],
    "experience": [
      {
        "period": "Dec 2024 — Apr 2026",
        "role": "Co-Founder",
        "company": "Sentinel Workforce Pvt. Ltd.",
        "description": "Managed workforce operations, employee data, attendance, reporting, payment tracking and day-to-day operational workflows through ERP systems, spreadsheets and digital business tools. Coordinated field teams, clients and office staff while maintaining process accuracy and service delivery."
      },
      {
        "period": "Dec 2023 — Dec 2024",
        "role": "Technical Support Executive",
        "company": "Startek Pvt. Ltd.",
        "description": "Resolved L1 software, operating system, hardware, account-access and network-connectivity issues for Windows and Linux users. Performed health checks, monitored application availability, documented incidents and escalated complex issues to infrastructure teams."
      },
      {
        "period": "Jul 2022 — Sep 2022",
        "role": "Associate Software Engineer",
        "company": "Retrod Technology Pvt. Ltd.",
        "description": "Configured Ubuntu servers, deployed web applications, automated releases with Jenkins and provisioned AWS infrastructure using Terraform. Managed EC2, VPC and S3 resources and supported application availability and maintenance."
      },
      {
        "period": "Jul 2021 — Sep 2021",
        "role": "Full Stack Web Developer Intern",
        "company": "DG Techno Soft India Pvt. Ltd.",
        "description": "Built client-facing interfaces and REST API integrations, connected frontend and backend systems and used Git for multi-project version control and team collaboration."
      },
      {
        "period": "Jan 2020 — Jan 2021",
        "role": "Full Stack Web Developer Intern",
        "company": "Talspo Pvt. Ltd.",
        "description": "Developed business logic, a corporate website, job portal and live video conferencing application while mentoring junior interns."
      }
    ],
    "projects": [
      {
        "title": "Infrastructure Monitoring Platform",
        "url": "https://gitlab.com/connect2sazad/prometheus-grafana-infra-setup",
        "platform": "GitLab",
        "description": "AWS infrastructure provisioned with Terraform, with Prometheus, Grafana and Alertmanager deployed using Ansible and Docker through a GitLab CI/CD pipeline.",
        "tags": [
          "Terraform",
          "Ansible",
          "Docker",
          "Grafana"
        ]
      },
      {
        "title": "WordPress Infrastructure",
        "url": "https://gitlab.com/connect2sazad/wordpress-with-infra-setup",
        "platform": "GitLab",
        "description": "Repeatable AWS deployment for WordPress on Linux with Nginx, PHP-FPM and MySQL using Terraform, Ansible and Docker.",
        "tags": [
          "AWS",
          "Nginx",
          "PHP-FPM",
          "MySQL"
        ]
      },
      {
        "title": "Shikayaat",
        "url": "https://github.com/connect2sazad/shikayaat",
        "platform": "GitHub",
        "description": "A digital complaint platform with PHP-based REST APIs, AWS hosting and Jenkins deployment automation.",
        "tags": [
          "PHP",
          "REST API",
          "AWS",
          "Jenkins"
        ]
      }
    ],
    "certifications": [
      {
        "title": "Access an EC2 Instance Shell from the AWS Console",
        "issuer": "Coursera Project Network",
        "year": "2024",
        "description": "Hands-on guided project covering browser-based shell access to an Amazon EC2 instance through the AWS console.",
        "credentialId": "6V243YKFFTJG",
        "url": "assets/certificates/Coursera-6V243YKFFTJG.pdf"
      },
      {
        "title": "Command Line in Linux",
        "issuer": "Coursera Project Network",
        "year": "2023",
        "description": "Hands-on guided project covering essential Linux command-line navigation and operations.",
        "credentialId": "C7GF2CW55WXL",
        "url": "assets/certificates/Coursera-C7GF2CW55WXL.pdf"
      },
      {
        "title": "Building Web Applications in PHP",
        "issuer": "University of Michigan · Coursera",
        "year": "2021",
        "description": "Online course covering PHP fundamentals and database-backed web applications.",
        "credentialId": "H3E47569MZY3",
        "url": "assets/certificates/Coursera-H3E47569MZY3.pdf"
      }
    ],
    "presentations": [
      {
        "title": "Prometheus + Grafana Infrastructure Setup using Terraform",
        "type": "Technical Presentation",
        "year": "2026",
        "description": "A production-style monitoring platform covering AWS provisioning, configuration management, containerized monitoring services, GitLab CI/CD, alerting and future improvements.",
        "url": "assets/presentations/Prometheus-Grafana-Infra-Setup-using-Terraform.pptx"
      }
    ],
    "education": [
      {
        "period": "2019 — 2023",
        "qualification": "B.Tech in Computer Science & Information Technology",
        "institution": "BPUT University"
      },
      {
        "period": "2019",
        "qualification": "ISC — Science",
        "institution": "Seventh-Day Adventist Higher Secondary School"
      },
      {
        "period": "2017",
        "qualification": "ICSE",
        "institution": "Seventh-Day Adventist Higher Secondary School"
      }
    ],
    "contact": {
      "eyebrow": "Have infrastructure to build or systems to improve?",
      "links": [
        {
          "label": "mail2sazad@gmail.com",
          "url": "mailto:mail2sazad@gmail.com"
        },
        {
          "label": "+91 876-3438-208",
          "url": "tel:+918763438208"
        },
        {
          "label": "LinkedIn",
          "url": "https://www.linkedin.com/in/connect2sazad"
        },
        {
          "label": "GitHub",
          "url": "https://github.com/connect2sazad"
        }
      ]
    }
  },
  "postNames": [
    "building-monitoring-platform-terraform-ansible.md",
    "terraform-vs-ansible-responsibilities.md",
    "debugging-deployment-pipelines-methodically.md"
  ],
  "posts": {
    "building-monitoring-platform-terraform-ansible.md": "---\nslug: building-monitoring-platform-terraform-ansible\ntitle: Building an Infrastructure Monitoring Platform with Terraform and Ansible\nexcerpt: How I separated infrastructure provisioning, server configuration and monitoring deployment into one repeatable workflow.\ndate: 2026-07-26\nreadTime: 6 min read\ncategory: DevOps\ntags: [Terraform, Ansible, Prometheus, Grafana]\n---\n\nA monitoring stack is easy to start manually and surprisingly difficult to reproduce consistently. My goal was to build the entire environment as a repeatable system rather than a collection of commands.\n\n# The architecture\n\nTerraform provisions the AWS network, security groups and instances. Ansible discovers the servers, installs Docker and deploys exporters on target hosts. Prometheus, Alertmanager and Grafana run on the monitoring server.\n\n# Why the separation matters\n\nTerraform owns infrastructure state. Ansible owns operating-system and application configuration. GitLab CI/CD coordinates both. Keeping these responsibilities separate made troubleshooting easier and reduced accidental drift.\n\n# The important lesson\n\nAutomation is not complete when a container starts. The pipeline also needs validation: connectivity checks, configuration validation, service health checks and alert testing. I verified alerting by intentionally stopping Apache on a target server and confirming the alert path.\n",
    "terraform-vs-ansible-responsibilities.md": "---\nslug: terraform-vs-ansible-responsibilities\ntitle: \"Terraform vs Ansible: A Practical Boundary That Prevents Confusion\"\nexcerpt: Both tools automate infrastructure, but using them interchangeably creates fragile pipelines and unclear ownership.\ndate: 2026-07-22\nreadTime: 4 min read\ncategory: Automation\ntags: [Terraform, Ansible, IaC]\n---\n\nThe simplest boundary is this: Terraform creates and changes infrastructure resources, while Ansible configures the systems running on that infrastructure.\n\n# Use Terraform for resource lifecycle\n\nVPCs, subnets, route tables, security groups, EC2 instances and load balancers belong in Terraform because their lifecycle and dependencies need state management.\n\n# Use Ansible for machine state\n\nPackage installation, service configuration, template deployment, users, permissions and containers belong in Ansible because these tasks describe the desired state inside the server.\n\n# Do not force one tool to do everything\n\nTerraform provisioners can run shell commands, but that does not make them a replacement for configuration management. Likewise, Ansible can create cloud resources, but using it as the primary infrastructure state engine weakens visibility and repeatability.\n",
    "debugging-deployment-pipelines-methodically.md": "---\nslug: debugging-deployment-pipelines-methodically\ntitle: How I Debug Deployment Pipelines Without Guessing\nexcerpt: A failed pipeline is not one problem. It is a chain of stages, and the fastest fix comes from isolating the failed layer.\ndate: 2026-07-18\nreadTime: 5 min read\ncategory: Troubleshooting\ntags: [CI/CD, Linux, Debugging]\n---\n\nRandomly changing YAML, permissions and firewall rules usually makes a deployment failure harder to understand. I debug from the outside inward and prove each layer before moving to the next.\n\n# Start with the pipeline environment\n\nCheck the runner image, installed tools, working directory, variables and credentials. A command that works locally may fail because the runner is a different operating environment.\n\n# Then verify connectivity\n\nResolve DNS, confirm routing, check security groups, test the port and verify the SSH user and key. Do not troubleshoot an application before proving that the deployment system can reach the host.\n\n# Finally inspect the service\n\nCheck process status, logs, listening ports, ownership, permissions and configuration syntax. The objective is to replace assumptions with evidence at every step.\n"
  }
};
