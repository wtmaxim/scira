import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Création d'exemples de recherches et de réponses
  const search1 = await prisma.search.create({
    data: {
      query: "Quelle est la capitale de la France?",
      groupId: "web",
      responses: {
        create: [
          {
            content: "La capitale de la France est Paris.",
            toolsUsed: ["web_search"],
            metadata: {
              sources: [
                "https://fr.wikipedia.org/wiki/Paris"
              ]
            }
          }
        ]
      }
    }
  });

  const search2 = await prisma.search.create({
    data: {
      query: "Comment fonctionne l'énergie solaire?",
      groupId: "academic",
      responses: {
        create: [
          {
            content: "L'énergie solaire fonctionne par la conversion de la lumière du soleil en électricité à travers des panneaux photovoltaïques qui contiennent des cellules solaires.",
            toolsUsed: ["academic_search"],
            metadata: {
              sources: [
                "https://fr.wikipedia.org/wiki/Énergie_solaire",
                "https://www.sciencedirect.com/science/article/pii/S1364032115016652"
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Seed completed successfully');
  console.log({ search1, search2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 