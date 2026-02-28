import prisma from './src/db/prisma.js';

const insights = [
    {
        title: "The Importance of Consistent Medication Timing",
        content: "Taking your medications at the same time every day helps maintain a steady level of the drug in your bloodstream. This consistency is crucial for managing chronic conditions effectively and preventing flare-ups.",
    },
    {
        title: "Understanding Drug-Food Interactions",
        content: "Did you know that certain foods can affect how your medication works? For example, grapefruit juice can interfere with some cholesterol medications. Always check your prescription label or ask your pharmacist about food interactions.",
    },
    {
        title: "Staying Hydrated with Your Routine",
        content: "Many medications require adequate hydration to be processed effectively by your kidneys and liver. Make it a habit to drink a full glass of water with every dose unless directed otherwise.",
    }
];

async function main() {
    console.log('Seeding initial ' + insights.length + ' insights...');

    // Find an admin or any user to assign as author
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error('No user found to assign as author. Please register a user first.');
        return;
    }

    for (const insight of insights) {
        await prisma.post.create({
            data: {
                ...insight,
                user_id: user.id
            }
        });
    }

    console.log('Seed successful!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
