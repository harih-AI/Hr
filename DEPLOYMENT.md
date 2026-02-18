# NexusHR AI Deployment Guide

This project is now configured for a high-performance production deployment. The backend serves the frontend as a single optimized bundle.

## 1. Production Credentials
Ensure your `backend/.env` file contains the correct production keys:
- `OPENROUTER_API_KEY`: Your OpenRouter production key.
- `NODE_ENV`: Should be `production`.
- `PORT`: Usually provided by the hosting environment (e.g., 3001).

## 2. One-Command Build
To build both frontend and backend for production from the root directory:
```bash
npm run build
```

## 3. Launch the Application
Start the production server:
```bash
npm start
```
The application will be available at your server's IP/domain on the specified port.

## 4. Database Persistence
The application uses **SQLite** for production-grade data persistence.
- A file named `talentscout.db` will be created in the `backend/data/` directory.
- For cloud deployments (Docker/AWS/Railway), ensure the `/app/data` folder is mapped to a **Persistent Volume**.

## 5. File Persistence
Ensure the `backend/data/uploads` directory is also mapped to the same persistent volume.

## 6. Deployment Options
- **Docker**: Create a Dockerfile that runs `npm run build` and then `npm start`.
- **Cloud Providers**: You can push this folder to DigitalOcean, Azure, or AWS.
- **Railway (Recommended)**: 
    1. Connect your GitHub repository.
    2. Railway will detect the monorepo and run `npm run build` & `npm start`.
    3. Go to **Settings** -> **Variables** and add `OPENROUTER_API_KEY`.
    4. Go to **Settings** -> **Volumes** -> **Add Volume**.
    5. Set **Mount Path** to `/app/data`. This will persist both your database and uploaded resumes.
