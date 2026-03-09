#!/usr/bin/env python3
"""
Lead Manager for Technicss Structural Consultants
==================================================
A CLI tool to add, list, search, update, and manage structural audit leads
for residential societies in Mumbai.

Usage:
    python lead_manager.py add
    python lead_manager.py list
    python lead_manager.py search <query>
    python lead_manager.py update <row_number> <field> <new_value>
    python lead_manager.py stats
"""

import csv
import os
import sys

LEADS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "leads.csv")

FIELDNAMES = [
    "Building/Society Name",
    "Location",
    "Approximate Age (Years)",
    "Contact Information",
    "Reason for Structural Audit",
    "Outreach Suggestion",
    "Status",
    "Notes",
]

VALID_STATUSES = ["New", "Contacted", "In Progress", "Converted", "Closed"]
VALID_OUTREACH = ["Cold Call", "Visit", "Email"]


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


def add_lead():
    """Interactively add a new lead."""
    print("\n--- Add New Lead ---")
    lead = {}
    lead["Building/Society Name"] = input("Building/Society Name: ").strip()
    if not lead["Building/Society Name"]:
        print("Error: Building/Society Name is required.")
        return

    lead["Location"] = input("Location (area in Mumbai): ").strip()
    if not lead["Location"]:
        print("Error: Location is required.")
        return

    age = input("Approximate Age of Building (years): ").strip()
    if age and not age.isdigit():
        print("Error: Age must be a number.")
        return
    lead["Approximate Age (Years)"] = age

    lead["Contact Information"] = input("Contact Information (phone/email, optional): ").strip()
    lead["Reason for Structural Audit"] = input("Reason for needing structural audit: ").strip()

    print("Outreach Suggestion options: Cold Call, Visit, Email")
    outreach = input("Outreach Suggestion: ").strip()
    if outreach and outreach not in VALID_OUTREACH:
        print(f"Warning: '{outreach}' is not a standard option. Using it anyway.")
    lead["Outreach Suggestion"] = outreach

    lead["Status"] = "New"
    lead["Notes"] = input("Notes (optional): ").strip()

    leads = load_leads()
    leads.append(lead)
    save_leads(leads)
    print(f"Lead added: {lead['Building/Society Name']} ({lead['Location']})")


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

    print(f"\n{'#':<4} {'Building/Society Name':<35} {'Location':<20} {'Age':<5} {'Outreach':<12} {'Status':<14}")
    print("-" * 92)
    for i, lead in enumerate(leads, 1):
        name = lead.get("Building/Society Name", "")[:34]
        loc = lead.get("Location", "")[:19]
        age = lead.get("Approximate Age (Years)", "")
        outreach = lead.get("Outreach Suggestion", "")[:11]
        status = lead.get("Status", "")[:13]
        print(f"{i:<4} {name:<35} {loc:<20} {age:<5} {outreach:<12} {status:<14}")
    print(f"\nTotal: {len(leads)} lead(s)")


def search_leads(query):
    """Search leads by name, location, or notes."""
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
    print(f"{'#':<4} {'Building/Society Name':<35} {'Location':<20} {'Age':<5} {'Status':<14}")
    print("-" * 80)
    for i, lead in results:
        name = lead.get("Building/Society Name", "")[:34]
        loc = lead.get("Location", "")[:19]
        age = lead.get("Approximate Age (Years)", "")
        status = lead.get("Status", "")[:13]
        print(f"{i:<4} {name:<35} {loc:<20} {age:<5} {status:<14}")
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

    old_value = leads[row].get(field, "")
    leads[row][field] = new_value
    save_leads(leads)
    print(f"Updated row {row + 1} [{field}]: '{old_value}' -> '{new_value}'")


def show_stats():
    """Show summary statistics of leads."""
    leads = load_leads()
    if not leads:
        print("No leads found.")
        return

    status_counts = {}
    outreach_counts = {}
    location_counts = {}

    for lead in leads:
        status = lead.get("Status", "Unknown")
        status_counts[status] = status_counts.get(status, 0) + 1

        outreach = lead.get("Outreach Suggestion", "Unknown")
        outreach_counts[outreach] = outreach_counts.get(outreach, 0) + 1

        location = lead.get("Location", "Unknown")
        location_counts[location] = location_counts.get(location, 0) + 1

    print(f"\n--- Lead Statistics ---")
    print(f"Total Leads: {len(leads)}")

    print(f"\nBy Status:")
    for status, count in sorted(status_counts.items()):
        print(f"  {status}: {count}")

    print(f"\nBy Outreach Method:")
    for outreach, count in sorted(outreach_counts.items()):
        print(f"  {outreach}: {count}")

    print(f"\nBy Location:")
    for location, count in sorted(location_counts.items()):
        print(f"  {location}: {count}")


def print_usage():
    """Print usage instructions."""
    print("""
Lead Manager - Technicss Structural Consultants
================================================

Usage:
  python lead_manager.py add                              Add a new lead interactively
  python lead_manager.py list [status]                    List all leads (optionally filter by status)
  python lead_manager.py search <query>                   Search leads by keyword
  python lead_manager.py update <row#> <field> <value>    Update a lead field
  python lead_manager.py stats                            Show lead statistics

Status values: New, Contacted, In Progress, Converted, Closed
Outreach options: Cold Call, Visit, Email

Examples:
  python lead_manager.py list
  python lead_manager.py list New
  python lead_manager.py search Bandra
  python lead_manager.py update 1 Status Contacted
  python lead_manager.py update 3 "Contact Information" "9876543210"
  python lead_manager.py stats
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
            print('Usage: python lead_manager.py update <row#> <field> <value>')
            return
        update_lead(sys.argv[2], sys.argv[3], " ".join(sys.argv[4:]))
    elif command == "stats":
        show_stats()
    else:
        print(f"Unknown command: {command}")
        print_usage()


if __name__ == "__main__":
    main()
