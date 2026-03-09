"""
Social Media Posts for Technicss Structural Consultants
=======================================================
Ready-to-use social media content for LinkedIn and Twitter/X
to promote structural audit and consultancy services.
"""

LINKEDIN_POSTS = [
    {
        "name": "Awareness — BMC Structural Audit Mandate",
        "post": """🏗️ Did You Know? Mumbai's BMC Mandates Structural Audits for Buildings Over 30 Years

If you live in or manage a cooperative housing society in Mumbai with a building older than 30 years, a structural audit is not just recommended — it's required by the BMC.

Why does this matter?
• Ensures the safety of residents and visitors
• Identifies hidden structural issues before they become emergencies
• Helps your society stay compliant and avoid BMC penalties
• Provides a roadmap for necessary repairs and maintenance

At Technicss Structural Consultants, we have helped numerous housing societies across Mumbai complete their structural audits smoothly and professionally.

If your building hasn't been audited yet, now is the time to act.

📞 Contact us for a free consultation.

#StructuralAudit #Mumbai #BuildingSafety #CooperativeHousing #BMC #StructuralEngineering #Technicss #RealEstate #HousingSociety #BuildingRepair""",
    },
    {
        "name": "Educational — Signs Your Building Needs a Structural Audit",
        "post": """🔍 5 Signs Your Building May Need a Structural Audit

Managing a housing society? Here are warning signs that your building needs professional attention:

1️⃣ Visible cracks on walls, beams, or columns — especially if they're growing
2️⃣ Water seepage or dampness in walls, ceilings, or the basement
3️⃣ Exposed or corroded reinforcement bars (rebars)
4️⃣ Concrete spalling or flaking on structural elements
5️⃣ The building is over 30 years old and hasn't been audited

Ignoring these signs can lead to costly emergency repairs — or worse, endanger lives.

A professional structural audit identifies issues early and saves your society money in the long run.

Technicss Structural Consultants | Licensed Structural Engineers | Mumbai

#BuildingSafety #StructuralEngineering #Mumbai #HousingSociety #StructuralAudit #Maintenance #CooperativeHousing #BuildingRepair #Technicss""",
    },
    {
        "name": "Service Highlight — Building Repair PMC",
        "post": """🏠 What Is Building Repair PMC and Why Does Your Society Need One?

PMC (Project Management Consultancy) for building repair ensures that your society's repair project is:

✅ Planned professionally with the right scope of work
✅ Executed by qualified contractors with proper supervision
✅ Completed on time and within budget
✅ Done using quality materials and approved techniques

Many societies attempt major repairs without professional guidance and end up with substandard work, cost overruns, and recurring problems.

At Technicss Structural Consultants, we act as your society's trusted PMC partner — managing everything from the initial assessment to the final handover.

Our PMC services include:
• Structural assessment and repair planning
• Contractor selection and tender management
• Quality control and site supervision
• Progress monitoring and reporting to the managing committee
• Final inspection and certification

Your building deserves expert care. Let us help.

#PMC #ProjectManagement #BuildingRepair #Mumbai #HousingSociety #StructuralConsultant #CooperativeHousing #Technicss""",
    },
    {
        "name": "Credibility — Why Licensed Structural Engineers Matter",
        "post": """⚖️ Why You Should Only Hire Licensed Structural Engineers for Your Building Audit

Choosing the right structural consultant is critical. Here's why it matters:

🔹 Licensed engineers follow BMC-approved standards and protocols
🔹 Their reports are legally valid and accepted by municipal authorities
🔹 They carry professional liability insurance
🔹 They use calibrated testing equipment and follow IS codes
🔹 They provide unbiased, independent assessments

Many unlicensed contractors offer "cheap audits" that don't meet BMC requirements — leading to rejected reports, wasted money, and continued risk.

Don't compromise on your building's safety. Choose a licensed structural engineering firm.

Technicss Structural Consultants — Licensed, experienced, trusted.

#StructuralEngineering #LicensedEngineers #BuildingAudit #Mumbai #Safety #BMC #HousingSociety #Technicss""",
    },
]

TWITTER_POSTS = [
    {
        "name": "Awareness — Building Age Alert",
        "post": """🏗️ Is your Mumbai building over 30 years old? BMC mandates a structural audit for all such buildings.

Don't wait for a notice — get audited proactively.

Technicss Structural Consultants can help. Free initial consultation available.

#Mumbai #StructuralAudit #BuildingSafety #BMC""",
    },
    {
        "name": "Tip — Post-Monsoon Checks",
        "post": """🌧️ Mumbai monsoon tip: After heavy rains, check your building for new cracks, seepage, or plaster damage.

These could be signs of structural distress.

Get a professional inspection before minor issues become major problems.

#MumbaiMonsoon #BuildingSafety #StructuralAudit #Technicss""",
    },
    {
        "name": "Fact — Building Safety Statistics",
        "post": """📊 Thousands of buildings in Mumbai are over 30 years old and haven't had a structural audit.

A timely audit can:
✅ Prevent accidents
✅ Save lakhs in repair costs
✅ Keep your society BMC-compliant

Your building's safety is not optional. Act now.

#StructuralAudit #Mumbai #BuildingSafety #Technicss""",
    },
    {
        "name": "Service Promotion — Free Consultation",
        "post": """🏠 Housing society in Mumbai? We offer:

✅ Structural Audits (BMC-compliant)
✅ Building Repair PMC
✅ Redevelopment Consultancy

Free preliminary assessment for cooperative societies.

📞 Contact Technicss Structural Consultants today.

#Mumbai #HousingSociety #StructuralConsultant #Technicss""",
    },
    {
        "name": "Educational — Redevelopment First Step",
        "post": """🔑 Thinking about redevelopment for your housing society?

Step 1 is always a professional structural audit.

It determines whether your building needs repair or qualifies for redevelopment under MHADA/BMC guidelines.

Start with the right foundation — literally.

#Redevelopment #Mumbai #StructuralAudit #HousingSociety #Technicss""",
    },
]


def get_linkedin_posts():
    """Return all LinkedIn posts."""
    return LINKEDIN_POSTS


def get_twitter_posts():
    """Return all Twitter/X posts."""
    return TWITTER_POSTS


def get_linkedin_post(index):
    """Return a specific LinkedIn post by index (0-based)."""
    if 0 <= index < len(LINKEDIN_POSTS):
        return LINKEDIN_POSTS[index]
    return None


def get_twitter_post(index):
    """Return a specific Twitter post by index (0-based)."""
    if 0 <= index < len(TWITTER_POSTS):
        return TWITTER_POSTS[index]
    return None
