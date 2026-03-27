/* ===================================================
   Daily Lead Generator — script.js
   Technicss Structural Consultants
   =================================================== */

'use strict';

// ── CSV column indices (must match leads.csv header) ──────────────────────────
const COL = {
    name:       0,
    location:   1,
    age:        2,
    contact:    3,
    condition:  4,
    type:       5,
    value:      6,
    source:     7,
    outreach:   8,
    strategy:   9,
    priority:   10,
    dateAdded:  11,
    status:     12,
    notes:      13,
};

// ── State ─────────────────────────────────────────────────────────────────────
let allLeads = [];           // leads from CSV + localStorage
let viewDate = null;         // null = show all, otherwise 'YYYY-MM-DD'
let isViewAll = false;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Initialise ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    $('footer-year').textContent = new Date().getFullYear();
    setupEventListeners();
    loadLeads();
});

// ── CSV parsing ───────────────────────────────────────────────────────────────
/**
 * Parse a CSV string, handling quoted fields with embedded commas/newlines.
 * Returns an array of arrays (rows of cells).
 */
function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    let i = 0;
    while (i < text.length) {
        const ch = text[i];
        if (inQuotes) {
            if (ch === '"') {
                if (text[i + 1] === '"') { field += '"'; i += 2; continue; } // escaped quote
                inQuotes = false; i++; continue;
            }
            field += ch; i++; continue;
        }
        if (ch === '"') { inQuotes = true; i++; continue; }
        if (ch === ',') { row.push(field.trim()); field = ''; i++; continue; }
        if (ch === '\n') {
            row.push(field.trim()); field = '';
            if (row.some(c => c !== '')) rows.push(row);
            row = []; i++; continue;
        }
        if (ch === '\r') { i++; continue; } // skip CR
        field += ch; i++;
    }
    if (field !== '' || row.length > 0) {
        row.push(field.trim());
        if (row.some(c => c !== '')) rows.push(row);
    }
    return rows;
}

/**
 * Convert a parsed CSV row to a lead object.
 */
function rowToLead(row, index) {
    const get = col => (row[col] || '').trim();
    return {
        id:        index,
        name:      get(COL.name),
        location:  get(COL.location),
        age:       get(COL.age),
        contact:   get(COL.contact),
        condition: get(COL.condition),
        type:      get(COL.type),
        value:     get(COL.value),
        source:    get(COL.source),
        outreach:  get(COL.outreach),
        strategy:  get(COL.strategy),
        priority:  get(COL.priority),
        dateAdded: get(COL.dateAdded),
        status:    get(COL.status),
        notes:     get(COL.notes),
        local:     false,   // flagged true for leads saved in localStorage
    };
}

// ── Load leads (CSV + localStorage) ──────────────────────────────────────────
async function loadLeads() {
    showLoading(true);
    try {
        const resp = await fetch('leads.csv');
        if (!resp.ok) throw new Error('fetch failed');
        const text = await resp.text();
        const rows = parseCSV(text);
        // Skip header row
        allLeads = rows.slice(1)
            .filter(r => r.length > 1 && r[COL.name])
            .map((r, i) => rowToLead(r, i + 1));
        // Merge localStorage leads
        mergeLocalLeads();
        showLoading(false);
        setDefaultDate();
        render();
    } catch (err) {
        console.error('Failed to load leads.csv', err);
        showLoading(false);
        $('error-state').classList.remove('hidden');
    }
}

/** Merge leads saved in localStorage into allLeads */
function mergeLocalLeads() {
    const stored = loadLocalLeads();
    const nextId = allLeads.length + 1;
    stored.forEach((lead, i) => {
        lead.id = nextId + i;
        lead.local = true;
    });
    allLeads = [...allLeads, ...stored];
}

function loadLocalLeads() {
    try { return JSON.parse(localStorage.getItem('technicss_leads') || '[]'); }
    catch { return []; }
}

function saveLocalLeads(localLeads) {
    localStorage.setItem('technicss_leads', JSON.stringify(localLeads));
}

// ── Date helpers ──────────────────────────────────────────────────────────────
function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function setDefaultDate() {
    const today = todayStr();
    const hasTodayLeads = allLeads.some(l => l.dateAdded === today);
    if (hasTodayLeads) {
        viewDate = today;
    } else {
        // Fall back to most recent date that has leads
        const dates = [...new Set(allLeads.map(l => l.dateAdded).filter(Boolean))].sort().reverse();
        viewDate = dates[0] || today;
    }
    $('date-picker').value = viewDate;
    isViewAll = false;
}

