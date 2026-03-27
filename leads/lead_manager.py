#!/usr/bin/env python3
"""
Lead Manager for Technicss Structural Consultants
==================================================
A CLI tool to add, list, search, update, export, and manage structural
consultancy leads for residential societies in Mumbai.

Focus areas: Bandra, Santacruz, Vile Parle, Khar, and surroundings.

Services offered:
  - PMC (Project Management Consultancy)
  - Building Repair & Restoration
  - Structural Audits
  - Redevelopment Consultation

Usage:
    python lead_manager.py add
    python lead_manager.py list [status]
    python lead_manager.py search <query>
    python lead_manager.py update <row_number> <field> <new_value>
    python lead_manager.py stats
    python lead_manager.py generate [date YYYY-MM-DD]
    python lead_manager.py priority
    python lead_manager.py suggest
    python lead_manager.py export [date YYYY-MM-DD]
    python lead_manager.py delete <row_number>
"""

import csv
import datetime
import os
import sys

LEADS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "leads.csv")
REPORTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports")

FIELDNAMES = [
    "Society/Building Name",
    "Exact Location",
    "Approximate Age (Years)",
    "Contact Information",
    "Condition Indicators",
    "Type of Opportunity",
    "Estimated Potential Value",
    "Source",
    "Outreach Method",
    "Suggested Approach Strategy",
    "Priority",
    "Date Added",
    "Status",
    "Notes",
]

VALID_STATUSES = ["New", "Contacted", "In Progress", "Converted", "Closed"]
VALID_OUTREACH = ["Cold Call", "Visit", "Email", "Letter Drop", "WhatsApp"]
VALID_OPPORTUNITY_TYPES = [
    "Structural Audit",
    "Repair / Restoration",
    "Structural Audit / Repair",
    "Redevelopment / PMC",
    "PMC",
    "Structural Audit / PMC",
    "Structural Audit / Redevelopment / PMC",
    "Multiple",
]
VALID_VALUES = ["Low", "Medium", "High"]
VALID_PRIORITIES = ["Normal", "High Urgency"]

_VALUE_ORDER = {"High": 3, "Medium": 2, "Low": 1}
_PRIORITY_ORDER = {"High Urgency": 2, "Normal": 1}


# ── Data helpers ──────────────────────────────────────────────────────────────

