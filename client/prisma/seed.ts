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
  await prisma.message.deleteMany();
  await prisma.invite.deleteMany();
  await prisma.messageInstance.deleteMany();
  await prisma.user.deleteMany();
  await prisma.game.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.tag.deleteMany();

  // 1. Create Genres
  const genresData = [
    { name: "FPS",          color: "danger" },
    { name: "MOBA",         color: "primary" },
    { name: "Sandbox",      color: "success" },
    { name: "Simulation",   color: "info" },
    { name: "Battle Royale",color: "warning" },
    { name: "Hero Shooter", color: "secondary" },
    { name: "RPG",          color: "dark" },
    { name: "Sports",       color: "success" },
  ];

  const genres = await Promise.all(
    genresData.map((g) => prisma.genre.create({ data: g }))
  );

  const genreMap = new Map(genres.map((g) => [g.name, g.id]));

  // 2. Create Tags
  const tagsData = [
    { label: "Competitive",       color: "danger" },
    { label: "Casual",            color: "success" },
    { label: "Mic Required",      color: "primary" },
    { label: "Beginner Friendly", color: "warning" },
    { label: "Ranked Only",       color: "info" },
    { label: "Pro",               color: "dark" },
  ];

  const tags = await Promise.all(
    tagsData.map((tag) => prisma.tag.create({ data: tag }))
  );

  // 3. Create Games (connect to Genre relation)
  const gamesData = [
    { name: "Counter-Strike 2", genreName: "FPS" },
    { name: "Minecraft",        genreName: "Sandbox" },
    { name: "League of Legends",genreName: "MOBA" },
    { name: "Stardew Valley",   genreName: "Simulation" },
    { name: "Valorant",         genreName: "FPS" },
    { name: "Apex Legends",     genreName: "Battle Royale" },
    { name: "Overwatch 2",      genreName: "Hero Shooter" },
    { name: "Elden Ring",       genreName: "RPG" },
    { name: "Rocket League",    genreName: "Sports" },
    { name: "Dota 2",           genreName: "MOBA" },
  ];

  const games = await Promise.all(
    gamesData.map(({ name, genreName }) =>
      prisma.game.create({
        data: {
          name,
          genres: { connect: { id: genreMap.get(genreName)! } },
        },
      })
    )
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