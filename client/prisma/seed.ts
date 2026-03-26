import { faker } from '@faker-js/faker';
 // Adjust path if needed
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Pool } from "pg";
import { PrismaClient } from '../app/generated/prisma';





console.log("--- Environment Check ---");
console.log("DATABASE_URL found:", process.env.DATABASE_URL ? "YES" : "NO");
console.log("Value length:", process.env.DATABASE_URL?.length || 0);
console.log("Current Directory:", process.cwd());
console.log("-------------------------");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the environment!");
}

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("Cleanup: Deleting old data...");
  await prisma.user.deleteMany();
  await prisma.game.deleteMany();
  await prisma.tag.deleteMany();

  // 1. Create Tags
const tagsData = [
  { label: "Competitive", color: "danger" },   // Red
  { label: "Casual", color: "success" },       // Green
  { label: "Mic Required", color: "primary" },   // Blue
  { label: "Beginner Friendly", color: "warning" }, // Yellow
  { label: "Ranked Only", color: "info" },      // Light Blue/Purple-ish
  { label: "Pro", color: "dark" },             // Black/Dark Gray
];

  const tags = await Promise.all(
    tagsData.map((tag) => prisma.tag.create({ data: tag }))
  );

  // 2. Create Games
  const gamesData = [
    {id:1, name: "Counter-Strike 2", genre: "FPS" },
    {id:2, name: "Minecraft", genre: "Sandbox" },
    {id:3, name: "League of Legends", genre: "MOBA" },
    {id:4, name: "Stardew Valley", genre: "Simulation" },
    {id:5, name: "Valorant", genre: "FPS" },
    {id:6, name: "Apex Legends", genre: "Battle Royale" },
    {id:7, name: "Overwatch 2", genre: "Hero Shooter" },
    {id:8, name: "Elden Ring", genre: "RPG" },
    {id:9, name: "Rocket League", genre: "Sports" },
    {id:10, name: "Dota 2", genre: "MOBA" },
  ];

  const games = await Promise.all(
    gamesData.map((game) => prisma.game.create({ data: game }))
  );

  // 3. Create Users
  console.log("Seeding 20 users...");
  for (let i = 0; i < 20; i++) {
    // Pick random games and tags for each user
    const randomGames = faker.helpers.arrayElements(games, { min: 1, max: 3 });
    const randomTags = faker.helpers.arrayElements(tags, { min: 1, max: 2 });

    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        gamerTag: faker.internet.username(),
        bio: faker.lorem.sentence(),
        playStyle: faker.helpers.arrayElement(["Aggressive", "Support", "Tactical", "Chill"]),
        // Connect the many-to-many relations
        games: {
          connect: randomGames.map(g => ({ id: g.id }))
        },
        tags: {
          connect: randomTags.map(t => ({ id: t.id }))
        }
      },
    });
  }

  console.log("Seeding complete! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });