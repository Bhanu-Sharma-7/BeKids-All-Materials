import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SEED_VERBS = [
  {
    id: 'go',
    verb: 'Go',
    category: 'Irregular',
    v1: 'go',
    v2: 'went',
    v3: 'gone',
    v4: 'going',
    v5: 'goes',
    hindiMeaning: 'जाना',
    hindiTransliteration: '(jaana)',
    phoneticEnglish: '/ɡoʊ/',
    explanation: 'To move or travel from one place to another. It implies departing from a current location towards a destination.',
    examples: [
      { sentence: 'I go to school every day.', tense: 'Present Habit (V1)', formType: 'V1', highlightWord: 'I go', orderIndex: 0 },
      { sentence: 'She went to the store yesterday.', tense: 'Completed Action (V2)', formType: 'V2', highlightWord: 'She went', orderIndex: 1 },
      { sentence: 'They have gone home already.', tense: 'Present Perfect (V3)', formType: 'V3', highlightWord: 'They have gone', orderIndex: 2 },
      { sentence: 'We are going to the park now.', tense: 'Continuous Action (V4)', formType: 'V4', highlightWord: 'We are going', orderIndex: 3 },
      { sentence: 'He goes to the library on weekends.', tense: 'Third Person Singular (V5)', formType: 'V5', highlightWord: 'He goes', orderIndex: 4 },
    ],
    usageRules: [
      { form: 'go', name: 'Base Form (V1)', usageContext: "Simple present tense (I/You/We/They), future tense with 'will', and infinitives (to go).", highlighted: true, orderIndex: 0 },
      { form: 'went', name: 'Past Tense (V2)', usageContext: 'Simple past tense for completed actions in the past.', highlighted: false, orderIndex: 1 },
      { form: 'gone', name: 'Past Participle (V3)', usageContext: 'Perfect tenses (has/have/had gone) and passive voice constructions.', highlighted: false, orderIndex: 2 },
      { form: 'going', name: 'Present Participle (V4)', usageContext: 'Continuous/progressive tenses (is/are/am going) and as a gerund.', highlighted: false, orderIndex: 3 },
      { form: 'goes', name: 'Third-Person (V5)', usageContext: 'Simple present tense for singular subjects (He/She/It).', highlighted: false, orderIndex: 4 },
    ],
  },
  {
    id: 'be',
    verb: 'Be',
    category: 'Irregular',
    v1: 'be / am, is, are',
    v2: 'was, were',
    v3: 'been',
    v4: 'being',
    v5: 'is',
    hindiMeaning: 'होना / रहना',
    hindiTransliteration: '(hona / rahna)',
    phoneticEnglish: '/biː/',
    explanation: 'To exist, live, or have a specific state, identity, or characteristic. It is the most fundamental linking verb in English.',
    examples: [
      { sentence: 'I am always happy to learn new words.', tense: 'Simple Present (V1)', formType: 'V1', highlightWord: 'I am', orderIndex: 0 },
      { sentence: 'They were excited about the science fair.', tense: 'Simple Past (V2)', formType: 'V2', highlightWord: 'They were', orderIndex: 1 },
      { sentence: 'She has been a teacher for five years.', tense: 'Present Perfect (V3)', formType: 'V3', highlightWord: 'has been', orderIndex: 2 },
      { sentence: 'The student is being very respectful.', tense: 'Present Continuous (V4)', formType: 'V4', highlightWord: 'is being', orderIndex: 3 },
      { sentence: 'English is a wonderful language to learn.', tense: 'Third Person Singular (V5)', formType: 'V5', highlightWord: 'is', orderIndex: 4 },
    ],
    usageRules: [
      { form: 'be (am/are)', name: 'Base / Present (V1)', usageContext: 'Used for identity, state of being, and forming continuous tenses.', highlighted: true, orderIndex: 0 },
      { form: 'was / were', name: 'Past Tense (V2)', usageContext: 'Was for singular subjects; were for plural subjects and you.', highlighted: false, orderIndex: 1 },
      { form: 'been', name: 'Past Participle (V3)', usageContext: 'Used with auxiliary have/has/had in all perfect tenses.', highlighted: false, orderIndex: 2 },
      { form: 'being', name: 'Gerund / Participle (V4)', usageContext: 'Used in continuous passive voice and as verbal nouns.', highlighted: false, orderIndex: 3 },
      { form: 'is', name: 'Third-Person Singular (V5)', usageContext: 'Simple present tense with He, She, It, or singular nouns.', highlighted: false, orderIndex: 4 },
    ],
  },
  {
    id: 'have',
    verb: 'Have',
    category: 'Irregular',
    v1: 'have',
    v2: 'had',
    v3: 'had',
    v4: 'having',
    v5: 'has',
    hindiMeaning: 'पास होना / रखना',
    hindiTransliteration: '(paas hona / rakhna)',
    phoneticEnglish: '/hæv/',
    explanation: 'To possess, own, hold, or experience something. Also functions as an essential auxiliary verb for perfect tenses.',
    examples: [
      { sentence: 'We have a colorful grammar book.', tense: 'Simple Present (V1)', formType: 'V1', highlightWord: 'We have', orderIndex: 0 },
      { sentence: 'She had breakfast early this morning.', tense: 'Simple Past (V2)', formType: 'V2', highlightWord: 'She had', orderIndex: 1 },
      { sentence: 'They had had enough practice before the test.', tense: 'Past Perfect (V3)', formType: 'V3', highlightWord: 'had had', orderIndex: 2 },
      { sentence: 'He is having a great time studying grammar.', tense: 'Continuous Aspect (V4)', formType: 'V4', highlightWord: 'is having', orderIndex: 3 },
      { sentence: 'Rohan has three notebooks for English.', tense: 'Third Person Singular (V5)', formType: 'V5', highlightWord: 'Rohan has', orderIndex: 4 },
    ],
    usageRules: [
      { form: 'have', name: 'Base Form (V1)', usageContext: 'Possession in present tense with I/You/We/They; auxiliary for present perfect.', highlighted: true, orderIndex: 0 },
      { form: 'had', name: 'Past Tense (V2)', usageContext: 'Completed possession or experience in the simple past.', highlighted: false, orderIndex: 1 },
      { form: 'had', name: 'Past Participle (V3)', usageContext: 'Used with auxiliary have/has/had in perfect constructions.', highlighted: false, orderIndex: 2 },
      { form: 'having', name: 'Present Participle (V4)', usageContext: 'Experiencing or doing an activity in progress.', highlighted: false, orderIndex: 3 },
      { form: 'has', name: 'Third-Person (V5)', usageContext: 'Simple present tense with He/She/It singular subjects.', highlighted: false, orderIndex: 4 },
    ],
  },
  {
    id: 'eat',
    verb: 'Eat',
    category: 'Irregular',
    v1: 'eat',
    v2: 'ate',
    v3: 'eaten',
    v4: 'eating',
    v5: 'eats',
    hindiMeaning: 'खाना',
    hindiTransliteration: '(khaana)',
    phoneticEnglish: '/iːt/',
    explanation: 'To put food into the mouth, chew, and swallow it as nourishment.',
    examples: [
      { sentence: 'Children eat fresh fruits for good health.', tense: 'Simple Present (V1)', formType: 'V1', highlightWord: 'Children eat', orderIndex: 0 },
      { sentence: 'Aarav ate an apple at lunch.', tense: 'Simple Past (V2)', formType: 'V2', highlightWord: 'Aarav ate', orderIndex: 1 },
      { sentence: 'We have eaten dinner together.', tense: 'Present Perfect (V3)', formType: 'V3', highlightWord: 'have eaten', orderIndex: 2 },
      { sentence: 'She is eating her breakfast right now.', tense: 'Present Continuous (V4)', formType: 'V4', highlightWord: 'is eating', orderIndex: 3 },
      { sentence: 'The baby eats soft porridge happily.', tense: 'Third Person (V5)', formType: 'V5', highlightWord: 'The baby eats', orderIndex: 4 },
    ],
    usageRules: [
      { form: 'eat', name: 'Base Form (V1)', usageContext: 'Routine actions in simple present and following modal verbs (can eat).', highlighted: true, orderIndex: 0 },
      { form: 'ate', name: 'Past Tense (V2)', usageContext: 'Specific completed past eating events.', highlighted: false, orderIndex: 1 },
      { form: 'eaten', name: 'Past Participle (V3)', usageContext: 'Used with have/has/had for completed consumption states.', highlighted: false, orderIndex: 2 },
      { form: 'eating', name: 'Present Participle (V4)', usageContext: 'Ongoing action of consuming food.', highlighted: false, orderIndex: 3 },
      { form: 'eats', name: 'Third-Person (V5)', usageContext: 'Present tense with singular subjects (He/She/It/Name).', highlighted: false, orderIndex: 4 },
    ],
  },
  {
    id: 'write',
    verb: 'Write',
    category: 'Irregular',
    v1: 'write',
    v2: 'wrote',
    v3: 'written',
    v4: 'writing',
    v5: 'writes',
    hindiMeaning: 'लिखना',
    hindiTransliteration: '(likhna)',
    phoneticEnglish: '/raɪt/',
    explanation: 'To mark letters, words, or symbols on paper or digital media with a pen, pencil, or keyboard.',
    examples: [
      { sentence: 'I write my daily diary before bed.', tense: 'Simple Present (V1)', formType: 'V1', highlightWord: 'I write', orderIndex: 0 },
      { sentence: 'Priya wrote a beautiful poem yesterday.', tense: 'Simple Past (V2)', formType: 'V2', highlightWord: 'Priya wrote', orderIndex: 1 },
      { sentence: 'He has written all his answers neatly.', tense: 'Present Perfect (V3)', formType: 'V3', highlightWord: 'has written', orderIndex: 2 },
      { sentence: 'The teacher is writing on the whiteboard.', tense: 'Present Continuous (V4)', formType: 'V4', highlightWord: 'is writing', orderIndex: 3 },
      { sentence: 'She writes English essays with great clarity.', tense: 'Third Person (V5)', formType: 'V5', highlightWord: 'She writes', orderIndex: 4 },
    ],
    usageRules: [
      { form: 'write', name: 'Base Form (V1)', usageContext: 'Present habitual action and infinitive purpose (to write).', highlighted: true, orderIndex: 0 },
      { form: 'wrote', name: 'Past Tense (V2)', usageContext: 'Actions completed in the past time frame.', highlighted: false, orderIndex: 1 },
      { form: 'written', name: 'Past Participle (V3)', usageContext: 'Perfect tenses and passive voice (The letter was written).', highlighted: false, orderIndex: 2 },
      { form: 'writing', name: 'Present Participle (V4)', usageContext: 'Ongoing authoring process or gerund noun.', highlighted: false, orderIndex: 3 },
      { form: 'writes', name: 'Third-Person (V5)', usageContext: 'Singular third person present habitual statement.', highlighted: false, orderIndex: 4 },
    ],
  },
  {
    id: 'read',
    verb: 'Read',
    category: 'Irregular',
    v1: 'read',
    v2: 'read',
    v3: 'read',
    v4: 'reading',
    v5: 'reads',
    hindiMeaning: 'पढ़ना',
    hindiTransliteration: '(padhna)',
    phoneticEnglish: '/riːd/ (Past: /rɛd/)',
    explanation: 'To look at and comprehend the meaning of written or printed words and symbols.',
    examples: [
      { sentence: 'We read storybooks every evening.', tense: 'Simple Present (V1)', formType: 'V1', highlightWord: 'We read', orderIndex: 0 },
      { sentence: 'Ananya read an inspiring chapter last night.', tense: 'Simple Past (V2)', formType: 'V2', highlightWord: 'Ananya read', orderIndex: 1 },
      { sentence: 'I have read this grammar lesson twice.', tense: 'Present Perfect (V3)', formType: 'V3', highlightWord: 'have read', orderIndex: 2 },
      { sentence: 'Students are reading aloud in class.', tense: 'Present Continuous (V4)', formType: 'V4', highlightWord: 'are reading', orderIndex: 3 },
      { sentence: 'Karan reads news articles every morning.', tense: 'Third Person (V5)', formType: 'V5', highlightWord: 'Karan reads', orderIndex: 4 },
    ],
    usageRules: [
      { form: 'read (/riːd/)', name: 'Base Form (V1)', usageContext: 'Pronounced "reed" in present tense and infinitives.', highlighted: true, orderIndex: 0 },
      { form: 'read (/rɛd/)', name: 'Past Tense (V2)', usageContext: 'Spelled the same, but pronounced "red" for past actions.', highlighted: false, orderIndex: 1 },
      { form: 'read (/rɛd/)', name: 'Past Participle (V3)', usageContext: 'Spelled the same, pronounced "red" in perfect tenses.', highlighted: false, orderIndex: 2 },
      { form: 'reading', name: 'Present Participle (V4)', usageContext: 'Current reading activity or as a subject gerund.', highlighted: false, orderIndex: 3 },
      { form: 'reads', name: 'Third-Person (V5)', usageContext: 'Pronounced "reeds" for singular third-person subjects.', highlighted: false, orderIndex: 4 },
    ],
  },
  {
    id: 'come',
    verb: 'Come',
    category: 'Irregular',
    v1: 'come',
    v2: 'came',
    v3: 'come',
    v4: 'coming',
    v5: 'comes',
    hindiMeaning: 'आना',
    hindiTransliteration: '(aana)',
    phoneticEnglish: '/kʌm/',
    explanation: 'To move or travel towards the speaker or a designated location.',
    examples: [
      { sentence: 'Friends come over to study together.', tense: 'Simple Present (V1)', formType: 'V1', highlightWord: 'Friends come', orderIndex: 0 },
      { sentence: 'The mentor came on time today.', tense: 'Simple Past (V2)', formType: 'V2', highlightWord: 'The mentor came', orderIndex: 1 },
      { sentence: 'The package has come at last.', tense: 'Present Perfect (V3)', formType: 'V3', highlightWord: 'has come', orderIndex: 2 },
      { sentence: 'The bus is coming down the road.', tense: 'Present Continuous (V4)', formType: 'V4', highlightWord: 'is coming', orderIndex: 3 },
      { sentence: 'Spring comes with fresh blooming flowers.', tense: 'Third Person (V5)', formType: 'V5', highlightWord: 'Spring comes', orderIndex: 4 },
    ],
    usageRules: [
      { form: 'come', name: 'Base Form (V1)', usageContext: 'General arrival or approach towards a location.', highlighted: true, orderIndex: 0 },
      { form: 'came', name: 'Past Tense (V2)', usageContext: 'Arrival that occurred at a specified past moment.', highlighted: false, orderIndex: 1 },
      { form: 'come', name: 'Past Participle (V3)', usageContext: 'Identical spelling to V1; used in perfect tenses.', highlighted: false, orderIndex: 2 },
      { form: 'coming', name: 'Present Participle (V4)', usageContext: 'Approaching progress in real time.', highlighted: false, orderIndex: 3 },
      { form: 'comes', name: 'Third-Person (V5)', usageContext: 'Singular subject habitual arrival.', highlighted: false, orderIndex: 4 },
    ],
  },
  {
    id: 'play',
    verb: 'Play',
    category: 'Regular',
    v1: 'play',
    v2: 'played',
    v3: 'played',
    v4: 'playing',
    v5: 'plays',
    hindiMeaning: 'खेलना / बजाना',
    hindiTransliteration: '(khelna / bajaana)',
    phoneticEnglish: '/pleɪ/',
    explanation: 'To engage in activity for enjoyment and recreation, or to perform on a musical instrument.',
    examples: [
      { sentence: 'We play grammar games during English club.', tense: 'Simple Present (V1)', formType: 'V1', highlightWord: 'We play', orderIndex: 0 },
      { sentence: 'They played football after class yesterday.', tense: 'Simple Past (V2)', formType: 'V2', highlightWord: 'They played', orderIndex: 1 },
      { sentence: 'Our team has played three wonderful matches.', tense: 'Present Perfect (V3)', formType: 'V3', highlightWord: 'has played', orderIndex: 2 },
      { sentence: 'The children are playing joyfully in the garden.', tense: 'Present Continuous (V4)', formType: 'V4', highlightWord: 'are playing', orderIndex: 3 },
      { sentence: 'Maya plays the acoustic guitar skillfully.', tense: 'Third Person (V5)', formType: 'V5', highlightWord: 'Maya plays', orderIndex: 4 },
    ],
    usageRules: [
      { form: 'play', name: 'Base Form (V1)', usageContext: 'Regular verb base form for sports, games, and music.', highlighted: true, orderIndex: 0 },
      { form: 'played', name: 'Past Tense (V2)', usageContext: 'Regular past formation with standard "-ed" suffix.', highlighted: false, orderIndex: 1 },
      { form: 'played', name: 'Past Participle (V3)', usageContext: 'Regular past participle with standard "-ed" suffix.', highlighted: false, orderIndex: 2 },
      { form: 'playing', name: 'Present Participle (V4)', usageContext: 'Active ongoing recreation or performance.', highlighted: false, orderIndex: 3 },
      { form: 'plays', name: 'Third-Person (V5)', usageContext: 'Third-person singular present form with "-s" suffix.', highlighted: false, orderIndex: 4 },
    ],
  },
  {
    id: 'study',
    verb: 'Study',
    category: 'Regular',
    v1: 'study',
    v2: 'studied',
    v3: 'studied',
    v4: 'studying',
    v5: 'studies',
    hindiMeaning: 'पढ़ना / अध्ययन करना',
    hindiTransliteration: '(padhna / adhyayan karna)',
    phoneticEnglish: '/ˈstʌdi/',
    explanation: 'To devote time and attention to acquiring knowledge on an academic subject or language.',
    examples: [
      { sentence: 'Diligent students study vocabulary daily.', tense: 'Simple Present (V1)', formType: 'V1', highlightWord: 'students study', orderIndex: 0 },
      { sentence: 'Rahul studied hard for his English assessment.', tense: 'Simple Past (V2)', formType: 'V2', highlightWord: 'Rahul studied', orderIndex: 1 },
      { sentence: 'She has studied all 50 essential verb forms.', tense: 'Present Perfect (V3)', formType: 'V3', highlightWord: 'has studied', orderIndex: 2 },
      { sentence: 'We are studying English grammar with BeKids.', tense: 'Present Continuous (V4)', formType: 'V4', highlightWord: 'are studying', orderIndex: 3 },
      { sentence: 'He studies English for thirty minutes every day.', tense: 'Third Person (V5)', formType: 'V5', highlightWord: 'He studies', orderIndex: 4 },
    ],
    usageRules: [
      { form: 'study', name: 'Base Form (V1)', usageContext: 'Base form ending in consonant + "y".', highlighted: true, orderIndex: 0 },
      { form: 'studied', name: 'Past Tense (V2)', usageContext: 'Changes "y" to "i" before adding "-ed".', highlighted: false, orderIndex: 1 },
      { form: 'studied', name: 'Past Participle (V3)', usageContext: 'Used with auxiliary have/has in perfect tenses.', highlighted: false, orderIndex: 2 },
      { form: 'studying', name: 'Present Participle (V4)', usageContext: 'Retains "y" when adding "-ing" (studying).', highlighted: false, orderIndex: 3 },
      { form: 'studies', name: 'Third-Person (V5)', usageContext: 'Changes "y" to "ies" in third-person singular present.', highlighted: false, orderIndex: 4 },
    ],
  },
  {
    id: 'work',
    verb: 'Work',
    category: 'Regular',
    v1: 'work',
    v2: 'worked',
    v3: 'worked',
    v4: 'working',
    v5: 'works',
    hindiMeaning: 'काम करना / कार्य करना',
    hindiTransliteration: '(kaam karna)',
    phoneticEnglish: '/wɜːrk/',
    explanation: 'To engage in physical or mental activity to achieve a purpose or result.',
    examples: [
      { sentence: 'They work diligently to improve their grammar skills.', tense: 'Simple Present (V1)', formType: 'V1', highlightWord: 'They work', orderIndex: 0 },
      { sentence: 'Tanvi worked on her vocabulary project yesterday.', tense: 'Simple Past (V2)', formType: 'V2', highlightWord: 'Tanvi worked', orderIndex: 1 },
      { sentence: 'We have worked through all the interactive lessons.', tense: 'Present Perfect (V3)', formType: 'V3', highlightWord: 'have worked', orderIndex: 2 },
      { sentence: 'The learning engine is working seamlessly.', tense: 'Present Continuous (V4)', formType: 'V4', highlightWord: 'is working', orderIndex: 3 },
      { sentence: 'Practice works wonders for language learners.', tense: 'Third Person (V5)', formType: 'V5', highlightWord: 'Practice works', orderIndex: 4 },
    ],
    usageRules: [
      { form: 'work', name: 'Base Form (V1)', usageContext: 'Regular verb base form used for occupational and purposeful tasks.', highlighted: true, orderIndex: 0 },
      { form: 'worked', name: 'Past Tense (V2)', usageContext: 'Standard regular past form with "-ed".', highlighted: false, orderIndex: 1 },
      { form: 'worked', name: 'Past Participle (V3)', usageContext: 'Used in past and present perfect aspect constructions.', highlighted: false, orderIndex: 2 },
      { form: 'working', name: 'Present Participle (V4)', usageContext: 'Continuous effort or functioning state.', highlighted: false, orderIndex: 3 },
      { form: 'works', name: 'Third-Person (V5)', usageContext: 'Standard "-s" suffix for third-person singular present.', highlighted: false, orderIndex: 4 },
    ],
  },
];

