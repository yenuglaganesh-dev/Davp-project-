# Library Inventory Analytics Dashboard
### Interactive Data Analysis & Business Intelligence Using Python, Plotly Dash, and Modern Web Architecture

[![Python Version](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-blue)](https://www.python.org/)
[![Dash](https://img.shields.io/badge/dash-2.14%2B-0080FF)](https://dash.plotly.com/)
[![Plotly](https://img.shields.io/badge/plotly-5.18%2B-3F4F75)](https://plotly.com/python/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 1. Project Overview
The **Library Inventory Analytics Dashboard** transforms the original exploratory Jupyter notebook (`Textbooks_in_Library_Analysis_Using_Python.ipynb`) into a production-grade, interactive, full-stack analytical web platform and digital library.

Built using **React 18, Vite, React Bits GridMotion & LogoLoop, Lucide Icons, and Python / Pandas / NumPy Analytics**, this application equips university libraries, school media centers, students, and catalog managers with real-time inventory intelligence, curriculum freshness tracking, copy availability metrics, financial valuation, and flexible dataset ingestion.

### 🌟 New Modern Academic Digital Library Features:
- **React Bits `<GridMotion />` Animated Background**: Multi-row drifting wall of authentic academic textbook covers with cursor parallax, spotlight illumination, edge fading, and responsive reduced-motion support.
- **React Bits `<LogoLoop />` Platforms Marquee**: Infinite seamless ticker highlighting verified open educational platforms (OpenStax, Project Gutenberg, DOAB, Open Library, Internet Archive, Google Books, NDLI, Python, Plotly, React).
- **Comprehensive Subject Disciplines**: Curated collections covering 17 academic disciplines with instant subject filtering.
- **Full Catalog Management**: Real-time search, add, edit, and delete functionality with persistent local storage.
- **CSV & JSON Ingestion & Export**: Immediate export to `library_textbooks_catalog.csv` and drag-and-drop file upload.
- **Python / Plotly Analytical Visualizations**: 8 Executive KPI cards, horizontal ranked subject bar charts, stock availability donut, publication timeline histogram, financial portfolio breakdown, and 1.5×IQR statistical price outlier analysis.

---

## 2. Quick Start (Web Application)

### Prerequisites:
- Node.js 18+ (tested on Node.js 24)
- npm or pnpm

### Running the React Application:
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build
```
Navigate to `http://localhost:5173` in your browser.

---

## 2. Key Pages and Features

### Page 1: Overview Dashboard (`/` or `/overview`)
- **8 Executive KPI Cards**:
  - Total Book Records
  - Unique Book Titles
  - Total Copies in Stock
  - Available Copies (with shelf percentage)
  - Borrowed Copies
  - Average Book Price (₹)
  - Total Estimated Inventory Value (₹)
  - Number of Academic Subjects
- **5 Core Visualizations**:
  - Textbook Catalog by Subject (horizontal ranked bar)
  - Top Publishers Volume Distribution
  - Available vs. Borrowed Physical Copies (donut chart)
  - Publication Year Longitudinal Timeline (spline area chart)
  - Estimated Inventory Value by Subject (financial allocation bar chart)

### Page 2: Subject Analysis (`/subject-analysis`)
- Leading subject catalog volume, highest availability rate, and critical deficit subject highlights.
- Grouped multi-bar comparison of Total Copies, Available Copies, and Borrowed Copies by academic discipline.
- Subject-wise availability percentage with **50% target benchmark** reference line.
- Subject proportion share donut chart.
- Price distribution boxplot across top subjects showing median and outlier bounds.
- Comprehensive subject aggregation data table.

### Page 3: Publisher Analysis (`/publisher-analysis`)
- Representation ranking of top 10 publishing houses.
- Average textbook unit price comparison across publishers.
- Cumulative inventory valuation portfolio by publisher.
- Interactive publisher summary table with record counts, total volume, and valuations.

### Page 4: Inventory Analysis (`/inventory-analysis`)
- Stock health categorization: Adequate Stock (>3 copies), Low Stock (1–3 copies), and Out of Stock (0 copies).
- Low-stock replenishment alert table flagging critical titles requiring urgent reorders.
- Distribution across library shelf sections (A through H) for logistics and space planning.
- Interactive Price vs. Total Copies scatter plot with hover metadata (Title, Publisher, Shelf, Year).
- **1.5 × IQR Statistical Outlier Detection** table (Q1, Median, Q3, IQR, Lower/Upper bounds, Outlier counts) with interactive boxplot selector.

### Page 5: Publication Analysis (`/publication-analysis`)
- Curriculum freshness and edition aging metrics.
- Publication year trends over collection history.
- Textbook age distribution histogram (calculated relative to current calendar year).
- Age bracket categorization: Recent (<4 years), Standard (4–9 years), and Outdated (≥10 years).
- Stacked publication years distribution by academic subject.
- Outdated edition identification table flagging textbooks for syllabus and curriculum replacement.

### Page 6: Data Explorer (`/data-explorer`)
- High-performance, multi-column search across Book Title, Author, ISBN, Shelf, Subject, and Publisher.
- Interactive filtering by Subject, Publisher, Year Range, and Price Slider.
- Sortable, paginated `DataTable` with low-stock conditional formatting.
- Instant filtered dataset export to CSV (`library_inventory_filtered.csv`).

### Page 7: Data Upload & Dynamic Ingestion (`/data-upload`)
- Drag-and-drop file ingestion supporting both **CSV** and **Excel (.xlsx, .xls)** spreadsheets.
- **Fuzzy schema mapping**: detects column variations (e.g., `Acc No` -> `BookID`, `Dept` -> `Subject`, `MRP` -> `Price`, `Qty` -> `TotalCopies`).
- Automated data cleaning: handles null representations, removes exact duplicate rows, imputes missing numbers via medians, and fills missing text with standard placeholders.
- Real-time audit metrics: Initial rows, duplicates purged, missing cells handled, and final clean rows.
- Missing values diagnostic bar chart and schema detection table.
- Clean dataset preview table with one-click "Restore Default Dataset" button.

---

## 3. Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Python 3.11+** | Backend computational engine and runtime |
| **Pandas** | High-performance DataFrame manipulation, cleaning, and aggregation |
| **NumPy** | Array transformations, vectorization, median calculations, and RNG simulations |
| **Plotly Express & Graph Objects** | Interactive, publication-ready data visualizations |
| **Dash (Plotly)** | Reactive multi-page web framework and callback orchestration |
| **Dash Bootstrap Components** | Responsive grid layout, modern cards, navbars, and icons |
| **OpenPyXL** | Native Excel spreadsheet (.xlsx, .xls) parsing |
| **Gunicorn** | High-concurrency WSGI production HTTP server |
| **HTML5 & CSS3** | Custom typography, sidebar animations, and modern dashboard styling |

---

## 4. Project Folder Structure

```text
Davp-project-/
│
├── library_dashboard/                      # Core application package
│   ├── app.py                             # Main Dash application & callbacks
│   ├── requirements.txt                   # Application dependencies
│   ├── Procfile                           # Production WSGI process definition
│   ├── render.yaml                        # Render Blueprint configuration
│   │
│   ├── assets/
│   │   └── style.css                      # Modern corporate theme & responsive styling
│   │
│   ├── data/
│   │   └── library_textbooks.csv          # Standard default library dataset (700 records)
│   │
│   ├── components/
│   │   ├── __init__.py
│   │   ├── sidebar.py                     # Responsive sidebar with cross-filters
│   │   ├── navbar.py                      # Top header with dynamic data source badges
│   │   ├── kpi_cards.py                   # Reusable executive KPI widgets
│   │   └── charts.py                      # Card wrappers for Plotly figures
│   │
│   ├── pages/
│   │   ├── __init__.py
│   │   ├── overview.py                    # Page 1: Overview Dashboard
│   │   ├── subject_analysis.py            # Page 2: Subject Analysis
│   │   ├── publisher_analysis.py          # Page 3: Publisher Analysis
│   │   ├── inventory_analysis.py          # Page 4: Inventory Health & Outliers
│   │   ├── publication_analysis.py        # Page 5: Publication Trends & Currency
│   │   ├── data_explorer.py               # Page 6: Search, Filter, Sort & Export
│   │   └── data_upload.py                 # Page 7: Drag-and-drop Ingestion & Audit
│   │
│   └── utils/
│       ├── __init__.py
│       ├── data_loader.py                 # Dataset loading, demo fallback, and base64 parsing
│       ├── data_cleaning.py               # Column standardization, imputation, feature engineering
│       ├── analysis.py                    # KPIs, aggregations, IQR outliers, correlations
│       └── visualizations.py              # 22 interactive Plotly chart generators
│
├── app.py                                 # Root entry point delegating to library_dashboard
├── requirements.txt                       # Root requirements for deployments
├── Procfile                               # Root Procfile for cloud hosting
├── render.yaml                            # Root Render Blueprint
├── test_callbacks.py                      # Integration test suite (12 tests)
├── Textbooks_in_Library_Analysis_Using_Python.ipynb  # Original analysis notebook
└── README.md                              # Complete project documentation
```

---

## 5. Local Installation & Running Instructions

### Prerequisites
- Python 3.10, 3.11, or 3.12 installed on your machine.
- Git installed.

### Step 1: Clone the Repository
```bash
git clone https://github.com/yenuglaganesh-dev/Davp-project-.git
cd Davp-project-
```

### Step 2: Create and Activate a Virtual Environment
- **On Windows (PowerShell)**:
  ```powershell
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  ```
- **On macOS / Linux**:
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the Application
You can run the dashboard from the repository root:
```bash
python app.py
```
Or directly from the package directory:
```bash
python library_dashboard/app.py
```

### Step 5: Open in Your Browser
Open your favorite web browser and navigate to:
```text
http://127.0.0.1:8050
```

---

## 6. Running Integration Tests
To verify all routing, data cleaning, statistical modules, Plotly charts, and Dash callbacks:
```bash
python test_callbacks.py
```
All 12 integration tests will execute and confirm 100% test pass status.

---

## 7. Deployment Instructions (Render)

This application is ready for deployment on [Render](https://render.com) as a Web Service.

### Option A: Using the Included `render.yaml` Blueprint
1. Push your repository to GitHub.
2. In Render, select **New** -> **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically read `render.yaml`, configure Python 3.11, run `pip install -r requirements.txt`, and start the app with Gunicorn.

### Option B: Manual Web Service Configuration on Render
1. Create a **New Web Service** connected to your repository.
2. Set the following parameters:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:server --workers 4 --threads 2 --timeout 120`
3. Click **Deploy**.

---

## 8. Git and GitHub Commands

To commit and push your project to GitHub:

```bash
# Check modified and created files
git status

# Add all files to staging
git add .

# Commit your changes with a clear message
git commit -m "Complete interactive Library Inventory Analytics Dashboard with multi-page Dash UI, Plotly charts, and data upload"

# Push to your GitHub main branch
git push origin main
```

---

## 9. AI-Assisted Development Architecture

This project was developed with a multi-model AI-assisted workflow:
- **Project Architecture & Planning**: Formulating clean separation of concerns across `components/`, `pages/`, and `utils/`.
- **Analytical Preservation**: Faithfully preserving NumPy operations, IQR outlier detection, covariance calculations, and median imputations from the original notebook.
- **Interactive UI & Visual Aesthetics**: Designing responsive CSS layouts, modern Indigo/Slate palettes, and interactive tooltips.
- **Robust Integration Testing**: Diagnosing edge cases (such as Pandas 2.0 JSON deserialization and Dash callback contexts) to ensure crash-free execution.

---

## 10. Data Governance & Disclaimer
> [!NOTE]
> When no user dataset is uploaded, the application loads the standard default dataset (`library_textbooks.csv`), which includes illustrative synthetic inventory records generated using NumPy. The dashboard dynamically displays a yellow **"Demo Data (Illustrative Only)"** badge to maintain data governance and transparency. When a user uploads an authentic file, the badge switches to green with the validated file name.
