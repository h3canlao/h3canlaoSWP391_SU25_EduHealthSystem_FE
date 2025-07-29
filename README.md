# EduHealth System - School Health Management Platform

![EduHealth Logo](public/EduHealth.webp)

## Overview
EduHealth is a comprehensive school health management system designed to streamline health monitoring, vaccination tracking, and medical event management for educational institutions. The platform connects school nurses, administrators, and parents in a unified ecosystem to ensure student health and wellbeing.

## Features

### For School Nurses
- **Dashboard**: Monitor student health metrics and statistics
- **Health Checkups**: Schedule, record, and track student health checkups
- **Vaccination Management**: Schedule vaccinations and track immunization records
- **Health Event Tracking**: Document and manage health events including accidents, fever cases, and vaccine reactions
- **Medication Administration**: Track and administer medications provided by parents

### For Parents
- **Student Profiles**: Access and update health profiles for their children
- **Health Records**: View health checkup history and results
- **Vaccination Records**: Track vaccination history and upcoming schedules
- **Medication Requests**: Submit and track medication requests for their children
- **Health Event Notifications**: Receive alerts about health events affecting their children

### For Administrators
- **User Management**: Manage accounts for school staff, nurses, and parents
- **Checkup Campaign Management**: Create and schedule school-wide health checkups
- **Vaccination Campaign Management**: Plan and coordinate vaccination campaigns
- **Medical Supply Inventory**: Track medical supplies and medications

## Technology Stack
- **Frontend**: React 18 with Vite
- **UI Libraries**: 
  - Ant Design 5.25
  - React Bootstrap
  - Material UI components
- **State Management**: React Context API
- **Routing**: React Router DOM 6
- **Data Visualization**: Recharts
- **Authentication**: JWT
- **API Communication**: Axios
- **Form Components**: React Select, React DatePicker
- **Notification System**: React Toastify
- **Sidebar Navigation**: React Pro Sidebar

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- A compatible backend API service (see backend repository)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/h3canlaoSWP391_SU25_EduHealthSystem_FE.git
   cd h3canlaoSWP391_SU25_EduHealthSystem_FE
   ```

2. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Start the development server
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. The application will be available at `http://localhost:5173`

## Project Structure
```
src/
├── App.jsx              # Main application component
├── Router.jsx           # Route configuration
├── components/          # Reusable UI components
├── layouts/             # Layout templates
├── pages/               # Page components
│   ├── Admin/           # Admin dashboard and features
│   ├── Homepage.jsx     # Landing page
│   ├── Parents/         # Parent portal features
│   └── SchoolNurse/     # School nurse portal features
├── services/            # API service integrations
├── theme/               # Global styling
└── utils/               # Utility functions
```

## Build for Production

```
npm run build
```
or
```
yarn build
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgements
- SWP391 - FPT University
- Summer 2025 Software Engineering Project 