async function main() {
  console.log('Seeding BeKids SQLite database...');

  // 1. Seed demo user: AlexStudent
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { username: 'AlexStudent' },
    update: {
      email: 'alex.johnson@example.com',
      fullName: 'Alex Johnson',
      passwordHash,
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    create: {
      username: 'AlexStudent',
      email: 'alex.johnson@example.com',
      fullName: 'Alex Johnson',
      passwordHash,
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
  });
  console.log(`✓ Seeded demo user: ${user.username} (${user.email})`);

  // 2. Seed Verbs with Examples and Usage Rules
  for (const verbData of SEED_VERBS) {
    const { examples, usageRules, ...verbFields } = verbData;

    await prisma.verb.upsert({
      where: { id: verbFields.id },
      update: {
        ...verbFields,
      },
      create: {
        ...verbFields,
      },
    });

    // Replace examples
    await prisma.verbExample.deleteMany({ where: { verbId: verbFields.id } });
    await prisma.verbExample.createMany({
      data: examples.map((ex) => ({
        verbId: verbFields.id,
        sentence: ex.sentence,
        tense: ex.tense,
        formType: ex.formType,
        highlightWord: ex.highlightWord,
        orderIndex: ex.orderIndex,
      })),
    });

    // Replace usage rules
    await prisma.verbUsageRule.deleteMany({ where: { verbId: verbFields.id } });
    await prisma.verbUsageRule.createMany({
      data: usageRules.map((ur) => ({
        verbId: verbFields.id,
        form: ur.form,
        name: ur.name,
        usageContext: ur.usageContext,
        highlighted: ur.highlighted,
        orderIndex: ur.orderIndex,
      })),
    });

    console.log(`✓ Seeded verb: ${verbFields.verb} (${verbFields.id}) with ${examples.length} examples and ${usageRules.length} rules`);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
