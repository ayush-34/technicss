# Lead Generation System — Technicss Structural Consultants

A simple, file-based lead generation and management system for identifying residential societies in Mumbai that may require structural audit, repair, or redevelopment Project Management Consultancy (PMC) services.

## Overview

This system helps Technicss Structural Consultants:

- **Identify** potential residential societies in Mumbai (buildings older than 25–30 years)
- **Track** leads through the outreach and conversion pipeline
- **Manage** contact details, audit reasons, and outreach methods

### Target Areas

Mumbai and suburbs including: Khar, Bandra, Santacruz, Vile Parle, Andheri, Versova, Goregaon, Borivali, Kandivali, Juhu, Malad, Dahisar, Dadar, Matunga, Chembur, Ghatkopar, Mulund, Powai, Vikhroli, and more.

## Files

| File | Description |
|---|---|
| `leads.csv` | Structured lead list with all building/society data |
| `lead_manager.py` | CLI tool for adding, listing, searching, and updating leads |
| `README.md` | This documentation file |

## Lead Data Fields

Each lead contains the following information:

| Field | Description |
|---|---|
| Building/Society Name | Name of the residential society or building |
| Location | Area/locality in Mumbai |
| Approximate Age (Years) | Estimated age of the building |
| Contact Information | Phone number, email, or contact person (if available) |
| Reason for Structural Audit | Why the building may need a structural audit |
| Outreach Suggestion | Recommended outreach method: Cold Call, Visit, or Email |
| Status | Current lead status: New, Contacted, In Progress, Converted, or Closed |
| Notes | Additional notes or observations |

## Quick Start

### Prerequisites

- Python 3.6 or later (no external dependencies required)

### List All Leads

```bash
python leads/lead_manager.py list
```

### Search Leads by Keyword

```bash
python leads/lead_manager.py search Bandra
python leads/lead_manager.py search "over 30 years"
```

### Add a New Lead

```bash
python leads/lead_manager.py add
```

This will interactively prompt for all lead details.

### Update a Lead

```bash
# Mark lead #1 as Contacted
python leads/lead_manager.py update 1 Status Contacted

# Add contact info to lead #3
python leads/lead_manager.py update 3 "Contact Information" "9876543210"
```

### View Statistics

```bash
python leads/lead_manager.py stats
```

### Filter by Status

```bash
python leads/lead_manager.py list New
python leads/lead_manager.py list Contacted
```

## Workflow

### 1. Lead Identification

- Research residential societies in Mumbai older than 25–30 years
- Check BMC structural audit notices and redevelopment news
- Add buildings to `leads.csv` via the CLI tool or by editing the file directly

### 2. Lead Qualification

- Verify building age and condition
- Check if BMC structural audit mandate applies
- Assess redevelopment potential
- Update the lead status and notes

### 3. Outreach

Based on the outreach suggestion for each lead:

- **Visit**: For high-priority leads — visit the society, meet the committee
- **Cold Call**: For medium-priority leads — call the society secretary/chairman
- **Email**: For initial contact or follow-up — send information about services

### 4. Follow-Up & Conversion

- Update lead status as it progresses: New → Contacted → In Progress → Converted / Closed
- Add notes after each interaction
- Track conversion metrics using the `stats` command

## Editing Leads Directly

The `leads.csv` file can also be opened and edited directly in any spreadsheet application (Excel, Google Sheets, LibreOffice Calc) or text editor. Just maintain the CSV format and column headers.
