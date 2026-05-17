/**
 * Push schema + seed data directly to Supabase Postgres.
 * Run with: node scripts/push-to-db.mjs
 */
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres.exdkomlcvyzslwbracbs:rasal786786%40%40%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";

const MIGRATIONS_DIR = path.join(__dirname, "..", "supabase", "migrations");

async function main() {
  console.log("🔌 Connecting to database...");
  const client = new pg.Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("✅ Connected!\n");

  // Get migration files sorted by name (timestamp order)
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, "utf-8");
    console.log(`📄 Running: ${file}`);
    try {
      await client.query(sql);
      console.log(`   ✅ Done\n`);
    } catch (err) {
      console.error(`   ❌ Error in ${file}:`, err.message);
      // Continue with other migrations
    }
  }

  // Verify data
  const counts = await Promise.all([
    client.query("SELECT COUNT(*) FROM public.places"),
    client.query("SELECT COUNT(*) FROM public.buses"),
    client.query("SELECT COUNT(*) FROM public.stops"),
  ]);
  console.log("📊 Data verification:");
  console.log(`   Places: ${counts[0].rows[0].count}`);
  console.log(`   Buses:  ${counts[1].rows[0].count}`);
  console.log(`   Stops:  ${counts[2].rows[0].count}`);

  await client.end();
  console.log("\n🎉 All done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
