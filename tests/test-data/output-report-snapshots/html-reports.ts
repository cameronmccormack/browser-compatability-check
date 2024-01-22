const EXPECTED_HEAD = `
<head><title>Kompat Report</title><link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" type="text/css"/><style>body {
  font-family: Lato, sans-serif;
  background-color: #F6BF4F;
  color: #331F00;
}

li {
  width: fit-content;
}

dt {
  width: fit-content;
}

table {
  display: block;
  overflow-x: auto;
  border-collapse: collapse;
  border: 4px solid #F6BF4F
}

table tbody {
    display: table;
    width: 100%;
}

th {
  text-align: left;
  background-color: #F6BF4F;
  padding: 0.25rem;
}

td {
  padding: 0.25rem;
}

.result {
  font-family: Lucida Console, monospace;
  font-weight: bold;
  padding: 0.25rem;
}

.bold {
  font-weight: bold;
}

.pass {
  color: white;
  background-color: #148A00;
}

.pass-cell {
  color: #148A00;
}

.warn {
  color: black;
  background-color: #FFB32B;
}

.warn-cell {
  color: black;
  background-color: #FFB32B;
}

.fail {
  color: white;
  background-color: #E51854;
}

.fail-cell {
  color: white;
  background-color: #E51854;
}

.heading-wrapper {
  margin: 1rem;
  text-align: center;
}

.summary-wrapper {
  margin: 1rem;
  padding: 0.5rem 2rem;
  background-color: #FFEECB;
  border-radius: 2rem;
}

.report-wrapper {
  margin: 2rem 0;
  padding: 0.5rem 2rem;
  background-color: white;
  border-radius: 2rem;
}

.logo-heading {
  color: #331F00;
  letter-spacing: 0.5em;
  margin: 0.5rem;
  font-weight: 200;
}

.copyright {
  color: #331F00;
  margin: 0.5rem;
  font-size: 0.75em;
  letter-spacing: 0.25em;
}</style></head>
`.trim();

export const compatibleHtmlReportSnapshot = `
<html lang="en-GB">${EXPECTED_HEAD}<body><main><div class="heading-wrapper"><img src="static/logo.svg" alt="Kompat Logo" width="288"/><h1 class="logo-heading">KOMPAT</h1><div class="copyright">COPYRIGHT &copy; 2023 CAMERON MCCORMACK</div></div><div class="summary-wrapper"><h2>Overall Summary: <span class="pass result">PASS</span></h2><div class="report-wrapper"><dl><dt class="pass result report-summary-status">PASS:</dt><dd class="bold"><a href="#report-0">example/filepath/eg-file.css</a></dd></dl></div></div><div class="summary-wrapper"><h2>Summary of All Stylesheets:</h2><div class="report-wrapper"><h3 id="report-0"><span class="pass result">PASS</span> example/filepath/eg-file.css</h3><h4>High-level Summary</h4><table><tr><th>Browser</th><th>Compatible</th><th>Partial Support</th><th>Flagged</th><th>Incompatible</th><th>Unknown</th></tr><tr><td>chrome</td><td class="pass-cell">4</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td></tr></table><h4>Unknown features:</h4><ul><li class="pass-cell">None</li></ul><h4>Per-feature Summary</h4><table><tr><th>Rule Identifier<th>chrome</th></th></tr><tr><td>property:color:red<td class="pass-cell">compatible</td></td></tr><tr><td>selector:last-child<td class="pass-cell">compatible</td></td></tr><tr><td>at-rule:charset<td class="pass-cell">compatible</td></td></tr><tr><td>function:calc<td class="pass-cell">compatible</td></td></tr></table></div></div></main></body></html>
`.trim();

