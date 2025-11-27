// scripts/seed.js

import { connectDB } from "../lib/db.js";
import Photo from "../models/Photo.js";

async function seed() {
  await connectDB();
  const count = await Photo.countDocuments();
  if (count > 0) {
    console.log("Database already seeded.");
    process.exit(0);
  }

  const base = [
    {
      imageUrl: "/Addis Ababa-piassa.jpg",
      title: "Piassa in 1969",
      history: "A busy street in Piassa, 1969.",
      approved: true,
    },
    {
      imageUrl: "/EthiopianModel.jpg",
      title: "13 months of sunshine",
      history: "A memory from the sunlit days.",
      approved: true,
    },
    {
      imageUrl: "/Mekuriawithgebre.jpg",
      title: "Mekuria the Lion",
      history: "",
      approved: true,
    },
    {
      imageUrl: "/Ethiopia_Eritrean.jpg",
      title: "University students in 1970",
      history: "",
      approved: true,
    },
    // using the uploaded image path exactly as you requested (local path)
    {
      imageUrl: "/OldschoolHabeshawedding.jpg",
      title: "Ethiopian ertriean wedding",
      history: "Nostalgic memory of Ethiopian and Ertriean families.",
      approved: true,
    },
  ];

  await Photo.insertMany(base);
  console.log("Seeded initial photos.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
