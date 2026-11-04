async function checkBookText() {
  const res = await fetch('https://freecomputerbooks.com/Principles-of-Data-Science.html');
  const html = await res.text();

  // Find all text in #bookdesccontent
  const idx = html.indexOf('id="bookdesccontent"');
  if (idx !== -1) {
    const text = html.substring(idx, idx + 4000);
    // strip tags
    const clean = text.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, '\n');
    console.log('Book text cleaned:');
    console.log(clean.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 40).join('\n'));
  }
}

checkBookText().catch(console.error);
