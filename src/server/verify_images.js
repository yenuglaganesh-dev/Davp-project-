import fs from 'fs';

const books = JSON.parse(fs.readFileSync('src/data/freeComputerBooks.json', 'utf8'));

async function verifyAll() {
  console.log(`Verifying ${books.length} book cover images...`);
  let valid = 0;
  let missing = 0;
  const missingList = [];

  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    try {
      const res = await fetch(b.cover_image, { 
        method: 'HEAD',
        headers: { 'User-Agent': 'DAVP-Library/1.0' }
      });
      if (res.ok) {
        valid++;
      } else {
        missing++;
        missingList.push({ title: b.title, url: b.cover_image, status: res.status });
      }
    } catch (e) {
      missing++;
      missingList.push({ title: b.title, url: b.cover_image, error: e.message });
    }
    if ((i + 1) % 25 === 0) {
      console.log(`Checked ${i + 1} / ${books.length}...`);
    }
  }

  console.log(`\nImage Verification Summary:`);
  console.log(`Valid reachable images: ${valid}`);
  console.log(`Missing or blocked images: ${missing}`);
  if (missingList.length > 0) {
    console.log('Sample missing:', missingList.slice(0, 5));
  }
}

verifyAll().catch(console.error);