// ── Filters ───────────────────────────────────────────────────────────────────
function getFilteredLeads() {
    const search   = $('search-box').value.toLowerCase();
    const priority = $('filter-priority').value;
    const type     = $('filter-type').value.toLowerCase();
    const value    = $('filter-value').value;

    return allLeads.filter(lead => {
        // Date filter (skip if showing all)
        if (!isViewAll && viewDate && lead.dateAdded !== viewDate) return false;
        // Search
        if (search && ![lead.name, lead.location, lead.type, lead.condition, lead.notes]
            .join(' ').toLowerCase().includes(search)) return false;
        // Priority
        if (priority && lead.priority !== priority) return false;
        // Type (partial match)
        if (type && !lead.type.toLowerCase().includes(type)) return false;
        // Value
        if (value && lead.value !== value) return false;
        return true;
    });
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
    const filtered = getFilteredLeads();

    // Update stats for the date/all view (unfiltered except date)
    updateStats(filtered);

    if (filtered.length === 0) {
        $('no-results').classList.remove('hidden');
        $('urgency-section').classList.add('hidden');
        $('top3-section').classList.add('hidden');
        $('all-leads-section').classList.add('hidden');
        return;
    }
    $('no-results').classList.add('hidden');

    const urgencyLeads = filtered.filter(l => l.priority === 'High Urgency');
    const normalLeads  = filtered.filter(l => l.priority !== 'High Urgency');
    const top3         = pickTop3(filtered);

    // Urgency section
    if (urgencyLeads.length > 0) {
        $('urgency-section').classList.remove('hidden');
        $('urgency-count').textContent = urgencyLeads.length;
        renderGrid($('urgency-grid'), urgencyLeads, 'urgency');
    } else {
        $('urgency-section').classList.add('hidden');
    }

    // Top 3 section (only if not filtered to a type / search that reduces to <4 leads)
    if (top3.length > 0 && filtered.length >= 3) {
        $('top3-section').classList.remove('hidden');
        renderTop3($('top3-grid'), top3);
    } else {
        $('top3-section').classList.add('hidden');
    }

    // All leads section (show non-urgency below, or all if urgency hidden)
    $('all-leads-section').classList.remove('hidden');
    const title = isViewAll ? 'All Leads' : `Leads for ${viewDate}`;
    $('all-leads-title').textContent = title;
    $('all-leads-count').textContent = filtered.length;
    renderGrid($('leads-grid'), normalLeads, 'normal');
}

function renderGrid(container, leads, mode) {
    container.innerHTML = '';
    leads.forEach(lead => {
        container.appendChild(createLeadCard(lead, mode === 'urgency'));
    });
}

function renderTop3(container, leads) {
    container.innerHTML = '';
    leads.forEach((lead, i) => {
        const card = createLeadCard(lead, false);
        card.classList.add('top3');
        // Add rank badge
        const rank = document.createElement('div');
        rank.className = 'lead-rank';
        rank.textContent = i + 1;
        card.appendChild(rank);
        container.appendChild(card);
    });
}

