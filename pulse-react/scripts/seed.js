// Seed script to populate the Neon Postgres database with Week 2 hardcoded data
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env or .env.local
const envLocalPath = join(__dirname, '..', '.env.local');
const envPath = join(__dirname, '..', '.env');
if (existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config({ path: envPath });
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL is not defined in .env or .env.local');
  console.error('Please create a .env.local file in the pulse-react directory with your Neon connection string:');
  console.error('DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Week 2 Data
const CLASSES = [
  {
    id: 1,
    title: 'HIIT Blast',
    category: 'HIIT',
    time: '6:00 AM',
    days: ['Mon', 'Wed', 'Fri'],
    duration: '45 min',
    trainer: 'Dani Reyes',
    spotsAvailable: 6,
    description: 'High-intensity interval training designed to torch calories and build stamina.',
    tagColor: 'bg-red-500/20 text-red-400 border-red-500/40',
  },
  {
    id: 2,
    title: 'Power Yoga',
    category: 'Yoga',
    time: '8:00 AM',
    days: ['Tue', 'Thu'],
    duration: '60 min',
    trainer: 'Priya Sharma',
    spotsAvailable: 8,
    description: 'Dynamic athletic flow linking breath with movement for strength and balance.',
    tagColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  },
  {
    id: 3,
    title: 'Sunrise Yoga',
    category: 'Yoga',
    time: '8:00 AM',
    days: ['Sat'],
    duration: '60 min',
    trainer: 'Priya Sharma',
    spotsAvailable: 5,
    description: 'Invigorating morning stretches and gentle core work to start your weekend right.',
    tagColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  },
  {
    id: 4,
    title: 'Strength Lab',
    category: 'Strength',
    time: '10:00 AM',
    days: ['Mon', 'Wed', 'Fri'],
    duration: '50 min',
    trainer: 'Marcus Cole',
    spotsAvailable: 4,
    description: 'Barbell and kettlebell fundamentals focused on progressive overload and form.',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 5,
    title: 'Spin & Burn',
    category: 'Cycle',
    time: '10:00 AM & 12:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat'],
    duration: '45 min',
    trainer: 'Jordan Okafor',
    spotsAvailable: 10,
    description: 'Rhythm-based indoor cycling with heart-pumping climbs, sprints, and music.',
    tagColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
  {
    id: 6,
    title: 'Kickboxing',
    category: 'Boxing',
    time: '12:00 PM',
    days: ['Tue', 'Thu'],
    duration: '50 min',
    trainer: 'Dani Reyes',
    spotsAvailable: 6,
    description: 'Fast-paced combinations on heavy bags paired with functional core circuits.',
    tagColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  },
  {
    id: 7,
    title: 'Fight Club',
    category: 'Boxing',
    time: '12:00 PM',
    days: ['Sat'],
    duration: '60 min',
    trainer: 'Dani Reyes',
    spotsAvailable: 4,
    description: 'Advanced boxing footwork, mitt drills, and conditioning for boxing enthusiasts.',
    tagColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  },
  {
    id: 8,
    title: 'Vinyasa Flow',
    category: 'Yoga',
    time: '5:00 PM',
    days: ['Mon', 'Wed', 'Fri'],
    duration: '55 min',
    trainer: 'Priya Sharma',
    spotsAvailable: 7,
    description: 'Decompress from the workday with restorative postures, mobility, and breathwork.',
    tagColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  },
  {
    id: 9,
    title: 'Power Lift',
    category: 'Strength',
    time: '5:00 PM',
    days: ['Tue', 'Thu'],
    duration: '50 min',
    trainer: 'Marcus Cole',
    spotsAvailable: 5,
    description: 'Targeted squat, deadlift, and press technique with individualized coaching cues.',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 10,
    title: 'Boxing Basics',
    category: 'Boxing',
    time: '7:00 PM',
    days: ['Mon', 'Wed'],
    duration: '45 min',
    trainer: 'Dani Reyes',
    spotsAvailable: 8,
    description: 'Perfect for beginners looking to learn stance, jab-cross mechanics, and defence.',
    tagColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  },
  {
    id: 11,
    title: 'Tabata Fire',
    category: 'HIIT',
    time: '7:00 PM',
    days: ['Tue', 'Thu'],
    duration: '45 min',
    trainer: 'Dani Reyes',
    spotsAvailable: 6,
    description: '20-second all-out bursts with 10-second rest intervals for maximum metabolic burn.',
    tagColor: 'bg-red-500/20 text-red-400 border-red-500/40',
  },
];

const TRAINERS = [
  {
    id: 'marcus',
    name: 'Marcus Cole',
    specialty: 'Strength & Conditioning',
    bio: '10+ years coaching elite athletes. CSCS certified. Believes every rep counts and no one gets left behind.',
    avatar: '🏋️',
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    specialty: 'Yoga & Mobility',
    bio: 'RYT-500 instructor blending traditional vinyasa with sports-science mobility drills. Your body will thank you.',
    avatar: '🧘',
  },
  {
    id: 'dani',
    name: 'Dani Reyes',
    specialty: 'Kickboxing & HIIT',
    bio: 'Former amateur boxing champ turned coach. High energy, technique-first classes that torch calories fast.',
    avatar: '🥊',
  },
  {
    id: 'jordan',
    name: 'Jordan Okafor',
    specialty: 'Indoor Cycling',
    bio: 'Certified Spinning® instructor with an infectious playlist. Expect hills, sprints, and a whole lot of sweat.',
    avatar: '🚴',
  },
];

const PRICING_PLANS = [
  {
    id: 'drop-in',
    name: 'Drop-In',
    price: 15,
    period: '/class',
    featured: false,
    badge: null,
    features: ['Access any single class', 'No commitment', 'Locker room access'],
    buttonText: 'Get Started',
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 79,
    period: '/month',
    featured: true,
    badge: 'Most Popular',
    features: [
      'Unlimited group classes',
      'Free fitness assessment',
      'Locker room & towel service',
      'Guest pass (1/month)',
    ],
    buttonText: 'Join Now',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 129,
    period: '/month',
    featured: false,
    badge: null,
    features: [
      'Everything in Unlimited',
      '2 personal training sessions/month',
      'Nutrition consultation',
      'Priority booking',
    ],
    buttonText: 'Get Started',
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🔌 Connected to Postgres database.');

    // 1. Run schema.sql
    const schemaSql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    console.log('🔨 Applying database schema...');
    await client.query(schemaSql);
    console.log('✅ Schema tables verified/created.');

    // 2. Seed Trainers
    console.log('🌱 Seeding trainers...');
    for (const t of TRAINERS) {
      await client.query(
        `INSERT INTO trainers (id, name, specialty, bio, avatar)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, specialty = EXCLUDED.specialty, bio = EXCLUDED.bio, avatar = EXCLUDED.avatar;`,
        [t.id, t.name, t.specialty, t.bio, t.avatar]
      );
    }

    // 3. Seed Pricing Plans
    console.log('🌱 Seeding pricing plans...');
    for (const p of PRICING_PLANS) {
      await client.query(
        `INSERT INTO pricing_plans (id, name, price, period, featured, badge, features, button_text)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, price = EXCLUDED.price, period = EXCLUDED.period,
             featured = EXCLUDED.featured, badge = EXCLUDED.badge, features = EXCLUDED.features,
             button_text = EXCLUDED.button_text;`,
        [p.id, p.name, p.price, p.period, p.featured, p.badge, JSON.stringify(p.features), p.buttonText]
      );
    }

    // 4. Seed Classes
    console.log('🌱 Seeding classes...');
    for (const c of CLASSES) {
      await client.query(
        `INSERT INTO classes (id, title, category, time, days, duration, trainer, spots_available, description, tag_color)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE
         SET title = EXCLUDED.title, category = EXCLUDED.category, time = EXCLUDED.time,
             days = EXCLUDED.days, duration = EXCLUDED.duration, trainer = EXCLUDED.trainer,
             spots_available = EXCLUDED.spots_available, description = EXCLUDED.description,
             tag_color = EXCLUDED.tag_color;`,
        [
          c.id,
          c.title,
          c.category,
          c.time,
          JSON.stringify(c.days),
          c.duration,
          c.trainer,
          c.spotsAvailable,
          c.description,
          c.tagColor,
        ]
      );
    }
    // Reset sequence so future auto-increment works
    await client.query(`SELECT setval(pg_get_serial_sequence('classes', 'id'), (SELECT MAX(id) FROM classes));`);

    // 5. Seed Demo User
    console.log('🌱 Seeding demo user...');
    const demoEmail = 'member@pulsefit.com';
    const demoPasswordHash = await bcrypt.hash('password123', 10);
    await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash;`,
      ['Demo Member', demoEmail, demoPasswordHash]
    );

    console.log('🎉 Seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log(`Demo user credentials:`);
    console.log(`  Email:    member@pulsefit.com`);
    console.log(`  Password: password123`);
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
