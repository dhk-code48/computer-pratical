const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const database = new PrismaClient();

async function main() {
  try {
    await database.user.create({
      data: {
        id: "thisisrandomId",
        name: "Darshan Dhakal",
        email: "dhk.darshan48@gmail.com",
        emailVerified: true,
        password: "thesun123",
        image: "",
      },
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
