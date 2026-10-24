# PulseFit - Fullstack Next.js App

This is the Next.js fullstack application for Pulse Fitness Studio.

## Scripts

- `npm run dev` - Run development server on port 3000
- `npm run build` - Build production bundle with Turbopack
- `npm run start` - Start production server
- `npm run seed` - Run PostgreSQL seed script
- `npm run lint` - Oxlint linter check

## Environment Variables

Create `.env.local` based on `.env.example`:
```env
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require
JWT_SECRET=your-secret-key-here
```
