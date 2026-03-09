# Technicss Structural Consultants

AI tools and systems for lead generation, marketing, and structural consultancy services in Mumbai.

## Lead Generation System

A structured system for identifying and managing potential clients — residential societies in Mumbai that may require structural audit, repair, or redevelopment PMC services.

**Target:** Buildings older than 25–30 years across Mumbai and suburbs (Khar, Bandra, Santacruz, Vile Parle, Andheri, Versova, Goregaon, Borivali, Kandivali, and more).

### Quick Start

```bash
# List all leads
python leads/lead_manager.py list

# Search leads
python leads/lead_manager.py search Bandra

# Add a new lead
python leads/lead_manager.py add

# Update a lead
python leads/lead_manager.py update 1 Status Contacted

# View statistics
python leads/lead_manager.py stats
```

See [leads/README.md](leads/README.md) for full documentation and workflow details.

## Marketing Assistant

A CLI-based marketing content generation system for creating outreach content targeting cooperative housing societies in Mumbai — especially buildings older than 30 years.

**Generates:** Cold calling scripts, WhatsApp messages, email templates, LinkedIn posts, Twitter/X posts, and marketing strategy ideas.

### Quick Start

```bash
# List all available marketing content
python marketing/marketing_assistant.py list

# Cold calling scripts
python marketing/marketing_assistant.py cold-call

# WhatsApp outreach messages
python marketing/marketing_assistant.py whatsapp

# Email templates
python marketing/marketing_assistant.py email

# LinkedIn posts
python marketing/marketing_assistant.py linkedin

# Twitter/X posts
python marketing/marketing_assistant.py twitter

# Marketing ideas and strategies
python marketing/marketing_assistant.py ideas

# Personalize content for a specific society
python marketing/marketing_assistant.py cold-call --society "Sagar CHS" --location "Bandra West" --age 45
```

See [marketing/README.md](marketing/README.md) for full documentation and content details.
