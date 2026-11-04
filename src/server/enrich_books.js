import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('src/data/harvestedBooks.json', 'utf8'));

// Pick 75 diverse books across all categories
const categories = [
  'Data Science',
  'Machine Learning',
  'Algorithms and Data Structures',
  'Artificial Intelligence',
  'Data Analysis and Data Mining',
  'Python Programming',
  'C and C++',
  'JavaScript',
  'Statistics',
  'Mathematics',
  'Linux and Unix'
];

const selected = [];
const seenTitles = new Set();

for (const cat of categories) {
  const catBooks = raw.filter(b => b.category === cat);
  let count = 0;
  for (const b of catBooks) {
    if (!seenTitles.has(b.title.toLowerCase()) && b.description.length > 30) {
      seenTitles.add(b.title.toLowerCase());
      selected.push(b);
      count++;
      if (count >= 7) break; // 7 per category = ~77 books!
    }
  }
}

console.log(`Selected ${selected.length} books for detailed enrichment.`);

async function enrichOne(book) {
  try {
    const res = await fetch(book.source_url, {
      headers: { 'User-Agent': 'DAVP-Library-Curator/1.0' }
    });
    if (!res.ok) return book;
    const html = await res.text();

    // 1. Direct Reading / Download Link
    // Look for <b id="downloadLinks">Read and Download Links:</b>...<ul><li><a href="..."
    let readingUrl = book.source_url;
    const downloadIdx = html.indexOf('id="downloadLinks"');
    if (downloadIdx !== -1) {
      const downloadSection = html.substring(downloadIdx, downloadIdx + 1500);
      const linkMatch = downloadSection.match(/<li>\s*<a[^>]+href=["']([^"']+)["'][^>]*>/i);
      if (linkMatch && linkMatch[1] && !linkMatch[1].startsWith('#')) {
        readingUrl = linkMatch[1];
      }
    }

    // 2. High-res cover image URL from page
    let coverImage = book.cover_image;
    const imgMatch = html.match(/<img[^>]+src=["'](covers\/[^"']+\.jpg)["'][^>]*>/i);
    if (imgMatch && imgMatch[1]) {
      coverImage = `https://freecomputerbooks.com/${imgMatch[1]}`;
    }

    // 3. Publisher & Year extraction if mentioned
    let publisher = null;
    let year = null;
    let isbn = null;

    // Common patterns in book descriptions or page: "Publisher: ...", "Published: (YYYY)", "ISBN: ..."
    const pubMatch = html.match(/(?:Publisher|Published by):\s*([^<,\n\r]+)/i);
    if (pubMatch) {
      publisher = pubMatch[1].trim();
    }

    const yearMatch = html.match(/\b(20[0-2][0-9]|199[0-9])\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[1], 10);
    }

    const isbnMatch = html.match(/ISBN(?:-1[03])?:\s*([0-9Xx-]{10,17})/i);
    if (isbnMatch) {
      isbn = isbnMatch[1].trim();
    }

    // Check license in text
    let license = 'Free / Open Access';
    if (html.includes('Creative Commons') || html.includes('CC BY') || html.includes('CC-BY')) {
      license = 'Creative Commons License';
    } else if (html.includes('GNU Free Documentation') || html.includes('GFDL')) {
      license = 'GNU Free Documentation License';
    } else if (html.includes('Public Domain')) {
      license = 'Public Domain';
    } else if (html.includes('Open Access')) {
      license = 'Open Access';
    }

    return {
      ...book,
      publisher: publisher || (book.publisher ?? null),
      year: year || (book.year ?? null),
      isbn: isbn || (book.isbn ?? null),
      cover_image: coverImage,
      reading_url: readingUrl,
      license
    };
  } catch (e) {
    return book;
  }
}

async function main() {
  const enriched = [];
  console.log('Enriching books with full source page metadata...');
  for (let i = 0; i < selected.length; i++) {
    const b = selected[i];
    const res = await enrichOne(b);
    enriched.push(res);
    if ((i + 1) % 10 === 0) {
      console.log(`Enriched ${i + 1} / ${selected.length} books...`);
    }
    // slight polite delay
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`Finished enriching ${enriched.length} books!`);
  fs.writeFileSync('src/data/freeComputerBooks.json', JSON.stringify(enriched, null, 2));
  console.log('Saved to src/data/freeComputerBooks.json');
}

main().catch(console.error);