export const partiallyCompatibleReportSnapshot = `
<html lang="en-GB">${EXPECTED_HEAD}<body><main><div class="heading-wrapper"><img src="static/logo.svg" alt="Kompat Logo" width="288"/><h1 class="logo-heading">KOMPAT</h1><div class="copyright">COPYRIGHT &copy; 2023 CAMERON MCCORMACK</div></div><div class="summary-wrapper"><h2>Overall Summary: <span class="warn result">WARN</span></h2><div class="report-wrapper"><dl><dt class="warn result report-summary-status">WARN:</dt><dd class="bold"><a href="#report-0">example/filepath/eg-file.css</a></dd></dl></div></div><div class="summary-wrapper"><h2>Summary of All Stylesheets:</h2><div class="report-wrapper"><h3 id="report-0"><span class="warn result">WARN</span> example/filepath/eg-file.css</h3><h4>High-level Summary</h4><table><tr><th>Browser</th><th>Compatible</th><th>Partial Support</th><th>Flagged</th><th>Incompatible</th><th>Unknown</th></tr><tr><td>chrome</td><td class="pass-cell">3</td><td class="warn-cell">1</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td></tr></table><h4>Unknown features:</h4><ul><li class="pass-cell">None</li></ul><h4>Per-feature Summary</h4><table><tr><th>Rule Identifier<th>chrome</th></th></tr><tr><td>property:color:red<td class="warn-cell">partial-support</td></td></tr><tr><td>selector:last-child<td class="pass-cell">compatible</td></td></tr><tr><td>at-rule:charset<td class="pass-cell">compatible</td></td></tr><tr><td>function:calc<td class="pass-cell">compatible</td></td></tr></table></div></div></main></body></html>
`.trim();

export const failedCompatibilityReportSnapshot = `
<html lang="en-GB">${EXPECTED_HEAD}<body><main><div class="heading-wrapper"><img src="static/logo.svg" alt="Kompat Logo" width="288"/><h1 class="logo-heading">KOMPAT</h1><div class="copyright">COPYRIGHT &copy; 2023 CAMERON MCCORMACK</div></div><div class="summary-wrapper"><h2>Overall Summary: <span class="warn result">WARN</span></h2><div class="report-wrapper"><dl><dt class="fail result report-summary-status">FAIL:</dt><dd class="bold"><a href="#report-0">example/filepath/eg-file.css</a></dd></dl></div></div><div class="summary-wrapper"><h2>Summary of All Stylesheets:</h2><div class="report-wrapper"><h3 id="report-0"><span class="fail result">FAIL</span> example/filepath/eg-file.css</h3><h4>High-level Summary</h4><table><tr><th>Browser</th><th>Compatible</th><th>Partial Support</th><th>Flagged</th><th>Incompatible</th><th>Unknown</th></tr><tr><td>chrome</td><td class="pass-cell">3</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="fail-cell">1</td><td class="pass-cell">0</td></tr></table><h4>Unknown features:</h4><ul><li class="pass-cell">None</li></ul><h4>Per-feature Summary</h4><table><tr><th>Rule Identifier<th>chrome</th></th></tr><tr><td>property:color:red<td class="fail-cell">incompatible</td></td></tr><tr><td>selector:last-child<td class="pass-cell">compatible</td></td></tr><tr><td>at-rule:charset<td class="pass-cell">compatible</td></td></tr><tr><td>function:calc<td class="pass-cell">compatible</td></td></tr></table></div></div></main></body></html>
`.trim();

