// Ingestion script for FreeComputerBooks.com
// Collects authentic computer science, programming, math, AI and data science books.

const CATEGORY_URLS = [
  { url: 'https://freecomputerbooks.com/dbDataScienceBooks.html', category: 'Data Science' },
  { url: 'https://freecomputerbooks.com/compscMachineLearningBooks.html', category: 'Machine Learning' },
  { url: 'https://freecomputerbooks.com/compscAlgorithmBooks.html', category: 'Algorithms and Data Structures' },
  { url: 'https://freecomputerbooks.com/compscArtificialIntelligenceBooks.html', category: 'Artificial Intelligence' },
  { url: 'https://freecomputerbooks.com/compscDeepLearningBooks.html', category: 'Deep Learning' },
  { url: 'https://freecomputerbooks.com/dbAnalysisMiningBooks.html', category: 'Data Analysis and Data Mining' },
  { url: 'https://freecomputerbooks.com/langPythonBooks.html', category: 'Python Programming' },
  { url: 'https://freecomputerbooks.com/langJavaBooks.html', category: 'Java Programming' },
  { url: 'https://freecomputerbooks.com/langCppBooks.html', category: 'C and C++' },
  { url: 'https://freecomputerbooks.com/webJavaScriptBooks.html', category: 'JavaScript' },
  { url: 'https://freecomputerbooks.com/mathStatisticsBooks.html', category: 'Statistics' },
  { url: 'https://freecomputerbooks.com/mathCalculusBooks.html', category: 'Mathematics' },
  { url: 'https://freecomputerbooks.com/seSoftwareEngineeringBooks.html', category: 'Software Engineering' },
  { url: 'https://freecomputerbooks.com/compscNetworksBooks.html', category: 'Computer Networks' },
  { url: 'https://freecomputerbooks.com/unixLinuxBooks.html', category: 'Linux and Unix' }
];

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'DAVP-Academic-Library-Harvester/1.0 (Educational research; library curation)'
      }
    });
    if (!res.ok) {
      console.warn(`Failed to fetch ${url}: status ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.warn(`Error fetching ${url}:`, err.message);
    return null;
  }
}

function parseBooksFromHtml(html, defaultCategory) {
  const books = [];
  // Books are in <ul id="newBooksL"><li><div><img src="covers/..."><a href="...">Title (Author)</a><p>Desc</p></div></li>
  // Or in generic <li><div>...
  const liRegex = /<li>\s*<div>\s*<img[^>]+src=["']([^"']+)["'][^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<p>([\s\S]*?)<\/p>/gi;

  let match;
  while ((match = liRegex.exec(html)) !== null) {
    const imgSrc = match[1].trim();
    const href = match[2].trim();
    const rawTitleAuthor = match[3].replace(/<[^>]+>/g, '').trim();
    const description = match[4].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');

    // Filter out ads / non-book links
    if (!href.endsWith('.html') || href.includes('index') || href.includes('db') || href.includes('lang')) {
      continue;
    }

    // Parse Title and Author: often "Book Title (Author Name, et al.)"
    let title = rawTitleAuthor;
    let author = 'Unknown';

    const parenMatch = rawTitleAuthor.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (parenMatch) {
      title = parenMatch[1].trim();
      author = parenMatch[2].trim();
    } else {
      // Check for " - by Author" or " by Author"
      const byMatch = rawTitleAuthor.match(/^(.*?)\s+(?:-|by)\s+(.*)$/i);
      if (byMatch) {
        title = byMatch[1].trim();
        author = byMatch[2].trim();
      }
    }

    // High-res cover image URL:
    // If thumbnail covers/Title_43x55.jpg, convert to covers/Title.jpg
    let coverImg = imgSrc;
    if (coverImg.includes('_43x55')) {
      coverImg = coverImg.replace('_43x55', '');
    }
    const fullCoverUrl = coverImg.startsWith('http') 
      ? coverImg 
      : `https://freecomputerbooks.com/${coverImg.replace(/^\/+/, '')}`;

    const sourceUrl = href.startsWith('http')
      ? href
      : `https://freecomputerbooks.com/${href.replace(/^\/+/, '')}`;

    books.push({
      title,
      author,
      category: defaultCategory,
      description,
      cover_image: fullCoverUrl,
      source_name: 'FreeComputerBooks.com',
      source_url: sourceUrl,
      reading_url: sourceUrl, // Fallback to source details page where official download links live
      license: 'Free / Open Access',
      language: 'English'
    });
  }

  return books;
}

async function run() {
  console.log('Starting ingestion from FreeComputerBooks.com...');
  const allBooks = [];
  const seenUrls = new Set();

  for (const cat of CATEGORY_URLS) {
    console.log(`Harvesting category: ${cat.category} from ${cat.url}`);
    const html = await fetchPage(cat.url);
    if (!html) continue;

    const books = parseBooksFromHtml(html, cat.category);
    console.log(`  Found ${books.length} candidate books`);

    for (const b of books) {
      if (!seenUrls.has(b.source_url) && b.title.length > 2) {
        seenUrls.add(b.source_url);
        allBooks.push(b);
      }
    }

    // Respectful delay between categories
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\nTotal unique books harvested: ${allBooks.length}`);
  console.log('Sample book:');
  console.log(JSON.stringify(allBooks[0], null, 2));

  // Write to a temporary file
  const fs = await import('fs');
  fs.writeFileSync('src/data/harvestedBooks.json', JSON.stringify(allBooks, null, 2));
  console.log('Saved to src/data/harvestedBooks.json');
}

run().catch(console.error);

