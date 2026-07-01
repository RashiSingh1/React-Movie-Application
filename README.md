# 🎬 Movie Discovery App

A React-based movie search and discovery application that lets users find movies via the OMDb API and see real-time trending searches, powered by Appwrite.

**Live Demo:** [react-movie-application-eosin.vercel.app](https://react-movie-application-eosin.vercel.app)

## Features

- 🔍 **Movie Search** — Search for any movie by title using the OMDb API
- 📈 **Trending Movies** — A dynamic trending section that ranks movies based on real aggregated search activity, not a static list
- 🎨 **Responsive UI** — Clean, responsive interface built with React
- ⚡ **Fast Dev Experience** — Powered by Vite with Hot Module Replacement (HMR)

## How Trending Works

Every search a user makes is logged to an Appwrite database:
- If the search term already exists, its count is incremented
- If it's a new term, a document is created storing the search term, movie ID, and poster URL

The trending section then queries the **top 10 most-searched movies** (ordered by count, descending) to surface what's actually popular with users — making it a data-driven feature rather than hardcoded content.

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React + Vite |
| Movie Data | OMDb API |
| Backend/Database | Appwrite |
| Deployment | Vercel |

## Environment Variables

Create a `.env` file in the root directory with the following:

```
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
VITE_OMDB_API_KEY=your_omdb_api_key
```

> ⚠️ Note: Verify the exact OMDb API key variable name matches what's used in your search component.

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/RashiSingh1/React-Movie-Application.git
   cd React-Movie-Application
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Add your `.env` file (see Environment Variables above)

4. Run the development server
   ```bash
   npm run dev
   ```

## Deployment

This project is deployed on [Vercel](https://vercel.com). Push to `main` to trigger automatic redeployment.

## Author
**Rashi Singh**
