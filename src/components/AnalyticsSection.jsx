import React, { useState, useMemo } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, DollarSign, BookOpen, 
  Layers, Package, CheckCircle, AlertOctagon, HelpCircle, 
  ArrowUpRight, ShieldCheck, ChevronRight
} from 'lucide-react';
import { computeLibraryAnalytics } from '../data/analyticsData';

export default function AnalyticsSection({ books = [] }) {
  const [activeTab, setActiveTab] = useState('SUBJECTS'); // SUBJECTS, COPIES, TIMELINE, VALUATION, IQR

  const analytics = useMemo(() => {
    return computeLibraryAnalytics(books);
  }, [books]);

  if (!analytics) return null;

  const {
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
    iqrStats
  } = analytics;

  // Max count for subject normalization
  const maxSubjectCount = Math.max(...subjectStats.map(s => s.count), 1);
  const maxYearCount = Math.max(...yearStats.map(y => y.count), 1);
  const maxValuation = Math.max(...subjectStats.map(s => s.valuation), 1);

  return (
    <section id="analytics" className="analytics-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-block">
          <div className="section-badge">
            <BarChart3 size={14} />
            <span>Python & Plotly Data Analytics Dashboard</span>
          </div>
          <h2 className="section-title">Library Inventory Analytics & Intelligence</h2>
          <p className="section-subtitle">
            Faithfully derived from our exploratory Python analysis (<code>Textbooks_in_Library_Analysis_Using_Python.ipynb</code>). Real-time inventory metrics, curriculum freshness, availability benchmarks, and financial valuation.
          </p>
        </div>

        {/* 8 Executive KPI Cards */}
        <div className="kpi-cards-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Total Book Records</span>
              <div className="kpi-icon-box bg-blue-subtle text-blue"><BookOpen size={18} /></div>
            </div>
            <div className="kpi-value">{totalRecords}</div>
            <div className="kpi-caption">Indexed across curriculum</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Unique Book Titles</span>
              <div className="kpi-icon-box bg-indigo-subtle text-indigo"><Layers size={18} /></div>
            </div>
            <div className="kpi-value">{uniqueTitles}</div>
            <div className="kpi-caption">Distinct academic editions</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Total Physical Copies</span>
              <div className="kpi-icon-box bg-cyan-subtle text-cyan"><Package size={18} /></div>
            </div>
            <div className="kpi-value">{totalCopies.toLocaleString()}</div>
            <div className="kpi-caption">Combined inventory volume</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Available on Shelf</span>
              <div className="kpi-icon-box bg-emerald-subtle text-emerald"><CheckCircle size={18} /></div>
            </div>
            <div className="kpi-value text-emerald">{availableCopies.toLocaleString()}</div>
            <div className="kpi-caption">
              <span className="kpi-tag-good">{availabilityRate}% Availability</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Currently Borrowed</span>
              <div className="kpi-icon-box bg-amber-subtle text-amber"><TrendingUp size={18} /></div>
            </div>
            <div className="kpi-value text-amber">{borrowedCopies.toLocaleString()}</div>
            <div className="kpi-caption">Active student checkouts</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Average Book Price</span>
              <div className="kpi-icon-box bg-purple-subtle text-purple"><DollarSign size={18} /></div>
            </div>
            <div className="kpi-value">₹{avgPrice.toLocaleString()}</div>
            <div className="kpi-caption">Unit median estimate</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Total Inventory Valuation</span>
              <div className="kpi-icon-box bg-teal-subtle text-teal"><DollarSign size={18} /></div>
            </div>
            <div className="kpi-value text-teal">₹{Math.round(totalValuation / 1000).toLocaleString()}k</div>
            <div className="kpi-caption">Asset valuation portfolio</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Academic Subjects</span>
              <div className="kpi-icon-box bg-rose-subtle text-rose"><Layers size={18} /></div>
            </div>
            <div className="kpi-value">{subjectStats.length}</div>
            <div className="kpi-caption">Distinct disciplines</div>
          </div>
        </div>

        {/* Visual Analytics Tab Switcher */}
        <div className="analytics-tabs-container">
          <div className="analytics-tabs-nav">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'SUBJECTS' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('SUBJECTS')}
            >
              <BarChart3 size={15} />
              <span>Catalog by Subject</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'COPIES' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('COPIES')}
            >
              <PieChart size={15} />
              <span>Stock & Availability</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'TIMELINE' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('TIMELINE')}
            >
              <TrendingUp size={15} />
              <span>Publication Timeline</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'VALUATION' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('VALUATION')}
            >
              <DollarSign size={15} />
              <span>Financial Allocation</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'IQR' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('IQR')}
            >
              <AlertOctagon size={15} />
              <span>1.5×IQR Statistical Outliers</span>
            </button>
          </div>
        </div>

        {/* Chart View Content Panels */}
        <div className="chart-view-card">
          {/* TAB 1: Catalog Volume by Subject */}
          {activeTab === 'SUBJECTS' && (
            <div className="chart-panel">
              <div className="chart-panel-header">
                <div>
                  <h3 className="chart-title">Textbook Catalog Distribution by Subject</h3>
                  <p className="chart-desc">Horizontal ranked comparison of volumes and physical stock across disciplines.</p>
                </div>
                <span className="chart-badge">Ranked Ranking</span>
              </div>

              <div className="subject-bars-list">
                {subjectStats.map((item, idx) => {
                  const pct = Math.round((item.count / maxSubjectCount) * 100);
                  const availPct = item.totalCopies > 0 ? Math.round((item.available / item.totalCopies) * 100) : 0;

                  return (
                    <div key={item.name} className="subject-bar-row">
                      <div className="subject-name-col">
                        <span className="bar-rank-num">#{idx + 1}</span>
                        <span className="bar-label">{item.name}</span>
                      </div>
                      <div className="bar-progress-col">
                        <div className="bar-track">
                          <div
                            className="bar-fill-glow"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <div className="bar-values-col">
                        <span className="bar-count">{item.count} titles</span>
                        <span className="bar-copies-detail">({item.available}/{item.totalCopies} avail • {availPct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Stock Availability Donut & Shelf logistics */}
          {activeTab === 'COPIES' && (
            <div className="chart-panel">
              <div className="chart-panel-header">
                <div>
                  <h3 className="chart-title">Physical Copies Status & Shelf Section Distribution</h3>
                  <p className="chart-desc">Circulation balance and physical inventory allocation across library racks (A-H).</p>
                </div>
              </div>

              <div className="donut-and-shelves-grid">
                {/* Donut representation */}
                <div className="donut-stat-box">
                  <div className="circular-chart-frame">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path
                        className="circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--border-subtle, #E0EEE3)"
                        strokeWidth="3.8"
                      />
                      <path
                        className="circle-fill-avail"
                        strokeDasharray={`${availabilityRate}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#7BCB91"
                        strokeWidth="3.8"
                      />
                    </svg>
                    <div className="circular-center-text">
                      <span className="circle-pct">{availabilityRate}%</span>
                      <span className="circle-label">Shelf Rate</span>
                    </div>
                  </div>

                  <div className="donut-legend-rows">
                    <div className="legend-row">
                      <span className="legend-dot bg-emerald" />
                      <span className="legend-name">Available on Shelf</span>
                      <span className="legend-val text-emerald">{availableCopies.toLocaleString()} copies ({availabilityRate}%)</span>
                    </div>
                    <div className="legend-row">
                      <span className="legend-dot bg-amber" />
                      <span className="legend-name">Borrowed / In Circulation</span>
                      <span className="legend-val text-amber">{borrowedCopies.toLocaleString()} copies ({(100 - parseFloat(availabilityRate)).toFixed(1)}%)</span>
                    </div>
                    <div className="legend-benchmark-note">
                      <ShieldCheck size={13} className="text-emerald" />
                      <span>Benchmark Target: ≥50% copy availability maintained across core syllabi.</span>
                    </div>
                  </div>
                </div>

                {/* Shelf Section logistics */}
                <div className="shelf-logistics-box">
                  <h4 className="shelf-subheading">Storage Distribution across Shelf Racks</h4>
                  <div className="shelves-grid">
                    {shelfStats.map(s => (
                      <div key={s.section} className="shelf-tile">
                        <span className="shelf-title">{s.section}</span>
                        <span className="shelf-number">{s.count}</span>
                        <span className="shelf-unit">titles</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Publication Timeline */}
          {activeTab === 'TIMELINE' && (
            <div className="chart-panel">
              <div className="chart-panel-header">
                <div>
                  <h3 className="chart-title">Publication Year Longitudinal Timeline</h3>
                  <p className="chart-desc">Historical collection acquisition and edition freshness distribution (2005 - 2026).</p>
                </div>
              </div>

              <div className="timeline-histogram">
                {yearStats.map(y => {
                  const heightPct = Math.max(12, Math.round((y.count / maxYearCount) * 100));

                  return (
                    <div key={y.year} className="histogram-col">
                      <span className="histogram-count">{y.count}</span>
                      <div className="histogram-bar-track">
                        <div
                          className="histogram-bar-fill"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="histogram-year-label">{y.year}</span>
                    </div>
                  );
                })}
              </div>

              <div className="freshness-analysis-box">
                <div className="freshness-card recent">
                  <span className="badge-fresh">Recent (&lt; 4 Years)</span>
                  <span className="freshness-desc">Cutting-edge editions reflecting current technological & syllabus standards.</span>
                </div>
                <div className="freshness-card standard">
                  <span className="badge-standard">Standard (4 - 9 Years)</span>
                  <span className="freshness-desc">Stable core reference textbooks and foundational mathematical treatises.</span>
                </div>
                <div className="freshness-card outdated">
                  <span className="badge-outdated">Review Candidate (≥ 10 Years)</span>
                  <span className="freshness-desc">Scheduled for curriculum alignment review and edition replacement.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Financial Valuation by Subject */}
          {activeTab === 'VALUATION' && (
            <div className="chart-panel">
              <div className="chart-panel-header">
                <div>
                  <h3 className="chart-title">Estimated Inventory Valuation Portfolio by Subject</h3>
                  <p className="chart-desc">Financial allocation of textbook assets in Indian Rupees (₹) based on unit price and total copy volume.</p>
                </div>
              </div>

              <div className="valuation-bars-list">
                {subjectStats.map((item) => {
                  const pct = Math.round((item.valuation / maxValuation) * 100);

                  return (
                    <div key={item.name} className="valuation-bar-row">
                      <span className="val-subject-name">{item.name}</span>
                      <div className="val-track">
                        <div
                          className="val-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="val-amount">₹{item.valuation.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: 1.5x IQR Statistical Outlier Detection */}
          {activeTab === 'IQR' && (
            <div className="chart-panel">
              <div className="chart-panel-header">
                <div>
                  <h3 className="chart-title">1.5 × IQR Statistical Outlier Detection on Textbook Pricing</h3>
                  <p className="chart-desc">Faithfully applying NumPy quartile algorithms from our original notebook to detect premium acquisition outliers.</p>
                </div>
                <span className="chart-badge bg-rose text-rose">Statistical Audit</span>
              </div>

              <div className="iqr-summary-grid">
                <div className="iqr-metric-card">
                  <span className="iqr-label">1st Quartile (Q1 - 25%)</span>
                  <span className="iqr-val">₹{iqrStats.q1}</span>
                </div>
                <div className="iqr-metric-card">
                  <span className="iqr-label">Median (Q2 - 50%)</span>
                  <span className="iqr-val text-blue">₹{iqrStats.median}</span>
                </div>
                <div className="iqr-metric-card">
                  <span className="iqr-label">3rd Quartile (Q3 - 75%)</span>
                  <span className="iqr-val">₹{iqrStats.q3}</span>
                </div>
                <div className="iqr-metric-card">
                  <span className="iqr-label">Interquartile Range (IQR)</span>
                  <span className="iqr-val text-cyan">₹{iqrStats.iqr}</span>
                </div>
                <div className="iqr-metric-card">
                  <span className="iqr-label">Lower Bound (Q1 - 1.5×IQR)</span>
                  <span className="iqr-val">₹{iqrStats.lowerBound}</span>
                </div>
                <div className="iqr-metric-card">
                  <span className="iqr-label">Upper Bound (Q3 + 1.5×IQR)</span>
                  <span className="iqr-val text-amber">₹{iqrStats.upperBound}</span>
                </div>
                <div className="iqr-metric-card">
                  <span className="iqr-label">Detected Outliers</span>
                  <span className="iqr-val text-emerald">{iqrStats.outliers} books</span>
                </div>
              </div>

              <div className="iqr-callout-note">
                <ShieldCheck size={16} className="text-emerald" />
                <p>
                  <strong>Statistical Integrity:</strong> Textbooks priced beyond <strong>₹{iqrStats.upperBound}</strong> are tagged as high-value specialized academic monographs requiring faculty reference checkout protocols.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