def load_leads():
    """Load leads from the CSV file."""
    leads = []
    if os.path.exists(LEADS_FILE):
        with open(LEADS_FILE, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                leads.append(row)
    return leads


def save_leads(leads):
    """Save leads to the CSV file."""
    with open(LEADS_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(leads)


def _score_lead(lead):
    """Return a numeric priority score for sorting (higher = better)."""
    val = _VALUE_ORDER.get(lead.get("Estimated Potential Value", ""), 0)
    pri = _PRIORITY_ORDER.get(lead.get("Priority", ""), 0)
    return pri * 10 + val


def _get_top_leads(leads, n=3):
    """Return top N leads sorted by priority and estimated value."""
    scored = sorted(leads, key=_score_lead, reverse=True)
    return scored[:n]


def _today():
    return datetime.date.today().strftime("%Y-%m-%d")


# ── Commands ──────────────────────────────────────────────────────────────────

def add_lead():
    """Interactively add a new lead."""
    print("\n--- Add New Lead ---")
    lead = {}

    lead["Society/Building Name"] = input("Society/Building Name: ").strip()
    if not lead["Society/Building Name"]:
        print("Error: Society/Building Name is required.")
        return

    lead["Exact Location"] = input("Exact Location (street, area, pin): ").strip()
    if not lead["Exact Location"]:
        print("Error: Exact Location is required.")
        return

    age = input("Approximate Age of Building (years): ").strip()
    if age:
        if not age.isdigit() or int(age) <= 0:
            print("Error: Age must be a positive number.")
            return
    lead["Approximate Age (Years)"] = age

    lead["Contact Information"] = input(
        "Contact Information (phone/email — most important!): "
    ).strip()

    lead["Condition Indicators"] = input(
        "Condition Indicators (visible defects, why this is a good lead): "
    ).strip()

    print("Type of Opportunity options:")
    for i, t in enumerate(VALID_OPPORTUNITY_TYPES, 1):
        print(f"  {i}. {t}")
    opp = input("Type of Opportunity: ").strip()
    lead["Type of Opportunity"] = opp

    print("Estimated Potential Value: Low / Medium / High")
    val = input("Estimated Potential Value: ").strip()
    if val and val not in VALID_VALUES:
        print(f"Warning: '{val}' is not a standard value. Using it anyway.")
    lead["Estimated Potential Value"] = val

    lead["Source"] = input(
        "Source (Google Maps / 99acres / MagicBricks / Justdial / Referral etc.): "
    ).strip()

    print("Outreach Method options: Cold Call, Visit, Email, Letter Drop, WhatsApp")
    outreach = input("Outreach Method: ").strip()
    if outreach and outreach not in VALID_OUTREACH:
        print(f"Warning: '{outreach}' is not a standard option. Using it anyway.")
    lead["Outreach Method"] = outreach

    lead["Suggested Approach Strategy"] = input(
        "Suggested Approach Strategy (e.g., visit society office, letter drop, call chairman): "
    ).strip()

    print("Priority options: Normal / High Urgency")
    priority = input("Priority [Normal]: ").strip() or "Normal"
    if priority not in VALID_PRIORITIES:
        print(f"Warning: '{priority}' is not standard. Using it anyway.")
    lead["Priority"] = priority

    date_input = input(f"Date Added [today = {_today()}]: ").strip()
    lead["Date Added"] = date_input if date_input else _today()

    lead["Status"] = "New"
    lead["Notes"] = input("Notes (optional): ").strip()

    leads = load_leads()
    leads.append(lead)
    save_leads(leads)
    print(
        f"\nLead added: {lead['Society/Building Name']} "
        f"({lead['Exact Location']}) — {lead['Priority']}"
    )


def list_leads(status_filter=None):
    """List all leads, optionally filtered by status."""
    leads = load_leads()
    if not leads:
        print("No leads found.")
        return

    if status_filter:
        leads = [l for l in leads if l.get("Status", "").lower() == status_filter.lower()]
        if not leads:
            print(f"No leads with status '{status_filter}'.")
            return

    hdr = f"{'#':<4} {'Society/Building Name':<38} {'Exact Location':<28} {'Age':<4} {'Type of Opportunity':<28} {'Value':<7} {'Priority':<12} {'Status':<12}"
    print(f"\n{hdr}")
    print("-" * 137)
    for i, lead in enumerate(leads, 1):
        name = lead.get("Society/Building Name", "")[:37]
        loc = lead.get("Exact Location", "")[:27]
        age = lead.get("Approximate Age (Years)", "")[:4]
        opp = lead.get("Type of Opportunity", "")[:27]
        val = lead.get("Estimated Potential Value", "")[:6]
        pri = lead.get("Priority", "")[:11]
        status = lead.get("Status", "")[:11]
        print(f"{i:<4} {name:<38} {loc:<28} {age:<4} {opp:<28} {val:<7} {pri:<12} {status:<12}")
    print(f"\nTotal: {len(leads)} lead(s)")


def search_leads(query):
    """Search leads by name, location, condition, or any field."""
    leads = load_leads()
    query_lower = query.lower()
    results = []
    for i, lead in enumerate(leads, 1):
        searchable = " ".join(lead.values()).lower()
        if query_lower in searchable:
            results.append((i, lead))

    if not results:
        print(f"No leads matching '{query}'.")
        return

    print(f"\nSearch results for '{query}':")
    print(f"{'#':<4} {'Society/Building Name':<38} {'Exact Location':<28} {'Age':<4} {'Type':<25} {'Priority':<12} {'Status':<12}")
    print("-" * 125)
    for i, lead in results:
        name = lead.get("Society/Building Name", "")[:37]
        loc = lead.get("Exact Location", "")[:27]
        age = lead.get("Approximate Age (Years)", "")[:4]
        opp = lead.get("Type of Opportunity", "")[:24]
        pri = lead.get("Priority", "")[:11]
        status = lead.get("Status", "")[:11]
        print(f"{i:<4} {name:<38} {loc:<28} {age:<4} {opp:<25} {pri:<12} {status:<12}")
    print(f"\nFound: {len(results)} lead(s)")


def update_lead(row_str, field, new_value):
    """Update a specific field of a lead by row number."""
    leads = load_leads()
    try:
        row = int(row_str) - 1
    except ValueError:
        print("Error: Row number must be an integer.")
        return

    if row < 0 or row >= len(leads):
        print(f"Error: Row {row + 1} does not exist. Total leads: {len(leads)}.")
        return

    if field not in FIELDNAMES:
        print(f"Error: '{field}' is not a valid field.")
        print(f"Valid fields: {', '.join(FIELDNAMES)}")
        return

    if field == "Status" and new_value not in VALID_STATUSES:
        print(f"Warning: '{new_value}' is not a standard status ({', '.join(VALID_STATUSES)}).")
    if field == "Priority" and new_value not in VALID_PRIORITIES:
        print(f"Warning: '{new_value}' is not a standard priority ({', '.join(VALID_PRIORITIES)}).")

    old_value = leads[row].get(field, "")
    leads[row][field] = new_value
    save_leads(leads)
    print(f"Updated row {row + 1} [{field}]: '{old_value}' -> '{new_value}'")


def delete_lead(row_str):
    """Delete a lead by row number."""
    leads = load_leads()
    try:
        row = int(row_str) - 1
    except ValueError:
        print("Error: Row number must be an integer.")
        return

    if row < 0 or row >= len(leads):
        print(f"Error: Row {row + 1} does not exist. Total leads: {len(leads)}.")
        return

    removed = leads.pop(row)
    save_leads(leads)
    print(f"Deleted lead: {removed.get('Society/Building Name', '')} ({removed.get('Exact Location', '')})")


def show_stats():
    """Show summary statistics of leads."""
    leads = load_leads()
    if not leads:
        print("No leads found.")
        return

    status_counts = {}
    outreach_counts = {}
    location_counts = {}
    opp_counts = {}
    value_counts = {}
    priority_counts = {}

    for lead in leads:
        for key, counter in [
            ("Status", status_counts),
            ("Outreach Method", outreach_counts),
            ("Type of Opportunity", opp_counts),
            ("Estimated Potential Value", value_counts),
            ("Priority", priority_counts),
        ]:
            v = lead.get(key, "Unknown")
            counter[v] = counter.get(v, 0) + 1

        loc = lead.get("Exact Location", "").strip()
        if not loc:
            area = "Unknown"
        elif "," in loc:
            area = loc.split(",")[-2].strip()
        else:
            area = loc
        location_counts[area] = location_counts.get(area, 0) + 1

    print(f"\n--- Lead Statistics ---")
    print(f"Total Leads: {len(leads)}")

    print(f"\nBy Priority:")
    for p in VALID_PRIORITIES + ["Unknown"]:
        if p in priority_counts:
            marker = " ⚡" if p == "High Urgency" else ""
            print(f"  {p}{marker}: {priority_counts[p]}")

    print(f"\nBy Estimated Potential Value:")
    for v in ["High", "Medium", "Low", "Unknown"]:
        if v in value_counts:
            print(f"  {v}: {value_counts[v]}")

    print(f"\nBy Type of Opportunity:")
    for opp, count in sorted(opp_counts.items()):
        print(f"  {opp}: {count}")

    print(f"\nBy Status:")
    for status, count in sorted(status_counts.items()):
        print(f"  {status}: {count}")

    print(f"\nBy Outreach Method:")
    for outreach, count in sorted(outreach_counts.items()):
        print(f"  {outreach}: {count}")

    print(f"\nBy Area (derived from Exact Location):")
    for location, count in sorted(location_counts.items(), key=lambda x: -x[1]):
        print(f"  {location}: {count}")


# ── Daily report helpers ──────────────────────────────────────────────────────

def _print_lead_detail(index, lead, file=None):
    """Print one lead in the full problem-statement format."""
    def out(line=""):
        if file:
            file.write(line + "\n")
        else:
            print(line)

    name = lead.get("Society/Building Name", "N/A")
    loc = lead.get("Exact Location", "N/A")
    age = lead.get("Approximate Age (Years)", "N/A")
    contact = lead.get("Contact Information", "") or "Not yet obtained — ACTION REQUIRED"
    condition = lead.get("Condition Indicators", "N/A")
    opp = lead.get("Type of Opportunity", "N/A")
    val = lead.get("Estimated Potential Value", "N/A")
    source = lead.get("Source", "N/A")
    strategy = lead.get("Suggested Approach Strategy", "N/A")
    status = lead.get("Status", "N/A")

    out(f"  {index}. Society/Building Name  : {name}")
    out(f"     Exact Location         : {loc}")
    out(f"     Approx Age             : {age} years")
    out(f"     Contact Information    : {contact}")
    out(f"     Condition Indicators   : {condition}")
    out(f"     Type of Opportunity    : {opp}")
    out(f"     Estimated Value        : {val}")
    out(f"     Source                 : {source}")
    out(f"     Suggested Strategy     : {strategy}")
    out(f"     Status                 : {status}")
    out()


def generate_report(date_str=None, file=None):
    """Generate a formatted daily lead report for a given date (default: today)."""
    target_date = date_str or _today()

    def out(line=""):
        if file:
            file.write(line + "\n")
        else:
            print(line)

    leads = load_leads()
    day_leads = [l for l in leads if l.get("Date Added", "") == target_date]
    high_urgency = [l for l in day_leads if l.get("Priority", "") == "High Urgency"]
    normal_leads = [l for l in day_leads if l.get("Priority", "") != "High Urgency"]

    out()
    out("=" * 62)
    out(f"  DAILY LEAD REPORT — {target_date}")
    out("  Technicss Structural Consultants")
    out("  Target: Bandra | Santacruz | Vile Parle | Khar | Mumbai")
    out("=" * 62)

    if not day_leads:
        out(f"\n  No leads found for {target_date}.")
        out("  Use 'python lead_manager.py add' to add new leads.")
        out(f"  Or specify another date: generate <YYYY-MM-DD>")
        return

    # High urgency section
    if high_urgency:
        out(f"\n⚡ HIGH URGENCY LEADS — Approach FIRST! (Total: {len(high_urgency)})")
        out("-" * 62)
        for i, lead in enumerate(high_urgency, 1):
            _print_lead_detail(i, lead, file=file)

    # Normal leads section
    if normal_leads:
        out(f"📋 TODAY'S LEADS (Total: {len(normal_leads)})")
        out("-" * 62)
        for i, lead in enumerate(normal_leads, 1):
            _print_lead_detail(i, lead, file=file)

    # Top 3 recommendations
    top3 = _get_top_leads(day_leads, 3)
    out("🎯 TOP 3 LEADS TO APPROACH FIRST:")
    out("-" * 62)
    for i, lead in enumerate(top3, 1):
        name = lead.get("Society/Building Name", "")
        loc = lead.get("Exact Location", "")
        opp = lead.get("Type of Opportunity", "")
        val = lead.get("Estimated Potential Value", "")
        strategy = lead.get("Suggested Approach Strategy", "")
        pri = lead.get("Priority", "")
        marker = " ⚡" if pri == "High Urgency" else ""
        out(f"  {i}. {name}{marker}")
        out(f"     Location : {loc}")
        out(f"     Type     : {opp} | Value: {val}")
        out(f"     Strategy : {strategy}")
        out()

    out(f"📊 SUMMARY: {len(day_leads)} lead(s) for {target_date} "
        f"| {len(high_urgency)} High Urgency | {len(normal_leads)} Normal")
    out("=" * 62)


def show_priority():
    """Show all High Urgency leads across all dates."""
    leads = load_leads()
    urgent = [l for l in leads if l.get("Priority", "") == "High Urgency"]

    if not urgent:
        print("No High Urgency leads found.")
        return

    print(f"\n⚡ HIGH URGENCY LEADS (Total: {len(urgent)})")
    print("=" * 62)
    for i, lead in enumerate(urgent, 1):
        _print_lead_detail(i, lead)


def suggest_leads():
    """Show the top 3 leads to approach first across all active leads."""
    leads = load_leads()
    active = [l for l in leads if l.get("Status", "") not in ("Converted", "Closed")]

    if not active:
        print("No active leads found.")
        return

    top3 = _get_top_leads(active, 3)
    print(f"\n🎯 TOP 3 LEADS TO APPROACH FIRST (from {len(active)} active leads)")
    print("=" * 62)
    for i, lead in enumerate(top3, 1):
        _print_lead_detail(i, lead)


def export_report(date_str=None):
    """Export the daily lead report to a text file."""
    target_date = date_str or _today()
    os.makedirs(REPORTS_DIR, exist_ok=True)
    report_path = os.path.join(REPORTS_DIR, f"leads_report_{target_date}.txt")

    with open(report_path, "w", encoding="utf-8") as f:
        generate_report(date_str=target_date, file=f)

    print(f"Report exported to: {report_path}")


# ── Usage & main ──────────────────────────────────────────────────────────────

def print_usage():
    """Print usage instructions."""
    print("""
Lead Manager — Technicss Structural Consultants
================================================
Expert lead generation for structural consultancy in Mumbai.
Services: PMC | Building Repair | Structural Audits | Redevelopment

Usage:
  python lead_manager.py add                               Add a new lead interactively
  python lead_manager.py list [status]                     List all leads (optionally filter by status)
  python lead_manager.py search <query>                    Search leads by keyword
  python lead_manager.py update <row#> <field> <value>     Update a lead field
  python lead_manager.py delete <row#>                     Delete a lead by row number
  python lead_manager.py stats                             Show lead statistics
  python lead_manager.py generate [YYYY-MM-DD]             Daily lead report (default: today)
  python lead_manager.py priority                          Show all High Urgency leads
  python lead_manager.py suggest                           Top 3 leads to approach first
  python lead_manager.py export [YYYY-MM-DD]               Export daily report to file

Status values : New | Contacted | In Progress | Converted | Closed
Priority values: Normal | High Urgency
Value levels  : Low | Medium | High
Outreach      : Cold Call | Visit | Email | Letter Drop | WhatsApp

Examples:
  python lead_manager.py generate
  python lead_manager.py generate 2026-03-27
  python lead_manager.py priority
  python lead_manager.py suggest
  python lead_manager.py list New
  python lead_manager.py search Bandra
  python lead_manager.py update 1 Status Contacted
  python lead_manager.py update 2 "Contact Information" "9876543210"
  python lead_manager.py export 2026-03-27
""")


def main():
    if len(sys.argv) < 2:
        print_usage()
        return

    command = sys.argv[1].lower()

    if command == "add":
        add_lead()
    elif command == "list":
        status_filter = sys.argv[2] if len(sys.argv) > 2 else None
        list_leads(status_filter)
    elif command == "search":
        if len(sys.argv) < 3:
            print("Error: Please provide a search query.")
            print("Usage: python lead_manager.py search <query>")
            return
        search_leads(" ".join(sys.argv[2:]))
    elif command == "update":
        if len(sys.argv) < 5:
            print("Error: Please provide row number, field name, and new value.")
            print("Usage: python lead_manager.py update <row#> <field> <value>")
            return
        update_lead(sys.argv[2], sys.argv[3], " ".join(sys.argv[4:]))
    elif command == "delete":
        if len(sys.argv) < 3:
            print("Error: Please provide a row number.")
            print("Usage: python lead_manager.py delete <row#>")
            return
        delete_lead(sys.argv[2])
    elif command == "stats":
        show_stats()
    elif command == "generate":
        date_arg = sys.argv[2] if len(sys.argv) > 2 else None
        generate_report(date_str=date_arg)
    elif command == "priority":
        show_priority()
    elif command == "suggest":
        suggest_leads()
    elif command == "export":
        date_arg = sys.argv[2] if len(sys.argv) > 2 else None
        export_report(date_str=date_arg)
    else:
        print(f"Unknown command: {command}")
        print_usage()


if __name__ == "__main__":
    main()
