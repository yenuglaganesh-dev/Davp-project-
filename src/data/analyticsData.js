// Computes dynamic analytics metrics from books catalog
// Aligned with Textbooks_in_Library_Analysis_Using_Python.ipynb calculations

export function computeLibraryAnalytics(books = []) {
  if (!books || books.length === 0) {
    return null;
  }

  const totalRecords = books.length;
  const uniqueTitles = new Set(books.map(b => b.title.toLowerCase().trim())).size;
  const totalCopies = books.reduce((acc, b) => acc + (Number(b.totalCopies) || 0), 0);
  const availableCopies = books.reduce((acc, b) => acc + (Number(b.availableCopies) || 0), 0);
  const borrowedCopies = books.reduce((acc, b) => acc + (Number(b.borrowedCopies) || 0), 0);
  const totalValuation = books.reduce((acc, b) => acc + ((Number(b.price) || 0) * (Number(b.totalCopies) || 0)), 0);
  const avgPrice = Math.round(books.reduce((acc, b) => acc + (Number(b.price) || 0), 0) / (totalRecords || 1));
  const availabilityRate = totalCopies > 0 ? ((availableCopies / totalCopies) * 100).toFixed(1) : '0';

  // Subject distribution
  const subjectMap = {};
  books.forEach(b => {
    const s = b.subject || 'Other';
    if (!subjectMap[s]) {
      subjectMap[s] = { name: s, count: 0, totalCopies: 0, available: 0, borrowed: 0, valuation: 0 };
    }
    subjectMap[s].count += 1;
    subjectMap[s].totalCopies += Number(b.totalCopies) || 0;
    subjectMap[s].available += Number(b.availableCopies) || 0;
    subjectMap[s].borrowed += Number(b.borrowedCopies) || 0;
    subjectMap[s].valuation += (Number(b.price) || 0) * (Number(b.totalCopies) || 0);
  });

  const subjectStats = Object.values(subjectMap).sort((a, b) => b.count - a.count);

  // Publication year distribution
  const yearMap = {};
  books.forEach(b => {
    const yr = b.year ? String(b.year) : 'Open Access';
    yearMap[yr] = (yearMap[yr] || 0) + 1;
  });
  const yearStats = Object.keys(yearMap).sort().map(yr => ({
    year: yr,
    count: yearMap[yr]
  }));

  // Publisher distribution
  const pubMap = {};
  books.forEach(b => {
    const pub = b.publisher || 'Independent / Open Access';
    pubMap[pub] = (pubMap[pub] || 0) + 1;
  });
  const publisherStats = Object.keys(pubMap)
    .map(pub => ({ name: pub, count: pubMap[pub] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Repository distribution
  const repoMap = {};
  books.forEach(b => {
    const r = b.source_name || b.repository || 'FreeComputerBooks.com';
    repoMap[r] = (repoMap[r] || 0) + 1;
  });
  const repositoryStats = Object.keys(repoMap).map(r => ({
    name: r,
    count: repoMap[r],
    pct: ((repoMap[r] / totalRecords) * 100).toFixed(1)
  })).sort((a, b) => b.count - a.count);

  // Shelf distribution (Sections A - H)
  const shelfMap = {};
  books.forEach(b => {
    const letter = (b.shelf || 'A')[0].toUpperCase();
    shelfMap[letter] = (shelfMap[letter] || 0) + 1;
  });
  const shelfStats = Object.keys(shelfMap).sort().map(s => ({
    section: `Section ${s}`,
    count: shelfMap[s]
  }));

  // Statistical IQR calculations for Price (faithful to Python notebook 1.5 * IQR)
  const prices = books.map(b => Number(b.price) || 0).sort((a, b) => a - b);
  const q1 = prices[Math.floor(prices.length * 0.25)] || 0;
  const median = prices[Math.floor(prices.length * 0.5)] || 0;
  const q3 = prices[Math.floor(prices.length * 0.75)] || 0;
  const iqr = q3 - q1;
  const lowerBound = Math.max(0, q1 - 1.5 * iqr);
  const upperBound = q3 + 1.5 * iqr;
  const outliers = prices.filter(p => p < lowerBound || p > upperBound).length;

  return {
    totalRecords,
    uniqueTitles,
    totalCopies,
    availableCopies,
    borrowedCopies,
    totalValuation,
    avgPrice,
    availabilityRate,
    subjectStats,
    yearStats,
    publisherStats,
    repositoryStats,
    shelfStats,
    iqrStats: {
      q1,
      median,
      q3,
      iqr,
      lowerBound: Math.round(lowerBound),
      upperBound: Math.round(upperBound),
      outliers
    }
  };
}

