"""
WhatsApp Outreach Messages for Technicss Structural Consultants
===============================================================
Pre-written WhatsApp messages for outreach to cooperative housing societies
in Mumbai regarding structural audit and consultancy services.
"""

MESSAGES = [
    {
        "name": "Introduction Message — General",
        "target": "First-time outreach to society office-bearers",
        "message": """🏗️ *Technicss Structural Consultants*
_Licensed Structural Engineers — Mumbai_

Namaste {contact_name},

I am writing from *Technicss Structural Consultants*. We provide professional structural audit, building repair, and Project Management Consultancy (PMC) services to cooperative housing societies across Mumbai.

*Our Services:*
✅ Structural Audit (BMC-compliant)
✅ Building Repair & Restoration
✅ Redevelopment PMC
✅ Waterproofing & Anti-Corrosion Treatment
✅ RCC Repair & Strengthening

We have helped many societies in {location} and surrounding areas ensure their buildings are safe, compliant, and well-maintained.

Would you be interested in a *free preliminary consultation* for your society?

📞 Call us: __________
📧 Email: __________

Thank you! 🙏""",
    },
    {
        "name": "BMC Audit Awareness — Buildings Over 30 Years",
        "target": "Societies with buildings older than 30 years",
        "message": """⚠️ *Important: BMC Structural Audit for Buildings Over 30 Years*

Dear {contact_name},

As per BMC regulations, *all buildings in Mumbai older than 30 years must undergo a mandatory structural audit* to ensure safety of residents.

If your building is over 30 years old and has not yet been audited, it is important to get this done at the earliest.

*Technicss Structural Consultants* can help your society:
🔍 Complete the structural audit as per BMC norms
📋 Prepare and submit required reports
🏗️ Recommend necessary repairs
💰 Provide cost-effective repair solutions

We offer a *free initial assessment* to help you understand the condition of your building.

📞 Contact: __________
📧 Email: __________

Don't wait for a BMC notice — take proactive steps to ensure your building's safety. 🏠

*Technicss Structural Consultants*
_Your trusted partner in building safety_""",
    },
    {
        "name": "Post-Monsoon Safety Check",
        "target": "All societies, especially older buildings after monsoon season",
        "message": """🌧️ *Post-Monsoon Building Safety Check*

Dear {contact_name},

Mumbai's monsoon season can take a serious toll on older buildings — from water seepage and plaster damage to hidden structural weakening.

*Technicss Structural Consultants* is offering *post-monsoon structural inspections* for cooperative housing societies. Our engineers will:

🔎 Inspect your building for monsoon-related damage
📊 Provide a detailed condition report
🛠️ Recommend priority repairs
📄 Help with BMC compliance (if applicable)

*Early detection of structural issues can save lakhs in repair costs.*

Interested in scheduling an inspection for {society_name}?

📞 Call: __________
📧 Email: __________

Stay safe this season! 🙏
*Technicss Structural Consultants*""",
    },
    {
        "name": "Redevelopment Guidance",
        "target": "Societies considering or exploring redevelopment",
        "message": """🏗️ *Thinking About Redevelopment?*

Dear {contact_name},

If your building is old and your society is considering redevelopment, the first step is a *professional structural audit* to understand the current condition of your building.

*Technicss Structural Consultants* provides:

📋 *Structural Audit* — Is your building fit for repair or does it need redevelopment?
📊 *Feasibility Report* — Technical assessment to support your redevelopment decision
🏗️ *PMC Services* — End-to-end Project Management Consultancy for redevelopment

We guide societies through the entire process — from the initial audit to selecting the right developer.

Would you like to discuss how we can help {society_name}?

📞 Contact: __________
📧 Email: __________

*Technicss Structural Consultants*
_Expert guidance for your society's future_""",
    },
    {
        "name": "Follow-Up Message",
        "target": "Societies that received initial outreach but haven't responded",
        "message": """🙏 *Quick Follow-Up*

Dear {contact_name},

I had reached out recently regarding structural audit and consultancy services for {society_name}.

Just wanted to check if you had any questions or if your managing committee would like to schedule a meeting with our team.

We are happy to:
📋 Visit your society for a *free preliminary assessment*
🎤 Present to your managing committee
📞 Answer any questions over a quick call

No pressure at all — just want to make sure you have the information you need.

Looking forward to hearing from you!

Best regards,
*Technicss Structural Consultants*
📞 __________""",
    },
]


def get_all_messages():
    """Return all WhatsApp messages."""
    return MESSAGES


def get_message(index):
    """Return a specific message by index (0-based)."""
    if 0 <= index < len(MESSAGES):
        return MESSAGES[index]
    return None


def format_message(message, contact_name="Sir/Madam", society_name="[Society Name]",
                   location="[Location]"):
    """Format a message with placeholder values."""
    text = message["message"]
    text = text.replace("{contact_name}", contact_name)
    text = text.replace("{society_name}", society_name)
    text = text.replace("{location}", location)
    return text
