# Danafdr Portfolio

A highly-custom, premium portfolio for a web developer and video editor/motion graphics designer. The aesthetic is heavily inspired by cinematic title sequences, brutalism, and high-end SaaS product motion.

## 🚀 Live Site
*(Add your vercel link here)*

## 🎬 Features
- **Film Reel Scroll Architecture**: A custom dual-axis snap scrolling engine (vertical between categories, horizontal within categories) that feels like a physical film reel, heavily inspired by cinematic UI.
- **Automated Age Engine**: Dynamically calculates age based on a birthdate, ensuring zero-maintenance profile updates.
- **Smooth GSAP Motion**: Uses GSAP and ScrollTrigger for buttery smooth entrance animations and micro-interactions that feel heavy and deliberate.
- **Admin Dashboard (CMS)**: Fully secure, custom-built CMS backend using Prisma and PostgreSQL to manage projects, photos, and homepage content dynamically without touching the code.
- **Dynamic Projects & Photography**: Pulls directly from the database to render responsive photo grids, project lightboxes, and web development case studies.

## 🛠 Tech Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [GSAP](https://gsap.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Font Stack**: Playfair Display (Serif), Bebas Neue (Display), Geist (Sans), Geist Mono.

## 💻 Local Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up your `.env` file with your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
ADMIN_PASSWORD="your-secure-password"
```
4. Push the schema to your database:
```bash
npx prisma db push
```
5. Run the development server:
```bash
npm run dev
```
6. Open [http://localhost:3000](http://localhost:3000)

## 🎨 Design Philosophy
- **"Web dev with the eye of a video editor."**
- **Type-heavy**: Distressed brutalist monospaces paired with elegant serifs.
- **No pure blacks**: Uses custom deep ink (`#0f0e0b`) and off-white paper (`#f0ebe2`) for eye-pleasing contrast.
- **Motion**: Not "bouncy", but "deliberate". Transitions should feel like cuts in a film.