function pickTop3(leads) {
    // Score: urgency (+3), High value (+2), Medium value (+1), contact present (+1), high age (+1)
    const scored = leads.map(l => {
        let score = 0;
        if (l.priority === 'High Urgency') score += 3;
        if (l.value === 'High')   score += 2;
        if (l.value === 'Medium') score += 1;
        if (l.contact)            score += 1;
        const age = parseInt(l.age) || 0;
        if (age >= 40) score += 1; // Buildings 40+ years are more likely to need structural assessment
        return { lead: l, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(s => s.lead);
}

// ── Lead Card ─────────────────────────────────────────────────────────────────
function createLeadCard(lead, isUrgency) {
    const card = document.createElement('div');
    card.className = 'lead-card';
    if (isUrgency || lead.priority === 'High Urgency') card.classList.add('urgency');
    else card.classList.add('value-' + (lead.value || 'medium').toLowerCase());

    card.addEventListener('click', () => openDetailModal(lead));

    const contactHtml = lead.contact
        ? `<div class="lead-contact">📞 ${escHtml(lead.contact)}</div>`
        : `<div class="lead-contact missing">📞 Contact needed — verify on Justdial / Google Maps</div>`;

    card.innerHTML = `
        <div class="lead-card-title">${escHtml(lead.name)}</div>
        <div class="lead-location">📍 ${escHtml(lead.location)}</div>
        ${contactHtml}
        <div class="lead-badges">
            ${priorityBadge(lead.priority)}
            ${valueBadge(lead.value)}
            ${typeBadge(lead.type)}
            ${outreachBadge(lead.outreach)}
        </div>
        <div class="lead-condition">${escHtml(lead.condition)}</div>
        <div class="lead-card-footer">
            <span>🏗️ ${lead.age ? lead.age + ' yrs old' : 'Age unknown'}</span>
            ${statusBadge(lead.status)}
        </div>
    `;
    return card;
}

// ── Badge helpers ─────────────────────────────────────────────────────────────
function priorityBadge(p) {
    return p === 'High Urgency'
        ? `<span class="badge badge-urgency">⚡ High Urgency</span>`
        : `<span class="badge badge-normal">Normal</span>`;
}
function valueBadge(v) {
    const cls = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' }[v] || 'badge-low';
    const icon = { High: '🔥', Medium: '📊', Low: '📉' }[v] || '';
    return `<span class="badge ${cls}">${icon} ${escHtml(v || 'Unknown')} Value</span>`;
}
function typeBadge(t) {
    return `<span class="badge badge-type">${escHtml(t || '')}</span>`;
}
function outreachBadge(o) {
    if (!o) return '';
    return `<span class="badge badge-outreach">${escHtml(o)}</span>`;
}
function statusBadge(s) {
    const cls = {
        'New': 'badge-status-new',
        'Contacted': 'badge-status-contacted',
        'In Progress': 'badge-status-inprogress',
        'Converted': 'badge-status-converted',
        'Closed': 'badge-status-closed',
    }[s] || 'badge-status-new';
    return `<span class="badge ${cls}">${escHtml(s || 'New')}</span>`;
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function updateStats(filtered) {
    $('stat-total').textContent     = filtered.length;
    $('stat-urgency').textContent   = filtered.filter(l => l.priority === 'High Urgency').length;
    $('stat-high').textContent      = filtered.filter(l => l.value === 'High').length;
    $('stat-redevelop').textContent = filtered.filter(l => (l.type || '').toLowerCase().includes('redevelopment')).length;
    $('stat-total-all').textContent = allLeads.length;
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function openDetailModal(lead) {
    const overlay = $('detail-overlay');
    $('detail-title').textContent = lead.name;

    const contactHtml = lead.contact
        ? `<div class="detail-contact-box">📞 ${escHtml(lead.contact)}</div>`
        : `<div class="detail-contact-box missing">📞 Contact not yet available — find via Justdial / Google Maps / letter drop</div>`;

    $('detail-body').innerHTML = `
        ${contactHtml}
        <div class="detail-grid">
            <div class="detail-field">
                <div class="detail-label">Society / Building Name</div>
                <div class="detail-value"><strong>${escHtml(lead.name)}</strong></div>
            </div>
            <div class="detail-field">
                <div class="detail-label">Exact Location</div>
                <div class="detail-value">
                    📍 ${escHtml(lead.location)}
                    <a href="https://www.google.com/maps/search/${encodeURIComponent(lead.name + ' ' + lead.location)}"
                       target="_blank" rel="noopener" style="margin-left:6px;font-size:0.8rem;color:var(--primary-light)">
                        🗺️ Map
                    </a>
                </div>
            </div>
            <div class="detail-field">
                <div class="detail-label">Approx Age of Building</div>
                <div class="detail-value">${escHtml(lead.age) || '—'} years</div>
            </div>
            <div class="detail-field">
                <div class="detail-label">Priority</div>
                <div class="detail-value">${priorityBadge(lead.priority)}</div>
            </div>
            <div class="detail-field detail-full">
                <div class="detail-label">Condition Indicators (Why it's a good lead)</div>
                <div class="detail-value">${escHtml(lead.condition)}</div>
            </div>
            <div class="detail-field">
                <div class="detail-label">Type of Opportunity</div>
                <div class="detail-value">${typeBadge(lead.type)}</div>
            </div>
            <div class="detail-field">
                <div class="detail-label">Estimated Potential Value</div>
                <div class="detail-value">${valueBadge(lead.value)}</div>
            </div>
            <div class="detail-field">
                <div class="detail-label">Source</div>
                <div class="detail-value">${escHtml(lead.source) || '—'}</div>
            </div>
            <div class="detail-field">
                <div class="detail-label">Outreach Method</div>
                <div class="detail-value">${outreachBadge(lead.outreach)}</div>
            </div>
            <div class="detail-field detail-full">
                <div class="detail-label">Suggested Approach Strategy</div>
                <div class="detail-strategy-box">${escHtml(lead.strategy)}</div>
            </div>
            <div class="detail-field">
                <div class="detail-label">Status</div>
                <div class="detail-value">${statusBadge(lead.status)}</div>
            </div>
            <div class="detail-field">
                <div class="detail-label">Date Added</div>
                <div class="detail-value">${escHtml(lead.dateAdded) || '—'}</div>
            </div>
            ${lead.notes ? `
            <div class="detail-field detail-full">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${escHtml(lead.notes)}</div>
            </div>` : ''}
        </div>
    `;

    overlay.classList.remove('hidden');
}

// ── Add Lead Modal ────────────────────────────────────────────────────────────
function openAddModal() {
    $('add-lead-form').reset();
    $('f-date').value = todayStr();
    $('modal-title').textContent = 'Add New Lead';
    $('modal-overlay').classList.remove('hidden');
}

function handleAddLead(e) {
    e.preventDefault();
    const name = $('f-name').value.trim();
    const location = $('f-location').value.trim();
    if (!name || !location) {
        alert('Society / Building Name and Location are required.');
        return;
    }
    const newLead = {
        name,
        location,
        age:       $('f-age').value.trim(),
        contact:   $('f-contact').value.trim(),
        condition: $('f-condition').value.trim(),
        type:      $('f-type').value,
        value:     $('f-value').value,
        source:    $('f-source').value.trim(),
        outreach:  $('f-outreach').value,
        strategy:  $('f-strategy').value.trim(),
        priority:  $('f-priority').value,
        dateAdded: $('f-date').value || todayStr(),
        status:    $('f-status').value,
        notes:     $('f-notes').value.trim(),
        local:     true,
    };

    // Save to localStorage
    const stored = loadLocalLeads();
    stored.push(newLead);
    saveLocalLeads(stored);

    // Add to in-memory array
    newLead.id = allLeads.length + 1;
    allLeads.push(newLead);

    $('modal-overlay').classList.add('hidden');

    // If the newly added lead's date is the current view, keep it; otherwise switch
    if (!isViewAll && newLead.dateAdded !== viewDate) {
        viewDate = newLead.dateAdded;
        $('date-picker').value = viewDate;
    }
    render();
}

// ── Export Report ─────────────────────────────────────────────────────────────
function exportReport() {
    const filtered = getFilteredLeads();
    if (filtered.length === 0) {
        alert('No leads to export for the current view/filters.');
        return;
    }

    const date = isViewAll ? 'All Leads' : viewDate;
    const top3 = pickTop3(filtered);
    const urgency = filtered.filter(l => l.priority === 'High Urgency');

    let out = '';
    out += '='.repeat(68) + '\n';
    out += `  TECHNICSS STRUCTURAL CONSULTANTS — DAILY LEAD REPORT\n`;
    out += `  ${date}\n`;
    out += '='.repeat(68) + '\n\n';
    out += `Total Leads: ${filtered.length}   ⚡ High Urgency: ${urgency.length}   🔥 High Value: ${filtered.filter(l => l.value === 'High').length}\n\n`;

    if (urgency.length) {
        out += '─'.repeat(68) + '\n';
        out += '⚡ HIGH URGENCY LEADS — ACT IMMEDIATELY\n';
        out += '─'.repeat(68) + '\n\n';
        urgency.forEach((l, i) => { out += formatLeadText(l, i + 1); });
    }

    out += '─'.repeat(68) + '\n';
    out += '🎯 TOP 3 LEADS TO APPROACH FIRST\n';
    out += '─'.repeat(68) + '\n\n';
    top3.forEach((l, i) => { out += formatLeadText(l, i + 1); });

    out += '─'.repeat(68) + '\n';
    out += 'ALL LEADS\n';
    out += '─'.repeat(68) + '\n\n';
    filtered.forEach((l, i) => { out += formatLeadText(l, i + 1); });

    $('export-text').value = out;
    $('export-overlay').classList.remove('hidden');
}

function formatLeadText(l, i) {
    let t = `[${i}] ${l.name}\n`;
    t += `    📍 Location       : ${l.location}\n`;
    t += `    🏗️  Age            : ${l.age || '?'} years\n`;
    t += `    📞 Contact        : ${l.contact || 'NOT YET OBTAINED'}\n`;
    t += `    🔍 Condition      : ${l.condition}\n`;
    t += `    🎯 Opportunity    : ${l.type}\n`;
    t += `    💰 Value          : ${l.value}\n`;
    t += `    📌 Source         : ${l.source}\n`;
    t += `    📬 Outreach       : ${l.outreach}\n`;
    t += `    🗒️  Strategy       : ${l.strategy}\n`;
    t += `    ⚡ Priority       : ${l.priority}\n`;
    t += `    📅 Date Added     : ${l.dateAdded}\n`;
    t += `    ✅ Status         : ${l.status}\n`;
    if (l.notes) t += `    📝 Notes         : ${l.notes}\n`;
    t += '\n';
    return t;
}

// ── Event listeners ───────────────────────────────────────────────────────────
function setupEventListeners() {
    // Date picker
    $('date-picker').addEventListener('change', e => {
        viewDate = e.target.value;
        isViewAll = false;
        render();
    });

    // Today button
    $('today-btn').addEventListener('click', () => {
        viewDate = todayStr();
        $('date-picker').value = viewDate;
        isViewAll = false;
        render();
    });

    // All leads button
    $('all-btn').addEventListener('click', () => {
        isViewAll = true;
        render();
    });

    // Filters
    ['search-box', 'filter-priority', 'filter-type', 'filter-value'].forEach(id => {
        $(id).addEventListener('input', render);
        $(id).addEventListener('change', render);
    });

    // Add lead
    $('add-lead-btn').addEventListener('click', openAddModal);
    $('add-lead-form').addEventListener('submit', handleAddLead);
    $('modal-close').addEventListener('click', () => $('modal-overlay').classList.add('hidden'));
    $('modal-cancel').addEventListener('click', () => $('modal-overlay').classList.add('hidden'));
    $('modal-overlay').addEventListener('click', e => {
        if (e.target === $('modal-overlay')) $('modal-overlay').classList.add('hidden');
    });

    // Detail modal
    $('detail-close').addEventListener('click', () => $('detail-overlay').classList.add('hidden'));
    $('detail-overlay').addEventListener('click', e => {
        if (e.target === $('detail-overlay')) $('detail-overlay').classList.add('hidden');
    });

    // Export
    $('export-btn').addEventListener('click', exportReport);
    $('export-close').addEventListener('click', () => $('export-overlay').classList.add('hidden'));
    $('export-close-btn').addEventListener('click', () => $('export-overlay').classList.add('hidden'));
    $('export-overlay').addEventListener('click', e => {
        if (e.target === $('export-overlay')) $('export-overlay').classList.add('hidden');
    });
    $('copy-report-btn').addEventListener('click', () => {
        const ta = $('export-text');
        ta.select();
        try {
            navigator.clipboard.writeText(ta.value).then(() => {
                $('copy-report-btn').textContent = '✅ Copied!';
                setTimeout(() => { $('copy-report-btn').textContent = 'Copy to Clipboard'; }, 2500);
            }).catch(() => document.execCommand('copy'));
        } catch {
            document.execCommand('copy');
        }
    });

    // Keyboard: Escape closes modals
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            $('modal-overlay').classList.add('hidden');
            $('detail-overlay').classList.add('hidden');
            $('export-overlay').classList.add('hidden');
        }
    });
}

// ── Utility ───────────────────────────────────────────────────────────────────
function showLoading(show) {
    const el = $('loading-state');
    if (show) { el.classList.remove('hidden'); }
    else       { el.classList.add('hidden'); }
}

/** Escape HTML to prevent XSS when inserting user/CSV data via innerHTML */
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
