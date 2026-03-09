"""
Email Templates for Technicss Structural Consultants
=====================================================
Professional email templates for outreach to cooperative housing societies
in Mumbai regarding structural audit, building repair, and PMC services.
"""

TEMPLATES = [
    {
        "name": "Introduction Email — Structural Audit Services",
        "target": "Secretary/Chairman of cooperative housing societies",
        "subject": "Structural Audit & Building Safety Services for {society_name}",
        "body": """Dear {contact_name},

I hope this email finds you well.

I am writing to introduce Technicss Structural Consultants, a licensed structural engineering firm based in Mumbai. We specialize in providing structural audit, building repair, and Project Management Consultancy (PMC) services to cooperative housing societies across Mumbai and its suburbs.

As you may be aware, the Brihanmumbai Municipal Corporation (BMC) mandates a structural audit for all buildings older than 30 years. With your building in {location} being approximately {age} years old, we wanted to reach out and offer our professional services.

Our Key Services:

  - Structural Audit (fully compliant with BMC norms and requirements)
  - Detailed Condition Assessment and Reporting
  - Building Repair and Restoration Planning
  - RCC Repair, Waterproofing, and Anti-Corrosion Treatment
  - Project Management Consultancy for major repairs and redevelopment

Why Choose Technicss:

  - Licensed and experienced structural engineers
  - Extensive experience with Mumbai's cooperative housing societies
  - BMC-compliant audit reports and documentation
  - Cost-effective solutions tailored to each society's needs
  - End-to-end support from audit to repair completion

We would be happy to offer a complimentary preliminary consultation for {society_name} to discuss your building's needs and how we can assist.

Would it be possible to schedule a brief meeting at your convenience? We can visit your society office or connect over a call — whichever works best for your managing committee.

Thank you for your time, and I look forward to hearing from you.

Warm regards,

__________
Technicss Structural Consultants
Mumbai
Phone: __________
Email: __________""",
    },
    {
        "name": "BMC Compliance Reminder — Buildings Over 30 Years",
        "target": "Societies with buildings older than 30 years that may not be aware of BMC requirements",
        "subject": "Important: BMC Structural Audit Requirement for Buildings Over 30 Years",
        "body": """Dear {contact_name},

I am writing to bring to your attention an important regulatory requirement from the Brihanmumbai Municipal Corporation (BMC) that may apply to your building.

BMC Structural Audit Mandate:

As per BMC guidelines, all buildings in Mumbai that are older than 30 years are required to undergo a periodic structural audit conducted by a licensed structural engineer. This audit assesses the overall structural health of the building and identifies any areas that require repair or attention.

Non-compliance with this requirement can result in:
  - BMC notices and penalties
  - Legal liability for the managing committee
  - Increased risk to resident safety

Your building at {location} is approximately {age} years old, and we wanted to ensure your society is aware of this requirement.

How Technicss Structural Consultants Can Help:

We specialize in conducting BMC-compliant structural audits for cooperative housing societies. Our process includes:

  1. Visual and technical inspection of the building structure
  2. Testing of concrete strength, reinforcement condition, and other parameters
  3. Detailed structural audit report with photographs and recommendations
  4. Submission of the report to BMC on your behalf
  5. Repair recommendations with estimated costs

We offer competitive pricing and can complete the audit within a mutually agreed timeline.

If your society has not yet completed the structural audit, we strongly recommend scheduling one at the earliest. We are happy to provide a free initial consultation to discuss your specific situation.

Please feel free to reach out to schedule a meeting or to ask any questions.

Best regards,

__________
Technicss Structural Consultants
Mumbai
Phone: __________
Email: __________""",
    },
    {
        "name": "Follow-Up Email — After Initial Contact",
        "target": "Societies that received initial outreach",
        "subject": "Following Up: Structural Audit Services for {society_name}",
        "body": """Dear {contact_name},

I hope you are doing well.

I am following up on my earlier communication regarding structural audit and consultancy services for {society_name}.

I understand that decisions like these often require discussion with the full managing committee, and I wanted to reiterate that we are available to:

  - Present our services at your next managing committee meeting
  - Provide a free preliminary assessment of your building
  - Answer any technical or process-related questions
  - Share references from other societies we have worked with

Our goal is to make the structural audit process as smooth and hassle-free as possible for your society.

If you would like to schedule a meeting or have any questions, please do not hesitate to reach out.

Thank you for your consideration.

Warm regards,

__________
Technicss Structural Consultants
Mumbai
Phone: __________
Email: __________""",
    },
    {
        "name": "Proposal Cover Email — After Site Visit",
        "target": "Societies where a preliminary site visit has been completed",
        "subject": "Structural Audit Proposal for {society_name}",
        "body": """Dear {contact_name},

Thank you for allowing us to visit {society_name} and conduct a preliminary assessment of your building.

Based on our initial observations, we have prepared a proposal for the structural audit of your building. Please find the key highlights below:

Scope of Work:
  - Complete structural audit as per BMC guidelines
  - Non-destructive testing of concrete and reinforcement
  - Visual inspection of all structural elements
  - Detailed report with photographs, findings, and recommendations
  - Submission of audit report to BMC

Timeline: [X weeks] from the date of engagement
Investment: Rs. [Amount] (inclusive of all testing and documentation)

The detailed proposal document is attached for your review and consideration by the managing committee.

We are confident that our team can deliver a thorough and professional audit that will help ensure the safety and compliance of your building.

Please let us know if you have any questions or if you would like to discuss the proposal further. We are happy to present it at your next committee meeting.

Thank you for considering Technicss Structural Consultants.

Best regards,

__________
Technicss Structural Consultants
Mumbai
Phone: __________
Email: __________""",
    },
]


def get_all_templates():
    """Return all email templates."""
    return TEMPLATES


def get_template(index):
    """Return a specific template by index (0-based)."""
    if 0 <= index < len(TEMPLATES):
        return TEMPLATES[index]
    return None


def format_template(template, contact_name="Sir/Madam", society_name="[Society Name]",
                    location="[Location]", age="30+"):
    """Format an email template with placeholder values."""
    subject = template["subject"]
    body = template["body"]
    subject = subject.replace("{contact_name}", contact_name)
    subject = subject.replace("{society_name}", society_name)
    subject = subject.replace("{location}", location)
    subject = subject.replace("{age}", str(age))
    body = body.replace("{contact_name}", contact_name)
    body = body.replace("{society_name}", society_name)
    body = body.replace("{location}", location)
    body = body.replace("{age}", str(age))
    return subject, body
