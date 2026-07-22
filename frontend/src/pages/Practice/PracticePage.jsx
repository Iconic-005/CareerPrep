import { useAuth } from '../../context/AuthContext.jsx';
import { usePractice } from '../../hooks/usePractice.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { AppFooter } from '../../components/Layout/AppFooter.jsx';
import { getInitials } from '../../utils/helpers.js';

export default function PracticePage() {
  const { user } = useAuth();
  const {
    mode, setMode,
    problemTitle,
    language, setLanguage,
    code, setCode,
    consoleTab, setConsoleTab,
    consoleOutput,
    isExecuting,
    codingTimer,
    aptitudeTimer,
    activeCategory, setActiveCategory,
    selectedOption,
    accuracy,
    streak,
    toastMsg,
    formatTimer,
    handleRunCode,
    handleSelectOption,
  } = usePractice();

  const userInitials = getInitials(user?.name);

  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content main-content--practice">
        {/* TOP NAVBAR SWITCHER */}
        <header className="practice-mode-navbar">
          <div className="practice-brand-row header-brand-container">
            <h1 className="brand-header-logo">CareerPrep Practice</h1>
          </div>

          <div className="practice-mode-tabs">
            <button
              type="button"
              className={`mode-tab ${mode === 'coding' ? 'mode-tab--active' : ''}`}
              onClick={() => setMode('coding')}
            >
              <Icon name="code" />
              <span>Coding Arena (IDE)</span>
            </button>
            <button
              type="button"
              className={`mode-tab ${mode === 'aptitude' ? 'mode-tab--active' : ''}`}
              onClick={() => setMode('aptitude')}
            >
              <Icon name="brain" />
              <span>Aptitude Practice</span>
            </button>
          </div>

          <div className="page-header__actions">
            <div className="rm-avatar-chip">{userInitials}</div>
          </div>
        </header>

        {toastMsg ? (
          <div className="profile-toast">
            <Icon name="checkCircle" />
            <span>{toastMsg}</span>
          </div>
        ) : null}

        {/* MODE 1: CODING IDE VIEW */}
        {mode === 'coding' ? (
          <div className="coding-ide-wrapper">
            <div className="coding-problem-header">
              <div className="problem-header-left">
                <span className="problem-number-badge">#142</span>
                <h2>{problemTitle}</h2>
                <span className="difficulty-tag difficulty-tag--medium">Medium</span>
              </div>
              <div className="problem-header-right">
                <div className="copilot-badge">
                  <span className="copilot-icon">AI</span>
                  <span>Gemini Evaluation Active</span>
                </div>
              </div>
            </div>

            <div className="coding-ide-body">
              {/* LEFT PANEL: DESCRIPTION & CONSTRAINTS */}
              <div className="problem-details-panel">
                <div className="panel-section">
                  <h4 className="details-section-label">DESCRIPTION</h4>
                  <p className="description-text">
                    Given the <code className="code-inline">head</code> of a linked list, return the node where the cycle begins. If there is no cycle, return <code className="code-inline">null</code>.
                  </p>
                </div>

                <div className="panel-section">
                  <h4 className="details-section-label">EXAMPLES</h4>
                  <div className="example-card">
                    <strong>Example 1</strong>
                    <div className="example-code">
                      <div>Input: head = [3,2,0,-4], pos = 1</div>
                      <div>Output: tail connects to node index 1</div>
                    </div>
                  </div>
                </div>

                <div className="panel-section">
                  <h4 className="details-section-label">GEMINI AI HINT</h4>
                  <div className="ai-analysis-card">
                    <div className="ai-analysis-icon">
                      <Icon name="bulb" />
                    </div>
                    <div>
                      <h5>Floyd's Tortoise and Hare</h5>
                      <p>Use slow and fast pointers. When they meet, reset slow to head and step both by 1 until they intersect at the cycle start.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: CODE EDITOR & CONSOLE */}
              <div className="code-editor-panel">
                <div className="editor-top-bar">
                  <div className="editor-top-left">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="language-selector"
                    >
                      <option value="Python 3">Python 3</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="C++">C++</option>
                      <option value="Java">Java</option>
                    </select>
                  </div>
                </div>

                <div className="dark-code-container">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="dark-code-textarea"
                    spellCheck="false"
                  />
                </div>

                <div className="ide-console-panel">
                  <div className="console-tabs-bar">
                    <button
                      type="button"
                      className={`console-tab ${consoleTab === 'console' ? 'console-tab--active' : ''}`}
                      onClick={() => setConsoleTab('console')}
                    >
                      Gemini Evaluation Console
                    </button>
                  </div>

                  <div className="console-output-area">
                    {consoleOutput ? (
                      <div className="console-result">
                        <div className="console-status-line">
                          <Icon name="checkCircle" />
                          <span>{consoleOutput.message}</span>
                        </div>
                        <div className="console-runtime">{consoleOutput.runtime}</div>
                        {consoleOutput.complexity && <p style={{ fontSize: '0.85rem', color: '#93c5fd', margin: '4px 0 0 0' }}>Complexity: {consoleOutput.complexity}</p>}
                        {consoleOutput.review && <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '6px 0 0 0' }}>AI Review: {consoleOutput.review}</p>}
                      </div>
                    ) : (
                      <div className="console-placeholder">Click "Run &amp; Evaluate Code with AI" to test your solution using Gemini.</div>
                    )}

                    <div className="console-actions">
                      <button
                        type="button"
                        className="ide-btn ide-btn--submit"
                        onClick={handleRunCode}
                        disabled={isExecuting}
                      >
                        <Icon name="spark" />
                        <span>{isExecuting ? 'Evaluating Code with Gemini AI...' : 'Run & Evaluate Code with AI'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAR RIGHT FLOATING SIDEBAR TOOLBAR */}
              <aside className="ide-floating-toolbar">
                <div className="toolbar-item" title="Session Timer">
                  <Icon name="clock" />
                  <span className="toolbar-timer">{formatTimer(codingTimer)}</span>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          /* MODE 2: APTITUDE PRACTICE VIEW */
          <div className="aptitude-practice-wrapper">
            <div className="aptitude-page-header">
              <h2>Aptitude Practice</h2>
              <div className="aptitude-header-actions">
                <div className="aptitude-timer-chip">
                  <Icon name="clock" />
                  <span>{formatTimer(aptitudeTimer)}</span>
                </div>
              </div>
            </div>

            <div className="aptitude-categories-grid">
              {['Quantitative', 'Logical', 'Verbal', 'Data Interpretation'].map((cat) => (
                <div
                  key={cat}
                  className={`aptitude-cat-card ${activeCategory === cat ? 'aptitude-cat-card--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{ cursor: 'pointer' }}
                >
                  <h4>{cat}</h4>
                  <p>Practice Drills &amp; AI Analysis</p>
                </div>
              ))}
            </div>

            <div className="aptitude-content-layout">
              <div className="aptitude-main-area">
                <div className="aptitude-progress-box">
                  <div className="aptitude-progress-header">
                    <span className="question-count">Question 6 of 20</span>
                    <span className="accuracy-count">{accuracy}% Accuracy today</span>
                  </div>
                  <div className="aptitude-progress-track">
                    <div className="aptitude-progress-fill" style={{ width: '30%' }} />
                  </div>
                </div>

                {/* QUESTION CONTAINER CARD */}
                <div className="aptitude-question-card">
                  <span className="category-pill-tag">{activeCategory} Reasoning</span>

                  <h3 className="question-prompt">
                    A project team of 5 engineers can complete a feature module in 12 days. If 2 additional engineers join the team with identical productivity after 3 days of work, how many total days will it take to finish the module?
                  </h3>

                  {/* MULTIPLE CHOICE OPTIONS */}
                  <div className="aptitude-options-list">
                    {[
                      { label: 'A', text: '8.4 Days' },
                      { label: 'B', text: '9.4 Days' },
                      { label: 'C', text: '10.0 Days' },
                      { label: 'D', text: '11.2 Days' },
                    ].map((opt) => {
                      const isSelected = selectedOption === opt.label;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          className={`aptitude-option-btn ${isSelected ? 'aptitude-option-btn--selected' : ''}`}
                          onClick={() => handleSelectOption(opt.label)}
                        >
                          <div className={`option-badge ${isSelected ? 'option-badge--selected' : ''}`}>
                            {opt.label}
                          </div>
                          <span className="option-text">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT PERFORMANCE SIDEBAR */}
              <div className="aptitude-side-area">
                <div className="aptitude-widget-card">
                  <h4 className="widget-label-title">Real-time Performance</h4>

                  <div className="performance-gauge-row">
                    <div className="circular-gauge">
                      <svg viewBox="0 0 36 36" className="gauge-svg">
                        <path
                          className="gauge-bg"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="gauge-fill"
                          strokeDasharray={`${accuracy}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="gauge-center-text">
                        <strong>{accuracy}<span>%</span></strong>
                      </div>
                    </div>

                    <div className="gauge-info">
                      <strong>Current Accuracy</strong>
                      <p>+4% from last session</p>
                    </div>
                  </div>

                  <div className="performance-metrics-grid">
                    <div className="metric-box">
                      <div className="metric-box__header">
                        <Icon name="clock" />
                      </div>
                      <strong className="metric-value">42s</strong>
                      <span className="metric-label">Avg. per Q</span>
                    </div>

                    <div className="metric-box">
                      <div className="metric-box__header">
                        <Icon name="lightning" />
                      </div>
                      <strong className="metric-value">{streak}</strong>
                      <span className="metric-label">Streak</span>
                    </div>
                  </div>
                </div>

                <div className="global-ranking-banner">
                  <div className="ranking-banner-overlay" />
                  <div className="ranking-banner-content">
                    <span className="ranking-eyebrow">GLOBAL RANKING</span>
                    <h3>Top 5% of Applicants</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <AppFooter />
      </main>
    </div>
  );
}
