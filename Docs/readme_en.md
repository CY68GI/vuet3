# Vue 3 + TypeScript + Vite

[中文](../README.md) | [English](./readme_en.md)

## ⚠️ Important Statement:

> **🚨 Important Note: This project is ONLY for learning Vue 3, has NO other purpose, please IGNORE if you see it!**
>
> This project contains no sensitive data, all data is simulated and used only for demonstrating Vue 3 features and component development.

## English Description

This is a frontend project built with Vue 3 + TypeScript + Vite, primarily for learning and demonstrating Vue 3 core features and component development. The project implements a "Website Browsing Data Management System" interface, showcasing Vue 3's Composition API, component communication, and responsive data management capabilities.

### Key Features

- **Filtering**: Supports filtering by keywords, date range, website category, and time format
- **Data Table**: Displays website browsing data with row selection, editing, and deletion capabilities
- **Pagination**: Smart pagination navigation with page jumping and items per page adjustment
- **Responsive Design**: Adapts to different screen sizes with good mobile experience
- **Component-based Development**: Uses component-based architecture for better code reusability and maintainability

### Tech Stack

- **Frontend Framework**: Vue 3
- **Development Language**: TypeScript
- **Build Tool**: Vite
- **Component Specification**: Vue 3 `<script setup>` syntax
- **Reactive API**: Composition API (ref, reactive, computed, watch, etc.)

### Project Structure

```
vue_t3/
├── src/
│   ├── components/    # Component directory
│   │   ├── ActionButton.vue    # Action button component
│   │   ├── DataTable.vue       # Data table component
│   │   ├── FilterBar.vue       # Filter bar component
│   │   ├── PaginationBar.vue   # Pagination bar component
│   │   ├── TableRow.vue        # Table row component
│   │   └── HelloWorld.vue      # Example component
│   ├── App.vue                 # Root application component
│   ├── main.ts                 # Application entry file
│   └── ...                     # Other configuration files
├── index.html                  # HTML template
└── ...                         # Other project files
```

### Component Description

- **FilterBar.vue**: Provides data filtering functionality including search, date range, website category selection, and time format settings
- **DataTable.vue**: Displays data table with filtering, pagination, selection, editing, and deletion capabilities
- **PaginationBar.vue**: Provides pagination navigation with page selection, jumping, and items per page adjustment
- **TableRow.vue**: Table row component displaying single row data and action buttons
- **ActionButton.vue**: Customizable button component with type, size, and icon options

## Usage Instructions

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Important Notes

- This project is only for learning and demonstrating Vue 3 technology and does not contain any actual business logic
- All data is simulated and does not contain any sensitive information
- The "Website Browsing Data Management System" interface in this project is designed only to demonstrate Vue 3 features and does not represent any real system
- Please do not use this project for production environments or commercial purposes
