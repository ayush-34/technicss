# Lead Generation System — Technicss Structural Consultants

An expert lead generation and management system for identifying residential societies
in Mumbai that require structural audit, repair, redevelopment, or PMC services.

## Overview

This system helps Technicss Structural Consultants:

- **Generate** daily batches of actionable leads with full details
- **Identify** target societies (buildings 20+ years old in Mumbai)
- **Prioritise** leads by urgency and estimated conversion value
- **Track** leads through the entire outreach and conversion pipeline
- **Export** formatted daily reports for the business development team

### Services Covered

| Service | Description |
|---|---|
| Structural Audit | Mandatory BMC audit for buildings 30+ years old |
| Repair / Restoration | Crack sealing, spalling repair, anti-corrosion treatment |
| Redevelopment / PMC | Society redevelopment consultation and project management |
| PMC | Project Management Consultancy for ongoing construction |

### Priority Target Areas

**Focus zones:** Bandra · Santacruz · Vile Parle · Khar · Juhu

Also covered: Andheri, Versova, Goregaon, Borivali, Kandivali, Malad, Dahisar,
Dadar, Matunga, Chembur, Ghatkopar, Mulund, Powai, Vikhroli.

## Files

| File | Description |
|---|---|
| `leads.csv` | Structured lead database with all building/society data |
| `lead_manager.py` | CLI tool for generating, managing and exporting leads |
| `reports/` | Exported daily lead reports (created on first export) |
| `README.md` | This documentation file |

## Lead Data Fields

Each lead contains the following information:

| Field | Description |
|---|---|
| Society/Building Name | Name of the residential society or building |
| Exact Location | Street address, area, and pin code in Mumbai |
| Approximate Age (Years) | Estimated age of the building |
| **Contact Information** | **Phone/email of secretary/chairman — most important!** |
| Condition Indicators | Visible defects and reasons this is a good lead |
| Type of Opportunity | Structural Audit / Repair / Redevelopment / PMC |
| Estimated Potential Value | Low / Medium / High |
| Source | Where the lead was found (Google Maps, 99acres, Justdial, etc.) |
| Outreach Method | Cold Call / Visit / Email / Letter Drop / WhatsApp |
| Suggested Approach Strategy | Detailed action plan for this specific lead |
| Priority | **Normal** or **High Urgency** |
| Date Added | Date lead was identified (YYYY-MM-DD) — enables daily reports |
| Status | New → Contacted → In Progress → Converted / Closed |
| Notes | Additional observations |

## Quick Start

### Prerequisites

- Python 3.6 or later (no external dependencies required)

### Daily Lead Report (most important command)

```bash
python leads/lead_manager.py generate
```

Shows today's leads with:
- ⚡ High Urgency leads at the top
- Full details in the standard output format
- 🎯 Top 3 leads to approach first

```bash
# Report for a specific date
python leads/lead_manager.py generate 2026-03-27
```

### Show High Urgency Leads

```bash
python leads/lead_manager.py priority
```

### Top 3 Leads to Approach First

```bash
python leads/lead_manager.py suggest
```

### Export Report to File

```bash
python leads/lead_manager.py export
python leads/lead_manager.py export 2026-03-27
```

Saves report to `leads/reports/leads_report_YYYY-MM-DD.txt`.

### Add a New Lead

```bash
python leads/lead_manager.py add
```

Interactively prompts for all fields including the new ones.

### List All Leads

```bash
python leads/lead_manager.py list
python leads/lead_manager.py list New
python leads/lead_manager.py list "In Progress"
```

### Search Leads by Keyword

```bash
python leads/lead_manager.py search Bandra
python leads/lead_manager.py search "High Urgency"
python leads/lead_manager.py search redevelopment
python leads/lead_manager.py search Khar
```

### Update a Lead Field

```bash
# Add contact info (most critical action after identifying a lead)
python leads/lead_manager.py update 1 "Contact Information" "9876543210"

# Mark as contacted
python leads/lead_manager.py update 1 Status Contacted

# Escalate to high urgency
python leads/lead_manager.py update 3 Priority "High Urgency"

# Change type of opportunity
python leads/lead_manager.py update 5 "Type of Opportunity" "Redevelopment / PMC"
```

### Delete a Lead

```bash
python leads/lead_manager.py delete 3
```

### View Statistics

```bash
python leads/lead_manager.py stats
```

Shows breakdown by Priority, Estimated Value, Type of Opportunity, Status, Outreach Method, and Area.

## Workflow

### Step 1 — Daily Lead Generation

Run the daily report first thing each morning:

```bash
python leads/lead_manager.py generate
```

If you have new leads to add (from Google Maps, 99acres, Justdial, field visits):

```bash
python leads/lead_manager.py add
```

**Daily target: at least 10 new leads.** New leads must have a unique `Date Added`
to appear in the correct daily report.

### Step 2 — Prioritise and Plan Outreach

```bash
# View urgent leads
python leads/lead_manager.py priority

# Get top 3 suggestions
python leads/lead_manager.py suggest
```

**High Urgency indicators:**
- BMC structural audit notice issued
- Building tilt or severe settlement cracks
- Imminent safety risk (falling plaster, rebar exposure)
- Society AGM recently held — decision makers accessible
- Society has already budgeted for repair/redevelopment

### Step 3 — Obtain Contact Information

The single most important field is **Contact Information**.
After identifying a lead, obtain the secretary or chairman's contact:

- Justdial search for CHS name
- Google Maps listing for the society
- Physical letter drop requesting callback
- Local broker network

```bash
python leads/lead_manager.py update 1 "Contact Information" "9876543210"
```

### Step 4 — Execute Outreach

Based on `Outreach Method` and `Suggested Approach Strategy`:

| Method | Best For |
|---|---|
| **Visit** | High-priority leads; BMC notice; urgent safety issues |
| **Cold Call** | Medium-priority; building with visible deterioration |
| **Email** | Initial contact for organised societies with online presence |
| **Letter Drop** | Premium societies; heritage buildings; Pali Hill, Juhu, Bandra |
| **WhatsApp** | Follow-up after initial contact |

### Step 5 — Update and Track

```bash
python leads/lead_manager.py update 1 Status Contacted
python leads/lead_manager.py update 1 Notes "Spoke to Mr. Sharma (secretary), sending proposal"
```

Status pipeline: **New → Contacted → In Progress → Converted / Closed**

### Step 6 — Export for Team Sharing

```bash
python leads/lead_manager.py export
```

## Ideal Lead Profile

A high-quality lead has:

- Building **20+ years old** (ideally 30+)
- Located in **priority areas** (Bandra, Santacruz, Vile Parle, Khar, Juhu)
- **Active CHS committee** (easier decision-making)
- **Visible deterioration** — cracks, spalling, leakage, corrosion
- **No recent structural audit** on record
- **Redevelopment potential** (older buildings in prime areas)
- **Estimated Potential Value: High** (larger building, prime area, urgent need)

## Editing Leads Directly

The `leads.csv` file can also be opened in any spreadsheet application
(Excel, Google Sheets, LibreOffice Calc). Maintain the CSV format and column headers.
The `Date Added` column (YYYY-MM-DD format) is critical for daily reporting.
