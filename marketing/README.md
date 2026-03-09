# Marketing Assistant — Technicss Structural Consultants

A CLI-based marketing content generation system for Technicss Structural Consultants. Generates ready-to-use marketing content for structural audit, building repair PMC, and consultancy services targeting cooperative housing societies in Mumbai.

## Overview

This system helps Technicss Structural Consultants generate and access:

- **Cold Calling Scripts** — Structured phone scripts for outreach to housing societies
- **WhatsApp Messages** — Pre-written outreach messages for WhatsApp
- **Email Templates** — Professional email templates for different outreach stages
- **LinkedIn Posts** — Social media content for LinkedIn
- **Twitter/X Posts** — Short-form social media content for Twitter/X
- **Marketing Ideas** — Strategies and ideas for marketing services to housing societies

All content is specifically designed for outreach to **cooperative housing societies in Mumbai with buildings older than 30 years**.

## Files

| File | Description |
|---|---|
| `marketing_assistant.py` | CLI tool to display and personalize marketing content |
| `templates/cold_calling.py` | Cold calling scripts for society outreach |
| `templates/whatsapp.py` | WhatsApp outreach message templates |
| `templates/email_templates.py` | Professional email templates |
| `templates/social_media.py` | LinkedIn and Twitter/X post content |
| `templates/marketing_ideas.py` | Marketing strategies and ideas |
| `README.md` | This documentation file |

## Quick Start

### Prerequisites

- Python 3.6 or later (no external dependencies required)

### List All Available Content

```bash
python marketing/marketing_assistant.py list
```

### Cold Calling Scripts

```bash
# Display all cold calling scripts
python marketing/marketing_assistant.py cold-call

# Display a specific script (by index)
python marketing/marketing_assistant.py cold-call --index 0

# Personalize a script with society details
python marketing/marketing_assistant.py cold-call --index 0 --society "Sagar CHS" --location "Bandra West" --age 45
```

### WhatsApp Messages

```bash
# Display all WhatsApp messages
python marketing/marketing_assistant.py whatsapp

# Display a specific message
python marketing/marketing_assistant.py whatsapp --index 1

# Personalize with contact and society details
python marketing/marketing_assistant.py whatsapp --index 0 --contact "Mr. Sharma" --society "Sagar CHS" --location "Bandra"
```

### Email Templates

```bash
# Display all email templates
python marketing/marketing_assistant.py email

# Display a specific template
python marketing/marketing_assistant.py email --index 0

# Personalize with details
python marketing/marketing_assistant.py email --index 0 --contact "Mr. Sharma" --society "Sagar CHS" --location "Bandra West" --age 45
```

### Social Media Posts

```bash
# LinkedIn posts
python marketing/marketing_assistant.py linkedin
python marketing/marketing_assistant.py linkedin --index 0

# Twitter/X posts
python marketing/marketing_assistant.py twitter
python marketing/marketing_assistant.py twitter --index 2
```

### Marketing Ideas

```bash
# Display all marketing ideas
python marketing/marketing_assistant.py ideas

# Filter by category
python marketing/marketing_assistant.py ideas --category "Direct Outreach"
python marketing/marketing_assistant.py ideas --category "Digital Marketing"
python marketing/marketing_assistant.py ideas --category "Buildings Over 30 Years — Specific Strategies"
```

## Content Summary

### Cold Calling Scripts (3 scripts)
1. **Initial Outreach** — First call to societies with buildings over 30 years
2. **Follow-Up Call** — After initial contact/material sharing
3. **BMC Notice Response** — For societies that received BMC audit notices

### WhatsApp Messages (5 messages)
1. **Introduction Message** — General first-contact message
2. **BMC Audit Awareness** — Buildings over 30 years compliance alert
3. **Post-Monsoon Safety Check** — Seasonal inspection offering
4. **Redevelopment Guidance** — For societies exploring redevelopment
5. **Follow-Up Message** — After initial outreach

### Email Templates (4 templates)
1. **Introduction Email** — Structural audit services introduction
2. **BMC Compliance Reminder** — Regulatory requirement awareness
3. **Follow-Up Email** — After initial contact
4. **Proposal Cover Email** — After site visit, with proposal

### LinkedIn Posts (4 posts)
1. **BMC Audit Mandate Awareness** — Educational post about requirements
2. **Building Warning Signs** — 5 signs your building needs an audit
3. **Building Repair PMC** — Service explanation and value proposition
4. **Licensed Engineers** — Why hiring licensed professionals matters

### Twitter/X Posts (5 posts)
1. **Building Age Alert** — BMC mandate awareness
2. **Post-Monsoon Tips** — Seasonal safety advice
3. **Building Safety Stats** — Data-driven awareness
4. **Service Promotion** — Services overview with free consultation
5. **Redevelopment First Step** — Educational content

### Marketing Ideas (5 categories, 22 ideas)
1. **Direct Outreach** — Cold calling, visits, WhatsApp, email newsletters
2. **Community Engagement** — Seminars, federation partnerships, workshops
3. **Digital Marketing** — LinkedIn, Google Ads, SEO, YouTube
4. **Referral & Partnership** — Client referrals, CA partnerships, contractors
5. **Buildings Over 30 Years** — BMC mailers, databases, case studies

## Personalization

All templates support personalization using command-line arguments:

| Argument | Description | Default |
|---|---|---|
| `--society` | Society/building name | [Society Name] |
| `--location` | Area/locality in Mumbai | [Location] |
| `--age` | Building age in years | 30+ |
| `--contact` | Contact person's name | Sir/Madam or [Contact Name] |

## Integration with Lead System

This marketing assistant is designed to work alongside the [Lead Generation System](../leads/README.md). Use leads from the lead database to personalize outreach content:

1. Identify a lead from `leads/leads.csv`
2. Use the marketing assistant to generate personalized content for that lead
3. Execute outreach using the generated content
4. Update the lead status in the lead manager

Example workflow:
```bash
# Find a lead
python leads/lead_manager.py search Bandra

# Generate a personalized cold calling script
python marketing/marketing_assistant.py cold-call --index 0 --society "Bandra Reclamation CHS" --location "Bandra West" --age 55

# Generate a personalized WhatsApp message
python marketing/marketing_assistant.py whatsapp --index 1 --society "Bandra Reclamation CHS" --location "Bandra West"

# After outreach, update lead status
python leads/lead_manager.py update 10 Status Contacted
```
