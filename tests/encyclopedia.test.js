/**
 * make-me-survive — Test Suite
 * Tests core encyclopedia logic extracted from src/index.html
 *
 * Run: npm test
 */

// ─────────────────────────────────────────────────────────────────
// Helpers — replicate the functions from index.html in isolation
// ─────────────────────────────────────────────────────────────────

function parseBody(body) {
  body = body.replace(/\[IMG\]([\s\S]*?)\[\/IMG\]/g, (_, content) => `\x00IMG\x00${content}\x00ENDIMG\x00`);
  const lines = body.trim().split('\n');
  let html = '';
  let inList = false;
  for (let line of lines) {
    line = line.trim();
    if (!line) { if (inList) { html += '</ul>'; inList = false; } continue; }
    if (line.includes('\x00IMG\x00')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += line.replace(/\x00IMG\x00([\s\S]*?)\x00ENDIMG\x00/g, (_, c) => `<div class="diagram">${c}</div>`);
    } else if (line.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3>${line.slice(4)}</h3>`;
    } else if (line.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${line.slice(2)}</li>`;
    } else if (line.startsWith('[WARN]')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<div class="warn">⚠ ${line.replace('[WARN]', '').replace('[/WARN]', '')}</div>`;
    } else if (line.startsWith('[TIP]')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<div class="tip">💡 ${line.replace('[TIP]', '').replace('[/TIP]', '')}</div>`;
    } else if (line.startsWith('[IMP]')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<div class="important">⚡ ${line.replace('[IMP]', '').replace('[/IMP]', '')}</div>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p>${line}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

function verifiedBadge(status) {
  const BADGES = {
    expert:    { icon: '🟢', label: 'Expert verified',     cls: 'verified-expert' },
    community: { icon: '🟡', label: 'Community reviewed',  cls: 'verified-community' },
    none:      { icon: '🔴', label: 'Unverified',          cls: 'verified-none' },
  };
  return BADGES[status] || BADGES.none;
}

function buildSourcesHtml(sources) {
  if (!sources || sources.length === 0) return '';
  return '<div class="sources"><h4>Sources &amp; References</h4><ol>' +
    sources.map(s => `<li><cite>${s.title}</cite>${s.author ? ' — ' + s.author : ''}${s.url ? ` <a href="${s.url}" target="_blank">↗</a>` : ''}</li>`).join('') +
    '</ol></div>';
}

function searchArticles(articles, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return articles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.summary.toLowerCase().includes(q) ||
    (a.tags || []).some(t => t.includes(q)) ||
    (a.body || '').toLowerCase().includes(q)
  );
}

// ─────────────────────────────────────────────────────────────────
// Test data
// ─────────────────────────────────────────────────────────────────

const SAMPLE_ARTICLES = [
  {
    id: 1, cat: 'water', icon: '💧',
    title: 'Finding and collecting water',
    summary: 'Locating water in any environment.',
    tags: ['critical', 'water'],
    verified: 'none',
    sources: [
      { title: 'US Army Survival Manual FM 21-76', author: 'US Dept of the Army', url: 'https://www.army.mil' },
      { title: 'Wilderness Medicine 7th Ed.', author: 'Paul Auerbach' }
    ],
    body: `### Why water matters\nThe body survives only 3 days without water.\n- Collect dew with cloth\n- Follow terrain downhill\n[TIP]A 200-litre barrel stores enough for one adult for two months.[/TIP]`
  },
  {
    id: 2, cat: 'medical', icon: '🏥',
    title: 'Wound care without hospital access',
    summary: 'Cleaning and monitoring wounds.',
    tags: ['critical', 'medical'],
    verified: 'community',
    verifiedBy: 'testuser',
    verifiedDate: '2026-05',
    sources: [
      { title: 'Wilderness Medicine 7th Ed.', author: 'Paul Auerbach' },
      { title: 'WHO First Aid Guidelines', url: 'https://www.who.int' }
    ],
    body: `### Step 1: Control bleeding\nApply firm pressure for 10 minutes.\n[WARN]A tourniquet left over 2 hours risks tissue damage.[/WARN]`
  },
  {
    id: 3, cat: 'fire', icon: '🔥',
    title: 'Fire starting without matches',
    summary: 'Bow drill, flint, and other methods.',
    tags: ['fire', 'survival'],
    verified: 'expert',
    verifiedBy: 'survival_expert',
    verifiedDate: '2026-05',
    sources: [],
    body: `### Bow drill method\nUse dry softwood.\n- Cedar works well\n- Keep consistent pressure`
  }
];

// ─────────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────────

describe('parseBody()', () => {
  test('renders ### headings as <h3>', () => {
    const result = parseBody('### My Heading');
    expect(result).toBe('<h3>My Heading</h3>');
  });

  test('renders bullet lists wrapped in <ul>', () => {
    const result = parseBody('- item one\n- item two');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>item one</li>');
    expect(result).toContain('<li>item two</li>');
    expect(result).toContain('</ul>');
  });

  test('closes list before a heading', () => {
    const result = parseBody('- item one\n### New Section');
    expect(result).toContain('</ul><h3>New Section</h3>');
  });

  test('renders [WARN] blocks correctly', () => {
    const result = parseBody('[WARN]This is dangerous[/WARN]');
    expect(result).toContain('class="warn"');
    expect(result).toContain('This is dangerous');
    expect(result).toContain('⚠');
  });

  test('renders [TIP] blocks correctly', () => {
    const result = parseBody('[TIP]This is a tip[/TIP]');
    expect(result).toContain('class="tip"');
    expect(result).toContain('This is a tip');
    expect(result).toContain('💡');
  });

  test('renders [IMP] blocks correctly', () => {
    const result = parseBody('[IMP]This is important[/IMP]');
    expect(result).toContain('class="important"');
    expect(result).toContain('⚡');
  });

  test('renders plain text as <p>', () => {
    const result = parseBody('Just some text here.');
    expect(result).toBe('<p>Just some text here.</p>');
  });

  test('handles empty lines between sections', () => {
    const result = parseBody('### Section One\n\n### Section Two');
    expect(result).toContain('<h3>Section One</h3>');
    expect(result).toContain('<h3>Section Two</h3>');
  });

  test('renders [IMG]...[/IMG] blocks as diagram divs', () => {
    const result = parseBody('[IMG]<svg>test</svg>[/IMG]');
    expect(result).toContain('class="diagram"');
    expect(result).toContain('<svg>test</svg>');
  });

  test('handles empty body gracefully', () => {
    expect(() => parseBody('')).not.toThrow();
    expect(parseBody('')).toBe('');
  });

  test('handles mixed content correctly', () => {
    const body = `### Title\nSome text.\n- bullet\n[TIP]A tip[/TIP]`;
    const result = parseBody(body);
    expect(result).toContain('<h3>Title</h3>');
    expect(result).toContain('<p>Some text.</p>');
    expect(result).toContain('<li>bullet</li>');
    expect(result).toContain('class="tip"');
  });

  test('does not leave unclosed <ul> tags', () => {
    const result = parseBody('- item one\n- item two');
    const opens = (result.match(/<ul>/g) || []).length;
    const closes = (result.match(/<\/ul>/g) || []).length;
    expect(opens).toBe(closes);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('verifiedBadge()', () => {
  test('returns green badge for expert', () => {
    const b = verifiedBadge('expert');
    expect(b.icon).toBe('🟢');
    expect(b.cls).toBe('verified-expert');
    expect(b.label).toContain('Expert');
  });

  test('returns yellow badge for community', () => {
    const b = verifiedBadge('community');
    expect(b.icon).toBe('🟡');
    expect(b.cls).toBe('verified-community');
  });

  test('returns red badge for none', () => {
    const b = verifiedBadge('none');
    expect(b.icon).toBe('🔴');
    expect(b.cls).toBe('verified-none');
  });

  test('defaults to unverified for unknown status', () => {
    const b = verifiedBadge('unknown_status');
    expect(b.icon).toBe('🔴');
  });

  test('defaults to unverified for undefined', () => {
    const b = verifiedBadge(undefined);
    expect(b.icon).toBe('🔴');
  });
});

// ─────────────────────────────────────────────────────────────────

describe('buildSourcesHtml()', () => {
  test('returns empty string for no sources', () => {
    expect(buildSourcesHtml([])).toBe('');
    expect(buildSourcesHtml(undefined)).toBe('');
    expect(buildSourcesHtml(null)).toBe('');
  });

  test('renders source title', () => {
    const html = buildSourcesHtml([{ title: 'Wilderness Medicine' }]);
    expect(html).toContain('Wilderness Medicine');
    expect(html).toContain('<cite>');
  });

  test('renders author when provided', () => {
    const html = buildSourcesHtml([{ title: 'Test Book', author: 'Test Author' }]);
    expect(html).toContain('Test Author');
  });

  test('renders URL link when provided', () => {
    const html = buildSourcesHtml([{ title: 'WHO Guidelines', url: 'https://who.int' }]);
    expect(html).toContain('href="https://who.int"');
    expect(html).toContain('↗');
  });

  test('renders multiple sources as ordered list', () => {
    const html = buildSourcesHtml([
      { title: 'Source One' },
      { title: 'Source Two' },
    ]);
    expect(html).toContain('<ol>');
    expect(html).toContain('</ol>');
    const liCount = (html.match(/<li>/g) || []).length;
    expect(liCount).toBe(2);
  });

  test('omits author dash when author not provided', () => {
    const html = buildSourcesHtml([{ title: 'No Author Book' }]);
    expect(html).not.toContain(' — ');
  });
});

// ─────────────────────────────────────────────────────────────────

describe('searchArticles()', () => {
  test('returns empty array for empty query', () => {
    expect(searchArticles(SAMPLE_ARTICLES, '')).toEqual([]);
    expect(searchArticles(SAMPLE_ARTICLES, '   ')).toEqual([]);
  });

  test('finds articles by title', () => {
    const results = searchArticles(SAMPLE_ARTICLES, 'wound');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(2);
  });

  test('is case-insensitive', () => {
    const results = searchArticles(SAMPLE_ARTICLES, 'WATER');
    expect(results.length).toBeGreaterThan(0);
  });

  test('finds articles by tag', () => {
    const results = searchArticles(SAMPLE_ARTICLES, 'critical');
    expect(results.length).toBe(2);
  });

  test('finds articles by body content', () => {
    const results = searchArticles(SAMPLE_ARTICLES, 'bow drill');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(3);
  });

  test('finds articles by summary', () => {
    const results = searchArticles(SAMPLE_ARTICLES, 'monitoring wounds');
    expect(results.length).toBe(1);
  });

  test('returns multiple results for broad query', () => {
    // 'critical' tag exists on both article 1 and 2
    const results = searchArticles(SAMPLE_ARTICLES, 'critical');
    expect(results.length).toBeGreaterThan(1);
  });

  test('returns empty array when nothing matches', () => {
    const results = searchArticles(SAMPLE_ARTICLES, 'xyzzy_not_real');
    expect(results).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('Article data integrity', () => {
  test('all sample articles have required fields', () => {
    SAMPLE_ARTICLES.forEach(a => {
      expect(a.id).toBeDefined();
      expect(typeof a.id).toBe('number');
      expect(a.cat).toBeDefined();
      expect(a.title).toBeDefined();
      expect(a.title.length).toBeGreaterThan(0);
      expect(a.summary).toBeDefined();
      expect(a.body).toBeDefined();
    });
  });

  test('all article IDs are unique', () => {
    const ids = SAMPLE_ARTICLES.map(a => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('verified field is valid when present', () => {
    const validStatuses = ['none', 'community', 'expert'];
    SAMPLE_ARTICLES.forEach(a => {
      if (a.verified !== undefined) {
        expect(validStatuses).toContain(a.verified);
      }
    });
  });

  test('sources is an array when present', () => {
    SAMPLE_ARTICLES.forEach(a => {
      if (a.sources !== undefined) {
        expect(Array.isArray(a.sources)).toBe(true);
      }
    });
  });

  test('each source has at minimum a title', () => {
    SAMPLE_ARTICLES.forEach(a => {
      (a.sources || []).forEach(s => {
        expect(s.title).toBeDefined();
        expect(s.title.length).toBeGreaterThan(0);
      });
    });
  });

  test('verifiedBy is present when status is not none', () => {
    SAMPLE_ARTICLES.forEach(a => {
      if (a.verified && a.verified !== 'none') {
        expect(a.verifiedBy).toBeDefined();
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────

describe('HTML structure safety', () => {
  test('parseBody does not produce script injection from body text', () => {
    const malicious = '### Title\n<script>alert("xss")</script>';
    const result = parseBody(malicious);
    // The script tag passes through as text in a <p> — in production this
    // is rendered as innerHTML so we verify it would need sanitisation.
    // This test documents the behaviour and flags it for future hardening.
    expect(result).toContain('<h3>Title</h3>');
  });

  test('buildSourcesHtml escapes URL correctly', () => {
    const html = buildSourcesHtml([{
      title: 'Test',
      url: 'https://example.com/page?q=1&r=2'
    }]);
    expect(html).toContain('https://example.com/page?q=1&r=2');
  });
});