export const unknownFeatureCompatibilityReportSnapshot = `
<html lang="en-GB">${EXPECTED_HEAD}<body><main><div class="heading-wrapper"><img src="static/logo.svg" alt="Kompat Logo" width="288"/><h1 class="logo-heading">KOMPAT</h1><div class="copyright">COPYRIGHT &copy; 2023 CAMERON MCCORMACK</div></div><div class="summary-wrapper"><h2>Overall Summary: <span class="warn result">WARN</span></h2><div class="report-wrapper"><dl><dt class="fail result report-summary-status">FAIL:</dt><dd class="bold"><a href="#report-0">example/filepath/eg-file.css</a></dd></dl></div></div><div class="summary-wrapper"><h2>Summary of All Stylesheets:</h2><div class="report-wrapper"><h3 id="report-0"><span class="fail result">FAIL</span> example/filepath/eg-file.css</h3><h4>High-level Summary</h4><table><tr><th>Browser</th><th>Compatible</th><th>Partial Support</th><th>Flagged</th><th>Incompatible</th><th>Unknown</th></tr><tr><td>chrome</td><td class="pass-cell">4</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td></tr></table><h4>Unknown features:</h4><ul><li class="fail-cell">property:not-a-real-feature:20px</li></ul><h4>Per-feature Summary</h4><table><tr><th>Rule Identifier<th>chrome</th></th></tr><tr><td>property:color:red<td class="pass-cell">compatible</td></td></tr><tr><td>selector:last-child<td class="pass-cell">compatible</td></td></tr><tr><td>at-rule:charset<td class="pass-cell">compatible</td></td></tr><tr><td>function:calc<td class="pass-cell">compatible</td></td></tr></table></div></div></main></body></html>
`.trim();

export const customRulesCompatibilityReportSnapshot = `
<html lang="en-GB">${EXPECTED_HEAD}<body><main><div class="heading-wrapper"><img src="static/logo.svg" alt="Kompat Logo" width="288"/><h1 class="logo-heading">KOMPAT</h1><div class="copyright">COPYRIGHT &copy; 2023 CAMERON MCCORMACK</div></div><div class="summary-wrapper"><h2>Overall Summary: <span class="fail result">FAIL</span></h2><div class="report-wrapper"><dl><dt class="pass result report-summary-status">PASS:</dt><dd class="bold"><a href="#report-0">example/filepath/eg-file.css</a></dd></dl></div></div><div class="summary-wrapper"><h2>Summary of All Stylesheets:</h2><div class="report-wrapper"><h3 id="report-0"><span class="pass result">PASS</span> example/filepath/eg-file.css</h3><h4>High-level Summary</h4><table><tr><th>Browser</th><th>Compatible</th><th>Partial Support</th><th>Flagged</th><th>Incompatible</th><th>Unknown</th></tr><tr><td>chrome</td><td class="fail-cell">4</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td></tr></table><h4>Unknown features:</h4><ul><li class="pass-cell">None</li></ul><h4>Per-feature Summary</h4><table><tr><th>Rule Identifier<th>chrome</th></th></tr><tr><td>property:color:red<td class="fail-cell">compatible</td></td></tr><tr><td>selector:last-child<td class="fail-cell">compatible</td></td></tr><tr><td>at-rule:charset<td class="fail-cell">compatible</td></td></tr><tr><td>function:calc<td class="fail-cell">compatible</td></td></tr></table></div></div></main></body></html>
`.trim();

export const summaryOnlyCompatibilityReportSnapshot = `
<html lang="en-GB">${EXPECTED_HEAD}<body><main><div class="heading-wrapper"><img src="static/logo.svg" alt="Kompat Logo" width="288"/><h1 class="logo-heading">KOMPAT</h1><div class="copyright">COPYRIGHT &copy; 2023 CAMERON MCCORMACK</div></div><div class="summary-wrapper"><h2>Overall Summary: <span class="pass result">PASS</span></h2><div class="report-wrapper"><dl><dt class="pass result report-summary-status">PASS:</dt><dd class="bold"><a href="#report-0">example/filepath/eg-file.css</a></dd></dl></div></div><div class="summary-wrapper"><h2>Summary of All Stylesheets:</h2><div class="report-wrapper"><h3 id="report-0"><span class="pass result">PASS</span> example/filepath/eg-file.css</h3><h4>High-level Summary</h4><table><tr><th>Browser</th><th>Compatible</th><th>Partial Support</th><th>Flagged</th><th>Incompatible</th><th>Unknown</th></tr><tr><td>chrome</td><td class="pass-cell">4</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td></tr></table><h4>Unknown features:</h4><ul><li class="pass-cell">None</li></ul></div></div></main></body></html>
`.trim();

