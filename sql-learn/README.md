# SQL Learn

**Version:** 1.0.0
**License:** MIT
**Author:** Escola de Dados

An interactive SQL learning platform powered by DuckDB-WASM. Practice SQL queries in your browser with immediate feedback and comprehensive grading.

---

## ✨ Features

- **🚀 Client-Side SQL Execution:** Run queries directly in your browser via DuckDB-WASM
- **📦 Pack-Based Learning:** Organized challenge packs with real datasets
- **✅ Comprehensive Grading:** Multiple assertion types (ROWCOUNT, SQL, SCHEMA_EQ, SET_EQ, NEAR)
- **💾 Progress Tracking:** Automatic progress saving with import/export
- **🎨 Monaco Editor:** VS Code-quality SQL editor with syntax highlighting
- **♿ Accessible:** WCAG AA compliant with keyboard navigation
- **📱 Responsive:** Works on desktop, tablet, and mobile

---

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd sql-learn

# Install dependencies
pnpm install

# Generate sample data
python3 scripts/generate-sample-data.py

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📚 Documentation

- **[Context Index](docs/CONTEXT_INDEX.md)** - Module overview and recent changes
- **[Changelog](docs/CHANGELOG.md)** - Version history
- **[Architecture](docs/ARCHITECTURE.md)** - System design and data flow
- **[Roadmap](docs/ROADMAP.md)** - Future plans
- **[ADRs](docs/ADR/)** - Architecture Decision Records
- **[Iteration Playbook](docs/PLAYBOOKS/iteration-playbook.md)** - Development workflow
- **[Release Checklist](docs/PLAYBOOKS/release-checklist.md)** - Release process

---

## 🧑‍💻 Development

### Available Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # Check TypeScript types
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
pnpm test         # Run unit tests (Vitest)
pnpm test:e2e     # Run end-to-end tests (Playwright)
```

### Project Structure

```
sql-learn/
├── app/                      # Next.js App Router
│   ├── components/           # React components
│   ├── lib/                  # Core business logic
│   ├── packs/                # Challenge packs with datasets
│   ├── challenges/[id]/      # Challenge detail pages
│   ├── page.tsx              # Home page
│   └── layout.tsx            # Root layout
├── docs/                     # Documentation
│   ├── ADR/                  # Architecture Decision Records
│   └── PLAYBOOKS/            # Process guides
├── scripts/                  # Build and utility scripts
├── tests/                    # Test suites
│   ├── unit/                 # Unit tests
│   └── e2e/                  # End-to-end tests
└── .github/workflows/        # CI/CD configuration
```

### Key Technologies

- **Framework:** Next.js 15 (App Router) + React 18
- **Language:** TypeScript 5
- **SQL Engine:** DuckDB-WASM 1.28
- **Editor:** Monaco Editor 4.6
- **Styling:** Tailwind CSS 3.4
- **Testing:** Vitest 2.1 + Playwright 1.48
- **Linting:** ESLint 8 + Prettier 3

---

## 🎓 Creating Challenges

### Pack Structure

```
app/packs/your_pack/
├── pack.json              # Pack metadata and challenges
├── dataset1.parquet       # Dataset files
└── dataset2.parquet
```

### Pack Schema (v1.1)

See [ADR-0002](docs/ADR/ADR-0002-pack-schema.md) for detailed specification.

**Example `pack.json`:**

```json
{
  "schema_version": "1.1",
  "min_app_version": "1.0.0",
  "id": "your_pack",
  "title": "Your Pack Title",
  "metadata": {
    "author": "Your Name",
    "locale": "en-US",
    "tags": ["category"]
  },
  "datasets": [
    { "name": "table_name", "src": "dataset1.parquet" }
  ],
  "challenges": [
    {
      "id": "challenge_1",
      "title": "Challenge Title",
      "prompt": "Write a query to...",
      "solution_sql": "SELECT ...",
      "tests": [
        { "name": "test_name", "assert": "ROWCOUNT", "expected": 10 }
      ],
      "difficulty": "easy",
      "tags": ["select"]
    }
  ]
}
```

### Generating Parquet Files

```python
import pandas as pd

df = pd.DataFrame({
    "id": [1, 2, 3],
    "name": ["Alice", "Bob", "Charlie"]
})

df.to_parquet("output.parquet", index=False)
```

---

## 🧪 Testing

### Unit Tests

```bash
pnpm test
```

Tests are located in `tests/unit/` and use Vitest.

### E2E Tests

```bash
pnpm test:e2e
```

Tests are located in `tests/e2e/` and use Playwright.

### Test Coverage

```bash
pnpm test -- --coverage
```

---

## 🔒 Security

- **Client-Side Only (v1):** No server means no server-side attacks
- **Input Sanitization:** CSV imports sanitized for formula injection
- **Sandboxed Execution:** DuckDB runs in Web Worker
- **Size Limits:** Dataset size and row limits enforced
- **Timeout Protection:** Runaway queries killed after timeout
- **No Remote Data:** Datasets must be local/same-origin

---

## ♿ Accessibility

- **Keyboard Navigation:** Full keyboard support
- **Screen Reader Compatible:** ARIA labels and semantic HTML
- **Color Contrast:** WCAG AA compliant
- **Focus Management:** Proper focus indicators
- **Status Announcements:** Live regions for dynamic content

---

## 🌐 Browser Support

### Required Features

- **WebAssembly:** For DuckDB execution
- **SharedArrayBuffer:** For DuckDB threading (requires COOP/COEP headers)
- **ES2020:** Modern JavaScript features

### Tested Browsers

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 89+
- ✅ Safari 15+

### Headers Required

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These are configured in `next.config.js`.

---

## 📊 Performance

### Bundle Size

- **Total:** ~4-5 MB (including DuckDB-WASM)
- **DuckDB-WASM:** ~2-3 MB
- **Monaco Editor:** ~1 MB (lazy loaded)
- **App Code:** ~500 KB

### Optimization Strategies

- Code splitting (Monaco lazy loaded)
- Parquet compression
- Next.js static generation
- CDN for static assets (optional)

### Limits (Configurable)

- Query timeout: 1500ms
- Max rows per query: 200,000
- Max dataset size: 5MB

---

## 🤝 Contributing

We welcome contributions! Please follow the [Iteration Playbook](docs/PLAYBOOKS/iteration-playbook.md).

### Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes (with docs updates!)
4. Run tests and linting
5. Submit a pull request

### Code Quality

- All code must pass TypeScript, ESLint, and Prettier checks
- Unit tests required for new features
- E2E tests for critical user flows
- Documentation must be updated (enforced by CI)

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- **DuckDB Team** - Amazing in-browser SQL engine
- **Monaco Editor** - World-class code editor
- **Next.js Team** - Excellent React framework
- **Vercel** - Deployment platform

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/your-org/sql-learn/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/sql-learn/discussions)
- **Email:** support@escoladedados.org

---

## 🗺️ Roadmap

See [ROADMAP.md](docs/ROADMAP.md) for future plans.

**Coming Soon:**
- v1.1: More challenge packs, dark mode, search
- v2.0: Authentication, social features, community packs
- v3.0: Enterprise features, multi-database support

---

**Built with ❤️ by Escola de Dados**
