# Take Home Test - Frontend Vue TypeScript

## Overview
This project is a frontend implementation for Katekemi's take-home test, built with Vue.js and TypeScript. The application demonstrates data fetching, displaying data in tables, CRUD operations, and various UI features like pagination, sorting, and search functionality.

## Features

### Table View
- Display data from PokeAPI (Berry data)
- Sorting functionality (by name in ascending order)
- Real-time search functionality
- Pagination with options for 10, 30, or 50 items per page
- Persistent pagination and search state (survives page refresh)

### Data Operations
- View berry details
- Add new data (connected to Fake Store API)
- Edit existing data
- Delete data

### UI/UX Features
- Navigation between pages with a navbar
- Skeleton loading indicators for better UX
- Form validation
- Responsive design
- Success/error notifications

## Technologies Used
- Vue 3
- TypeScript
- Vue Router
- Composition API
- Fetch API for data fetching
- LocalStorage for state persistence
- CSS for styling (optional: Tailwind CSS, Bulma, etc.)

## API Endpoints
- Berry data: https://pokeapi.co/api/v2/berry/
- Product data: https://fakestoreapi.com/products

## Prerequisites
- Node.js (v14.x or higher)
- npm or yarn

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/syarifuzaki/take-home-test-fe-vue-typescript-katekemi.git
cd take-home-test-fe-vue-typescript-katekemi
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Access the application:
Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## Project Structure
```
/src
  /assets           # Static assets (CSS, images, etc.)
  /components       # Shared components (Navbar, Pagination, etc.)
  /views            # Page components
  /router           # Vue Router configuration
  /types            # TypeScript interfaces and types
  /services         # API service functions
  App.vue           # Root component
  main.ts           # Application entry point
```

## Development Tasks

### Soal 1 (First Task)
- Create two pages: List Table and Detail Page
- Implement navigation with a navbar
- Build a table with actions (Edit & Delete buttons)
- Implement sorting, pagination, and search
- Create Add/Edit functionality
- Implement persistence for page number and search
- Add a detail page with dropdown selection
- Implement skeleton loading

### Soal 2 (Second Task)
- Display a table with pagination and search
- Implement sorting by name
- Add a Detail button in the actions column
- Implement optional persistence features

Developed by Syarifuz Zaki for Katekemi take-home test