export const multipleReportsCompatibilityReportSnapshot = `
<html lang="en-GB">${EXPECTED_HEAD}<body><main><div class="heading-wrapper"><img src="static/logo.svg" alt="Kompat Logo" width="288"/><h1 class="logo-heading">KOMPAT</h1><div class="copyright">COPYRIGHT &copy; 2023 CAMERON MCCORMACK</div></div><div class="summary-wrapper"><h2>Overall Summary: <span class="pass result">PASS</span></h2><div class="report-wrapper"><dl><dt class="pass result report-summary-status">PASS:</dt><dd class="bold"><a href="#report-0">example/filepath/eg-file.css</a></dd><dt class="pass result report-summary-status">PASS:</dt><dd class="bold"><a href="#report-1">example/filepath/eg-file.css</a></dd><dt class="pass result report-summary-status">PASS:</dt><dd class="bold"><a href="#report-2">example/filepath/eg-file.css</a></dd></dl></div></div><div class="summary-wrapper"><h2>Summary of All Stylesheets:</h2><div class="report-wrapper"><h3 id="report-0"><span class="pass result">PASS</span> example/filepath/eg-file.css</h3><h4>High-level Summary</h4><table><tr><th>Browser</th><th>Compatible</th><th>Partial Support</th><th>Flagged</th><th>Incompatible</th><th>Unknown</th></tr><tr><td>chrome</td><td class="pass-cell">4</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td></tr></table><h4>Unknown features:</h4><ul><li class="pass-cell">None</li></ul><h4>Per-feature Summary</h4><table><tr><th>Rule Identifier<th>chrome</th></th></tr><tr><td>property:color:red<td class="pass-cell">compatible</td></td></tr><tr><td>selector:last-child<td class="pass-cell">compatible</td></td></tr><tr><td>at-rule:charset<td class="pass-cell">compatible</td></td></tr><tr><td>function:calc<td class="pass-cell">compatible</td></td></tr></table></div><div class="report-wrapper"><h3 id="report-1"><span class="pass result">PASS</span> example/filepath/eg-file.css</h3><h4>High-level Summary</h4><table><tr><th>Browser</th><th>Compatible</th><th>Partial Support</th><th>Flagged</th><th>Incompatible</th><th>Unknown</th></tr><tr><td>chrome</td><td class="pass-cell">4</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td></tr></table><h4>Unknown features:</h4><ul><li class="pass-cell">None</li></ul><h4>Per-feature Summary</h4><table><tr><th>Rule Identifier<th>chrome</th></th></tr><tr><td>property:color:red<td class="pass-cell">compatible</td></td></tr><tr><td>selector:last-child<td class="pass-cell">compatible</td></td></tr><tr><td>at-rule:charset<td class="pass-cell">compatible</td></td></tr><tr><td>function:calc<td class="pass-cell">compatible</td></td></tr></table></div><div class="report-wrapper"><h3 id="report-2"><span class="pass result">PASS</span> example/filepath/eg-file.css</h3><h4>High-level Summary</h4><table><tr><th>Browser</th><th>Compatible</th><th>Partial Support</th><th>Flagged</th><th>Incompatible</th><th>Unknown</th></tr><tr><td>chrome</td><td class="pass-cell">4</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td><td class="pass-cell">0</td></tr></table><h4>Unknown features:</h4><ul><li class="pass-cell">None</li></ul><h4>Per-feature Summary</h4><table><tr><th>Rule Identifier<th>chrome</th></th></tr><tr><td>property:color:red<td class="pass-cell">compatible</td></td></tr><tr><td>selector:last-child<td class="pass-cell">compatible</td></td></tr><tr><td>at-rule:charset<td class="pass-cell">compatible</td></td></tr><tr><td>function:calc<td class="pass-cell">compatible</td></td></tr></table></div></div></main></body></html>
`.trim();
