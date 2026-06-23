// ============================================================
// AVIZAYA - EPISODE IMPORT SCRIPT
// ============================================================
// Reads the LOCKED HTML files from content/school-1/ and
// inserts them into the Supabase episodes table.
//
// Run with: npm run import:episodes
//
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// ─── Episode 1 metadata (titles match the LOCKED files) ─────
const EPISODE_TITLES = [
  { number: 1, slug: 'healing-begins', title: 'Your healing begins when you stop abandoning yourself' },
  { number: 2, slug: 'who-you-are', title: 'Who you are when no one is watching' },
  { number: 3, slug: 'father-wound', title: 'The father wound' },
  { number: 4, slug: 'mother-wound', title: 'The mother wound' },
  { number: 5, slug: 'addiction-unmet-love', title: 'Addiction is the language of unmet love' },
  { number: 6, slug: 'trauma-bond', title: 'The trauma bond' },
  { number: 7, slug: 'same-love', title: 'Why you keep choosing the same love' },
  { number: 8, slug: 'real-healing', title: 'What real healing actually looks like' },
  { number: 9, slug: 'weaponized-love', title: 'When love becomes a weapon' },
  { number: 10, slug: 'orphan-spirit', title: 'The orphan spirit' },
  { number: 11, slug: 'self-forgiveness', title: 'Forgiving the woman in the mirror' },
  { number: 12, slug: 'alchemy', title: 'Abandonment is your alchemy' },
];

async function main() {
  console.log('Avizaya episode import starting...\n');

  // Get School 1 ID from database
  const { data: school, error: schoolError } = await supabase
    .from('schools')
    .select('id, title')
    .eq('slug', 'abandoned-girl')
    .single();

  if (schoolError || !school) {
    console.error('Could not find school "abandoned-girl". Did you run the schema migration?');
    process.exit(1);
  }

  console.log(`Found school: ${school.title} (id=${school.id})\n`);

  // Read all 12 LOCKED HTML files from content/school-1/
  const contentDir = join(process.cwd(), 'content', 'school-1');
  const files = readdirSync(contentDir)
    .filter((f) => /^s1-ep\d+-LOCKED\.html$/.test(f))
    .sort();

  if (files.length === 0) {
    console.error(`No LOCKED files found in ${contentDir}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} episode files. Importing...\n`);

  for (const file of files) {
    const match = file.match(/^s1-ep(\d+)-LOCKED\.html$/);
    if (!match) continue;

    const episodeNumber = parseInt(match[1], 10);
    const meta = EPISODE_TITLES.find((e) => e.number === episodeNumber);
    if (!meta) {
      console.warn(`No metadata for episode ${episodeNumber}, skipping`);
      continue;
    }

    const filePath = join(contentDir, file);
    const htmlContent = readFileSync(filePath, 'utf-8');
    const wordCount = htmlContent.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

    const { error } = await supabase.from('episodes').upsert(
      {
        school_id: school.id,
        episode_number: meta.number,
        slug: meta.slug,
        title: meta.title,
        html_content: htmlContent,
        word_count: wordCount,
        is_published: true,
        display_order: meta.number,
      },
      { onConflict: 'school_id,episode_number' }
    );

    if (error) {
      console.error(`  ✗  Ep ${meta.number}: ${error.message}`);
    } else {
      console.log(`  ✓  Ep ${meta.number}: ${meta.title} (${wordCount} words)`);
    }
  }

  // Update total episode count on school
  await supabase.from('schools').update({ total_episodes: files.length }).eq('id', school.id);

  console.log(`\nDone. Imported ${files.length} episodes into School 1.`);
}

main().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
