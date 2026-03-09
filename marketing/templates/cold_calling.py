"""
Cold Calling Scripts for Technicss Structural Consultants
=========================================================
Scripts for reaching out to cooperative housing societies in Mumbai
about structural audit, building repair PMC, and consultancy services.
"""

SCRIPTS = [
    {
        "name": "Initial Outreach — Buildings Over 30 Years",
        "target": "Secretary/Chairman of cooperative housing societies with buildings older than 30 years",
        "script": """Hello, am I speaking with the Secretary/Chairman of {society_name}?

My name is __________ and I'm calling from Technicss Structural Consultants, Mumbai.

We are a licensed structural engineering consultancy specializing in structural audits, building repair, and Project Management Consultancy for cooperative housing societies across Mumbai.

I understand your building in {location} is approximately {age} years old. As you may be aware, the BMC mandates a structural audit for all buildings older than 30 years to ensure resident safety and regulatory compliance.

We have worked with several housing societies in your area and can help you:

  1. Complete the mandatory structural audit as per BMC requirements
  2. Identify any structural issues early — before they become costly
  3. Provide a detailed repair and maintenance plan
  4. Act as your Project Management Consultant if major repairs or redevelopment are needed

Would you be open to a brief meeting — at your convenience — where we can explain the process and answer any questions your managing committee may have?

[If YES]: Wonderful, what day and time works best for you? We can visit your society office.
[If NOT NOW]: I completely understand. May I send you our company profile and a brief overview of the structural audit process via WhatsApp or email? That way, you can review it and we can connect whenever you're ready.
[If NOT INTERESTED]: No problem at all. If you ever need any structural advice or a second opinion, please feel free to reach out. I'll send you our contact details for your reference.

Thank you for your time, and I wish you and your society all the best.""",
    },
    {
        "name": "Follow-Up Call — After Initial Contact",
        "target": "Society office-bearers who received initial outreach material",
        "script": """Hello, am I speaking with {contact_name} from {society_name}?

This is __________ from Technicss Structural Consultants. I had shared some information about our structural audit and consultancy services a few days ago.

I wanted to follow up and check if you had a chance to review the material. Do you have any questions about the structural audit process or how we can assist your society?

[If REVIEWED]: Great! Would you like us to schedule a visit to your building for a preliminary assessment? There is no charge for the initial consultation.
[If NOT REVIEWED]: No worries at all. I can briefly walk you through the key points right now if you have a couple of minutes. The main thing is that BMC requires buildings over 30 years to undergo a structural audit, and we help societies complete this process smoothly.
[If INTERESTED IN MEETING]: Excellent. We can meet at your society office or any location convenient for you. What day works best?

Thank you for your time.""",
    },
    {
        "name": "BMC Notice Response — Urgent Audit Required",
        "target": "Societies that have received BMC structural audit notices",
        "script": """Hello, is this the {society_name} office? May I speak with the Secretary or Chairman?

My name is __________ from Technicss Structural Consultants. We are a licensed structural engineering firm based in Mumbai.

I'm reaching out because we understand that many societies in {location} have recently received BMC notices requiring a structural audit. We specialize in helping societies respond to these notices quickly and professionally.

Here is what we can do for you:

  1. Conduct the structural audit within BMC's stipulated timeline
  2. Prepare and submit all required reports and documentation to BMC
  3. Recommend necessary repairs with a clear cost estimate
  4. Provide end-to-end Project Management Consultancy if major work is needed

Time is important with BMC notices, so we can prioritize your building and begin the process within a week.

Would you like to schedule a meeting to discuss this further?

[If YES]: Let's set up a time. We can visit your society at your convenience.
[If NEED TO DISCUSS WITH COMMITTEE]: Absolutely, I understand. Would it help if we attend your next committee meeting to present our approach and answer questions from all members?

Thank you for your time. We look forward to helping your society.""",
    },
]


def get_all_scripts():
    """Return all cold calling scripts."""
    return SCRIPTS


def get_script(index):
    """Return a specific script by index (0-based)."""
    if 0 <= index < len(SCRIPTS):
        return SCRIPTS[index]
    return None


def format_script(script, society_name="[Society Name]", location="[Location]",
                  age="30+", contact_name="[Contact Name]"):
    """Format a script with placeholder values."""
    text = script["script"]
    text = text.replace("{society_name}", society_name)
    text = text.replace("{location}", location)
    text = text.replace("{age}", str(age))
    text = text.replace("{contact_name}", contact_name)
    return text
