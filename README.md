# LeadFlow: An Intelligent Lead Management System

Welcome to LeadFlow, a modern, AI-powered web application designed to streamline the process of capturing, managing, and analyzing sales leads. Built with a powerful tech stack, this application provides a centralized and intelligent platform to replace traditional spreadsheet-based lead tracking.

The app is designed to feel intuitive, like an "inbuilt Excel sheet," but with the added power of AI, a secure database backend, and insightful analytics.

---

## Core Features

### 1. AI-Powered Lead Ingestion
- **Automated Data Parsing:** Simply paste raw, unstructured text from emails, messages, or notes into the AI Ingestion form. The application uses a Genkit AI flow to intelligently parse the text and automatically populate the fields for a new lead.
- **AI-Assisted Prioritization:** The AI also analyzes the lead text for urgency and value, automatically assigning a "High," "Medium," or "Low" priority to help you focus on the most important opportunities first.

### 2. Centralized Lead Management
- **Master Leads Table:** All leads are stored securely in a Firebase Firestore database and displayed in a central table. This table provides a comprehensive overview of every lead.
- **CRUD Operations:** You can easily **View**, **Edit**, and **Delete** any lead directly from the user interface. Changes are saved instantly to the database.

### 3. Smart, Filtered Views
To help you organize your workflow, the app includes several pre-built pages that act as smart filters on your master lead list:
- **Negotiation:** Shows only leads that are currently in the negotiation phase.
- **Regular:** Lists all recurring leads (e.g., weekly, monthly) to help you manage repeat business.
- **Follow Up:** This page acts as a to-do list, automatically flagging leads that have been inactive for more than 7 days, ensuring no opportunity goes stale.
- **Sample Updates:** Tracks the status of physical samples sent to clients.
- **Bin:** A view for all archived or "Dead" leads.

### 4. Analytics Dashboard
- The main "All Leads" page features a dashboard with key performance indicators (KPIs) and visual charts:
  - **Lead Stats:** At-a-glance counts of total, negotiating, regular, and dead leads.
  - **Leads by Type:** A pie chart breaking down leads by "Buyer" or "Seller".
  - **Lead Conversion Funnel:** A bar chart visualizing the distribution of leads across every status, from "New" to "Dead".

### 5. Data Export to CSV
- A dedicated "Data Export" page allows you to download all of your lead data from Firebase into a single CSV file with one click. This is perfect for backups, offline analysis in Excel, or data migration.

---

## Technology Stack

- **Frontend:** [Next.js](https://nextjs.org/) with React (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore) for real-time, scalable data storage.
- **Generative AI:** [Google's Genkit](https://firebase.google.com/docs/genkit) for the AI-powered parsing and prioritization features.
- **Hosting:** Deployed via [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

---

This application was prototyped and built in **Firebase Studio**, an AI-assisted development environment for creating modern web applications on the Firebase platform.