/**
 * script.js — Daily Marketing Agent
 * Technicss Structural Consultants, Mumbai
 *
 * 7-day rotating content engine targeting CHS / society committees /
 * redevelopment decision-makers in Khar, Bandra, Santacruz, Vile Parle.
 */

/* ══════════════════════════════════════════════════════════════
   DAILY CONTENT DATABASE  (7 days × 5 content types)
   ══════════════════════════════════════════════════════════════ */
const DAYS = [
  /* ── DAY 1 ── Structural Audit Awareness ───────────────────── */
  {
    theme: "⚠️ Structural Audit Awareness",
    colorStyle: { bg: "#1a1f4e", text: "#ffffff", accent: "#f7941d" },

    linkedin: `🏗️ YOUR MUMBAI BUILDING IS OLDER THAN 30 YEARS.
That's not just an age — it's a legal, financial & safety time-bomb.

Here's the hard truth most society chairmen in Khar, Bandra & Santacruz don't want to hear:

👉 BMC mandates structural audits for ALL buildings 30+ years old.
👉 An unaudited building can be declared "dangerous" at any time.
👉 A dangerous building notice triggers panic, legal battles & forced evacuation.

I've seen it happen. A society in Bandra West received a BMC notice on a Friday evening. By Monday, 48 families were scrambling for alternatives.

The audit they needed? ₹80,000.
The cost of the crisis? Over ₹12 lakh in legal fees, temporary housing & emergency repairs.

📌 WHAT A STRUCTURAL AUDIT DOES:
→ Identifies hairline cracks BEFORE they become structural failures
→ Detects corrosion inside columns & beams (invisible to the eye)
→ Gives your society a compliance certificate accepted by BMC
→ Creates a roadmap for budget-friendly phased repairs

We are Technicss Structural Consultants — Licensed Structural Engineers operating across Khar (2nd–18th Road), Bandra, Santacruz & Vile Parle.

📞 DM me or call for a FREE preliminary inspection.
No obligation. Just clarity.

#StructuralAudit #MumbaiRealEstate #KharWest #BandraWest #CHS #BuildingSafety`,

    maps: `🏗️ Is Your Mumbai Building Over 30 Years Old?

BMC requires a mandatory structural audit — don't wait for a notice!

Technicss Structural Consultants provides:
✅ BMC-compliant Structural Audits
✅ Building Repair Project Management
✅ Redevelopment Feasibility Studies

Serving Khar, Bandra, Santacruz & Vile Parle.

📞 Call now for a FREE inspection.
🌐 ayush-34.github.io/technicss

Keywords: structural audit Mumbai, building safety inspection Khar, BMC audit Bandra, cooperative housing society audit`,

    poster: {
      headline: "Is Your Building a Ticking Time Bomb?",
      subtext: "Buildings 30+ years old in Mumbai need a BMC-mandated structural audit. One crack ignored today can cost crores tomorrow.",
      visual: "Split image: Left — alarmed residents pointing at a cracked wall; Right — confident engineer with clipboard giving thumbs up after inspection. Text overlay reads '30 Years = Audit Now'.",
      cta: "📞 Book FREE Inspection Today",
      colorStyle: "Deep Navy Blue (#1a1f4e) background + Bold Orange (#f7941d) headline + White body text. Professional, urgent, trustworthy.",
    },

    captions: {
      linkedin: `⚠️ Mumbai CHS Alert: If your building is 30+ years old and hasn't had a structural audit, you are legally and financially exposed.

Don't wait for a BMC notice.

📞 DM Technicss Structural Consultants for a free preliminary check.
Serving Khar · Bandra · Santacruz · Vile Parle

#StructuralAudit #MumbaiCHS #BuildingSafety #BMCCompliance`,

      instagram: `🏚️ Cracks in the wall? Seepage on the ceiling? Don't ignore the signs.

Your building is speaking to you — are you listening?

📍 We're Mumbai's structural audit specialists, serving Khar, Bandra, Santacruz & Vile Parle.

💬 DM us or tap the link in bio for a FREE inspection.

#MumbaiBuildings #StructuralAudit #KharWest #BandraWest #SafeHome #CHSMumbai #BuildingCracks`,

      whatsapp: `🏗️ *Is your building 30+ years old?*

The BMC mandates a structural audit for all such buildings in Mumbai.

✅ Avoid notices & penalties
✅ Ensure resident safety
✅ Plan repairs before costs escalate

*Technicss Structural Consultants* — Licensed Engineers
📍 Serving Khar · Bandra · Santacruz · Vile Parle

📞 Call/WhatsApp for a FREE preliminary inspection.
🌐 ayush-34.github.io/technicss`,
    },

    hashtags: [
      "#StructuralAudit", "#MumbaiRealEstate", "#KharWest", "#BandraWest",
      "#SantacruzMumbai", "#VileParle", "#CHSMumbai", "#CooperativeHousing",
      "#BuildingSafety", "#BMCCompliance", "#MumbaiBuildings", "#StructuralEngineering",
      "#HousingSociety", "#BuildingAudit", "#TechnicssConsultants",
    ],
  },

  /* ── DAY 2 ── Monsoon Risk ──────────────────────────────────── */
  {
    theme: "🌧️ Monsoon Damage & Risk",
    colorStyle: { bg: "#0d3b6e", text: "#ffffff", accent: "#ffd700" },

    linkedin: `🌧️ MUMBAI MONSOON IS COMING.
And your building is NOT ready.

Every June, I get panic calls from society chairmen in Khar & Bandra:

"Engineer sahib, water is coming through the slab."
"The wall has started bulging."
"There's a 2-inch crack that wasn't there last week."

None of these are surprises. Every single one of these buildings had warning signs before the monsoon.

Here's what monsoon does to a structurally compromised building:
💧 Rainwater seeps into concrete → reaches rebar → rust expands → concrete cracks
💧 Waterproofing failure on terraces → water ponds → loads increase → slab weakens
💧 Plinth flooding → foundation soil erodes → differential settlement begins

The damage from ONE monsoon season can cost a society ₹30–₹80 lakh in emergency repairs.

Pre-monsoon structural inspection is NOT an expense. It's insurance.

We at Technicss Structural Consultants offer rapid pre-monsoon structural assessments — specifically for buildings in Khar (2nd–18th Road), Bandra, Santacruz & Vile Parle.

📋 What you get:
→ Waterproofing assessment (terrace, podium, external walls)
→ Structural crack mapping
→ Immediate risk flagging
→ Prioritised repair recommendations

📞 Slots fill fast in May–June. DM or call to book yours.
Don't wait until the rains tell you what we already know.

#MumbaiMonsoon #BuildingSafety #PreMonsoonAudit #KharMumbai #StructuralAudit`,

    maps: `🌧️ Pre-Monsoon Building Inspection — Mumbai

Is your building ready for Mumbai's heavy rains?

Water seepage, cracks & terrace leakage can become structural emergencies during monsoon.

Technicss Structural Consultants offers pre-monsoon rapid assessments for housing societies in Khar, Bandra, Santacruz & Vile Parle.

📞 Book before the rains hit — call now!
🌐 ayush-34.github.io/technicss

Keywords: pre-monsoon building inspection Mumbai, waterproofing audit Khar Bandra, structural check monsoon Mumbai`,

    poster: {
      headline: "Don't Let Mumbai Rains Crack Your Foundation.",
      subtext: "Pre-monsoon structural inspection stops ₹30–80 lakh emergency repair bills before they start.",
      visual: "Dark, dramatic image of heavy rain hitting an old Mumbai building with water streaks on walls. Bold warning text overlay. Bottom shows a before/after comparison: cracked wall vs sealed, repaired surface.",
      cta: "⚡ Book Pre-Monsoon Inspection Now",
      colorStyle: "Dark steel blue (#0d3b6e) background + Gold (#ffd700) headline + White subtext. Urgent, weather-themed, powerful contrast.",
    },

    captions: {
      linkedin: `🌧️ Mumbai monsoon is 6–8 weeks away.

If your CHS building has unsealed cracks, terrace leakage, or damp walls — the rains will make it 10x worse.

Pre-monsoon structural check = peace of mind for 3 months.

📞 Book your inspection before slots fill up.
Technicss Structural Consultants | Khar · Bandra · Santacruz · Vile Parle

#MumbaiMonsoon #PreMonsoonCheck #StructuralAudit #CHSMumbai`,

      instagram: `☔ Mumbai rains + unrepaired cracks = disaster.

Don't let monsoon turn a ₹5,000 crack repair into a ₹50 lakh structural failure.

📍 Pre-monsoon inspection by licensed structural engineers.
📞 Call / DM to book. Limited slots available.

#MumbaiMonsoon #BuildingCrack #WaterproofingMumbai #KharWest #BandraWest #StructuralAudit #SafeHome`,

      whatsapp: `☔ *Pre-Monsoon Alert for Mumbai CHS!*

Water seepage + cracks + monsoon = structural emergency.

Book a pre-monsoon structural inspection BEFORE the rains hit.

*Technicss Structural Consultants*
Licensed Structural Engineers | Mumbai
📍 Khar · Bandra · Santacruz · Vile Parle

📞 DM or call to book — limited slots!`,
    },

    hashtags: [
      "#MumbaiMonsoon", "#PreMonsoonInspection", "#WaterproofingMumbai",
      "#BuildingLeakage", "#TerraceLeak", "#KharMumbai", "#BandraWest",
      "#StructuralAudit", "#CHSMumbai", "#MumbaiRealEstate", "#BuildingRepair",
      "#MonsoonReady", "#StructuralEngineering", "#TechnicssConsultants",
    ],
  },

  /* ── DAY 3 ── Redevelopment Opportunity ───────────────────── */
  {
    theme: "🏙️ Redevelopment Opportunity",
    colorStyle: { bg: "#1a4731", text: "#ffffff", accent: "#4ade80" },

    linkedin: `🏙️ SOCIETY CHAIRMAN: Your old building isn't a liability. It's your BIGGEST ASSET.

Let me explain.

You manage a 40-year-old CHS in Khar or Bandra. The building creaks. The plaster falls. The committee is exhausted from repair cycles.

But here's what most chairmen don't realise:

That old building sits on land worth ₹3–₹8 crore per unit of FSI in Khar/Bandra.

Under DCPR 2034 + SRA guidelines, your society can:
✅ Get NEW flats — same or larger area — at ZERO cost to members
✅ Get CORPUS FUNDS — ₹25,000–₹50,000/month per member during construction
✅ Get SHIFTING ALLOWANCES covered by the developer
✅ Get a BRAND NEW building with modern amenities

But here's the catch — and this is critical:

🚨 The building must FIRST pass a structural audit + feasibility study.
🚨 Without proper technical documentation, developers won't give you a fair deal.
🚨 Without an independent consultant, you could be short-changed by crores.

That's where we come in.

Technicss Structural Consultants provides:
→ Independent Structural Assessment for Redevelopment
→ FSI & Development Potential Analysis
→ Redevelopment Feasibility Reports
→ Developer Negotiation Support (on technical side)

We've worked with societies across Khar (2nd–18th Road), Bandra, Santacruz & Vile Parle.

📞 Schedule a FREE 30-minute redevelopment consultation.
Your members deserve the best deal. We help you get it.

#Redevelopment #MumbaiRedevelopment #KharWest #BandraWest #CHSMumbai #DCPR2034`,

    maps: `🏙️ Thinking About Redevelopment? Start Here.

Technicss Structural Consultants provides independent structural assessments & feasibility studies for housing society redevelopment in Mumbai.

We help CHS in Khar, Bandra, Santacruz & Vile Parle:
✅ Understand their development potential
✅ Get fair deals from developers
✅ Navigate BMC / DCPR 2034 requirements

📞 Free consultation — call now!
🌐 ayush-34.github.io/technicss

Keywords: building redevelopment consultant Mumbai, CHS redevelopment Khar Bandra, DCPR 2034 feasibility study`,

    poster: {
      headline: "Your Old Building = New Flats for FREE.",
      subtext: "Redevelopment under DCPR 2034 can give every member a brand-new flat at zero cost. But only with the right structural consultant in your corner.",
      visual: "Left panel: old, weathered Mumbai building. Right panel: modern glass tower. Arrow/transformation graphic between them. Society members celebrating in foreground. Professional feel.",
      cta: "📞 Free Redevelopment Consultation",
      colorStyle: "Deep forest green (#1a4731) background + Bright lime (#4ade80) headline + White body text. Growth, opportunity, transformation theme.",
    },

    captions: {
      linkedin: `🏙️ Old building in Khar or Bandra?

That "problem" is actually a goldmine — if handled right.

Redevelopment under DCPR 2034 can deliver new flats + corpus funds to every member.

But you need independent structural & feasibility expertise — NOT just a developer's word.

📞 Talk to Technicss Structural Consultants first.
Serving Khar · Bandra · Santacruz · Vile Parle

#Redevelopment #CHSMumbai #DCPR2034 #KharWest #BandraWest`,

      instagram: `🏠➡️🏢 Old building → Brand new flat, zero cost.

That's what redevelopment can do for your Mumbai CHS.

But ONLY if you have the right consultant protecting your society's interests.

📍 Technicss Structural Consultants | Mumbai
📞 DM or call for a FREE consultation

#MumbaiRedevelopment #CHSMumbai #NewFlat #KharWest #BandraWest #DCPR2034 #BuildingRedevelopment`,

      whatsapp: `🏙️ *Mumbai CHS Redevelopment Alert*

Is your building 30+ years old in Khar, Bandra, Santacruz or Vile Parle?

Under DCPR 2034, your members can get:
✅ New flats at ZERO cost
✅ Corpus fund every month
✅ Shifting allowance

*Technicss Structural Consultants* helps you navigate the process independently — so your society gets the BEST deal.

📞 Call for a FREE 30-min consultation.`,
    },

    hashtags: [
      "#Redevelopment", "#MumbaiRedevelopment", "#CHSMumbai", "#DCPR2034",
      "#KharWest", "#BandraWest", "#SantacruzMumbai", "#VileParle",
      "#SRARedevelopment", "#OldBuildingMumbai", "#NewFlat", "#HousingSociety",
      "#StructuralConsultant", "#TechnicssConsultants", "#MumbaiRealEstate",
    ],
  },

  /* ── DAY 4 ── BMC Compliance & Notice Response ─────────────── */
  {
    theme: "📋 BMC Compliance & Notices",
    colorStyle: { bg: "#7c2d12", text: "#ffffff", accent: "#fb923c" },

    linkedin: `📋 GOT A BMC NOTICE? Here's exactly what to do in the next 72 hours.

I've received calls from panicked society secretaries at 9 PM on a Sunday.
"We got a C1 notice. What do we do?"

Here's the truth — a BMC structural audit notice is NOT a death sentence.
But ignoring it IS.

Let me break it down:

🔴 C1 Notice = Dangerous/Dilapidated building → Immediate action required
🟡 C2 Notice = Repairable building → Repairs within specified timeline
🟢 C3 Notice = Minor repairs required → Manageable, planned approach

WHAT TO DO IN 72 HOURS:
1. Do NOT ignore the notice or wait for committee meetings to drag on
2. Engage a licensed structural engineer IMMEDIATELY
3. Get an independent structural assessment before BMC's deadline
4. Document everything — photos, existing repair records, building plans
5. Respond to BMC with a professional technical report

Here's what happens when societies wait:
→ BMC can declare the building dangerous & initiate evacuation
→ Legal liability falls on the committee personally
→ Insurance claims become invalid
→ Redevelopment negotiations suffer massively

We at Technicss Structural Consultants have handled 30+ BMC notice responses across Khar, Bandra, Santacruz & Vile Parle.

We'll have boots on the ground within 24 hours and a preliminary report ready for BMC within 5 working days.

📞 Got a notice? Call NOW. Don't lose another hour.

#BMCNotice #StructuralAudit #MumbaiCHS #BuildingSafety #KharWest #BandraWest`,

    maps: `📋 Received a BMC Structural Audit Notice?

Act fast — Technicss Structural Consultants responds within 24 hours.

We provide:
✅ Emergency structural assessments for C1/C2/C3 notices
✅ BMC-compliant technical reports
✅ Repair recommendations & timelines

Licensed Structural Engineers | Khar · Bandra · Santacruz · Vile Parle · Mumbai

📞 Call now — urgent response available.
🌐 ayush-34.github.io/technicss

Keywords: BMC notice response Mumbai, structural audit C1 C2 notice, emergency building inspection Bandra Khar`,

    poster: {
      headline: "BMC Notice? Act in 72 Hours.",
      subtext: "Ignoring a BMC structural notice puts your committee at legal risk and your residents in danger. We respond within 24 hours.",
      visual: "Urgent red-toned image of a BMC notice letterhead on a desk with a pen. An engineer in hardhat in the background inspecting a wall. Clock showing 72-hour countdown. High-stakes, professional.",
      cta: "📞 Emergency Response — Call Now",
      colorStyle: "Deep burnt orange/red (#7c2d12) background + Bright orange (#fb923c) accent + White text. Urgent, high-alert, action-oriented.",
    },

    captions: {
      linkedin: `📋 C1, C2 or C3 BMC notice received?

Your committee has a legal obligation to respond — fast.

Technicss Structural Consultants provides 24-hour emergency structural assessments and BMC-compliant reports for Mumbai CHS.

📞 Call now. Delayed action = compounded legal risk.
Serving Khar · Bandra · Santacruz · Vile Parle

#BMCNotice #StructuralAudit #CHSMumbai #MumbaiBuildings`,

      instagram: `🚨 BMC notice for your building?

Don't panic — but DO act in the next 72 hours.

A licensed structural engineer can assess, document and respond to BMC on your behalf.

📍 Technicss Structural Consultants — 24hr emergency response
📞 DM or call NOW.

#BMCNotice #MumbaiCHS #BuildingSafety #StructuralAudit #EmergencyInspection #KharWest #BandraWest`,

      whatsapp: `🚨 *URGENT: BMC Notice on Your Building?*

Your society has limited time to respond.

*What to do:*
1. Don't wait — engage a structural engineer NOW
2. Get an independent assessment report
3. Respond to BMC within the deadline

*Technicss Structural Consultants* — 24-hour emergency structural assessment.
Licensed Engineers | Mumbai

📞 Call immediately for urgent support.`,
    },

    hashtags: [
      "#BMCNotice", "#StructuralAudit", "#MumbaiCHS", "#C1Notice",
      "#DangerousBuilding", "#KharWest", "#BandraWest", "#SantacruzMumbai",
      "#VileParle", "#EmergencyInspection", "#BuildingSafety", "#BMCMumbai",
      "#StructuralEngineering", "#TechnicssConsultants", "#MumbaiRealEstate",
    ],
  },

  /* ── DAY 5 ── Visible Warning Signs ────────────────────────── */
  {
    theme: "🔍 Warning Signs in Your Building",
    colorStyle: { bg: "#312e81", text: "#ffffff", accent: "#a5b4fc" },

    linkedin: `🔍 7 THINGS YOUR BUILDING IS TRYING TO TELL YOU.
(And most society committees are ignoring all of them.)

I walked through a building in Santacruz last month that had a "minor seepage issue" according to the secretary.

Here's what I actually found:

1️⃣ Hairline cracks running diagonally from window corners → early sign of differential settlement
2️⃣ Rust staining on external facade → rebar corrosion inside the column
3️⃣ Hollow sound when tapping beams → concrete carbonation / delamination
4️⃣ Efflorescence (white salt deposits) on walls → chronic water ingress
5️⃣ Tilted door/window frames → foundation movement
6️⃣ Visible rebar exposure in balcony slabs → advanced structural decay
7️⃣ "Bulging" in plastered walls → internal concrete spalling

Total repair estimate if done NOW: ₹18 lakh
If ignored for 2 more monsoons: ₹65+ lakh
If ignored until C1 notice: Entire building redevelopment forced.

These buildings are NOT in remote areas. They're in Khar, Bandra, Santacruz and Vile Parle — premium localities with old buildings hiding expensive problems.

What's the minimum investment to catch this early?
A structural audit + condition assessment: ₹60,000–₹1,20,000 for a mid-size CHS.

That's it. That's the price of catching a ₹65 lakh problem early.

DM me if you want a no-obligation inspection for your society.
We operate exclusively in Khar, Bandra, Santacruz & Vile Parle.

#BuildingSafety #StructuralAudit #Mumbai #KharWest #CHSMumbai`,

    maps: `🔍 Cracks, Seepage or Rust in Your Mumbai Building?

Don't wait until it becomes a structural emergency.

Technicss Structural Consultants provides expert building condition assessments for CHS in Khar, Bandra, Santacruz & Vile Parle.

Early detection saves lakhs in repair costs.

📞 Call for a FREE on-site consultation.
🌐 ayush-34.github.io/technicss

Keywords: building cracks inspection Mumbai, seepage audit Khar Bandra, structural condition assessment Mumbai CHS`,

    poster: {
      headline: "7 Signs Your Building Is Screaming for Help.",
      subtext: "Cracks. Rust stains. Seepage. Hollow beams. Each sign costs ₹10x more to fix if ignored another monsoon.",
      visual: "Grid of 4 photos: (1) diagonal crack on wall, (2) rust staining on facade, (3) exposed rebar in balcony, (4) white efflorescence on plinth. 'GET THESE CHECKED' text overlay. Bold, educational.",
      cta: "📞 Free Building Check — Call Today",
      colorStyle: "Deep indigo (#312e81) background + Lavender (#a5b4fc) accents + White text. Educational, warning, calm-but-serious.",
    },

    captions: {
      linkedin: `🔍 Diagonal cracks near windows. Rust stains on facades. Hollow-sounding beams.

These aren't "cosmetic issues" — they're early structural warnings.

A building in Santacruz that ignored these signs for 2 monsoons needed ₹65 lakh in emergency repairs. The audit beforehand cost ₹90,000.

📞 Don't make the same mistake.
Technicss Structural Consultants | Khar · Bandra · Santacruz · Vile Parle

#BuildingCracks #StructuralAudit #MumbaiCHS #BuildingSafety`,

      instagram: `👀 See any of these in your building?

🔴 Diagonal cracks near windows
🔴 Rust stains on walls or columns
🔴 White salt deposits on the plinth
🔴 Bulging or flaking plaster
🔴 Water marks on ceilings

Each one is a structural warning sign. Together? Call us immediately.

📍 Technicss Structural Consultants | Mumbai
📞 DM for FREE inspection

#BuildingCracks #SeepageMumbai #StructuralAudit #KharWest #BandraWest #OldBuilding #CHSMumbai`,

      whatsapp: `🔍 *Is your building showing these signs?*

✅ Cracks on walls / beams / columns
✅ Rust stains or rebar exposure
✅ Seepage or damp patches
✅ Peeling plaster or hollow sound on tapping
✅ Tilted door/window frames

These are NOT cosmetic issues — they're structural warnings.

*Technicss Structural Consultants* offers FREE preliminary on-site checks for Mumbai CHS.
📍 Khar · Bandra · Santacruz · Vile Parle

📞 Call or WhatsApp us to book your visit.`,
    },

    hashtags: [
      "#BuildingCracks", "#SeepageMumbai", "#StructuralWarning", "#KharMumbai",
      "#BandraWest", "#SantacruzMumbai", "#VileParle", "#CHSMumbai",
      "#OldBuilding", "#StructuralAudit", "#BuildingCondition", "#RebarCorrosion",
      "#MumbaiBuildings", "#TechnicssConsultants", "#BuildingSafety",
    ],
  },

  /* ── DAY 6 ── Financial Impact / Cost of Delay ─────────────── */
  {
    theme: "💰 Cost of Delay — Financial Impact",
    colorStyle: { bg: "#1c1917", text: "#ffffff", accent: "#fbbf24" },

    linkedin: `💰 REAL NUMBERS FROM REAL MUMBAI BUILDINGS.
(The true cost of skipping structural maintenance.)

I want to share 3 case studies from our work across Khar & Bandra.
All real. All painful. All preventable.

───
🏢 CASE 1: Khar West, 38-year-old building
Issue identified: Moderate rebar corrosion in 3 columns
If repaired in 2021: ₹9 lakh
Actual repair cost in 2024 after BMC notice: ₹41 lakh
Delay cost: ₹32 lakh + legal fees + 4 months of displaced residents
───
🏢 CASE 2: Bandra East, 45-year-old building
Issue: Terrace waterproofing failure + slab seepage
If treated in 2020: ₹6.5 lakh
Actual slab replacement cost in 2023: ₹28 lakh
Delay cost: ₹21.5 lakh + 6 weeks of building shutdown
───
🏢 CASE 3: Santacruz West, 33-year-old building
Issue: Foundation settlement causing cracking
If addressed in 2019: ₹12 lakh
Actual cost in 2024 after emergency: ₹85 lakh
Delay cost: ₹73 lakh — society had to take a bank loan
───

TOTAL delay cost across 3 societies: ₹1.27 CRORE
Combined audit & early repair cost: ₹27.5 lakh

That's a 4.6x multiplier. Every year of delay, the cost multiplies.

Your society committee has a fiduciary duty to residents.
A structural audit is not an expense. It's the cheapest insurance you'll ever buy.

📞 DM us for a free consultation.
Technicss Structural Consultants | Khar · Bandra · Santacruz · Vile Parle

#StructuralAudit #MumbaiRealEstate #CostOfDelay #CHSMumbai #BuildingSafety`,

    maps: `💰 Ignoring Building Repairs Is Costing Mumbai Societies Crores.

Early structural intervention costs 4-5x LESS than emergency repairs.

Technicss Structural Consultants provides affordable, licensed structural audits for CHS buildings in Khar, Bandra, Santacruz & Vile Parle.

Stop the cost spiral before it starts.

📞 Call for a FREE financial impact assessment.
🌐 ayush-34.github.io/technicss

Keywords: affordable structural audit Mumbai, building repair cost Mumbai, CHS maintenance cost savings Khar Bandra`,

    poster: {
      headline: "₹9 Lakh Today or ₹41 Lakh After the BMC Notice.",
      subtext: "Real numbers from a Khar West CHS. Delay multiplies costs 4–5x. A structural audit is the cheapest insurance you'll buy.",
      visual: "Two-column comparison infographic: LEFT: ₹9L 'Early Repair' with green checkmark. RIGHT: ₹41L 'After BMC Notice' with red warning. Arrow showing time gap. Bottom: 'Technicss Structural Consultants' branding.",
      cta: "💰 Save Lakhs — Audit Now",
      colorStyle: "Deep charcoal black (#1c1917) background + Gold (#fbbf24) numbers and headline + White text. Financial, premium, results-driven.",
    },

    captions: {
      linkedin: `💰 A Khar West society paid ₹9 lakh for corrosion repairs in 2021.

They delayed. BMC notice came in 2024.
The bill: ₹41 lakh.

That's a ₹32 lakh lesson. Entirely preventable.

📞 Your society's structural audit starts at ₹60,000.
Technicss Structural Consultants | Khar · Bandra · Santacruz · Vile Parle

#CostOfDelay #StructuralAudit #CHSMumbai #MumbaiBuildings`,

      instagram: `💸 Every year you delay building repairs, the cost multiplies.

Real case: ₹9L repair → became ₹41L after BMC notice. Same building. Same problem. 3-year delay.

Don't let your society's corpus fund get wiped out by an avoidable emergency.

📍 Technicss Structural Consultants | Mumbai
📞 DM us for FREE preliminary assessment

#BuildingRepair #CHSMumbai #KharWest #BandraWest #CostSaving #StructuralAudit #MumbaiCHS`,

      whatsapp: `💰 *The Real Cost of Ignoring Building Repairs — Mumbai CHS*

📊 Real case from Khar West:
• Early repair (2021): ₹9 lakh
• After BMC notice (2024): ₹41 lakh
• *Delay cost: ₹32 lakh*

This happens across Bandra, Santacruz & Vile Parle every year.

*A structural audit costs ₹60,000–₹1.2 lakh.*
*The saving? Potentially crores.*

*Technicss Structural Consultants*
📞 Call us before the BMC does.`,
    },

    hashtags: [
      "#CostOfDelay", "#StructuralAudit", "#BuildingRepairMumbai", "#CHSMumbai",
      "#KharWest", "#BandraWest", "#SantacruzMumbai", "#VileParle",
      "#MumbaiRealEstate", "#SocietyFunds", "#BMCCompliance", "#PreventiveMaintenance",
      "#StructuralEngineering", "#TechnicssConsultants", "#MumbaiBuildings",
    ],
  },

  /* ── DAY 7 ── Engineer Authority & Trust ───────────────────── */
  {
    theme: "🎓 Engineer Expertise & Trust",
    colorStyle: { bg: "#0f3460", text: "#ffffff", accent: "#e94560" },

    linkedin: `🎓 WHY "CHEAP AUDITS" FROM UNLICENSED CONTRACTORS ARE DESTROYING MUMBAI HOUSING SOCIETIES.

I'll be blunt.

Every month, we're called to review "structural audit reports" done by unlicensed vendors.
Reports that:
❌ Were prepared by non-engineers
❌ Lack core IS-code testing (rebound hammer, carbonation depth, half-cell potential)
❌ Don't mention corrosion levels in rebars
❌ Are rejected outright by BMC
❌ Cost ₹15,000–₹25,000 and are completely worthless

The society then has to pay AGAIN for a proper audit.
But now they've lost 6–12 months — and the building has deteriorated further.

Here's what a PROPER structural audit includes:
📋 Visual inspection + crack mapping with photographic documentation
🔩 Rebound hammer test → surface hardness of concrete
🧪 Carbonation depth test → tells you how much of the cover is compromised
⚡ Half-cell potential test → corrosion probability in rebars
🔬 Core cutting (if required) → actual compressive strength of concrete
📄 IS-456 compliant report accepted by BMC / Court

We are Technicss Structural Consultants — a team of Licensed Structural Engineers.
Not contractors. Not agents. Engineers.

Our reports have been accepted by:
✅ Brihanmumbai Municipal Corporation (BMC)
✅ Maharashtra Housing & Area Development Authority (MHADA)
✅ Civil Courts for legal matters

📞 Before you hire anyone for a structural audit — ask to see their engineering license.
Then call us. We'll show you ours.

Serving Khar (2nd–18th Road), Bandra, Santacruz & Vile Parle.

#LicensedEngineers #StructuralAudit #Mumbai #CHSMumbai #BuildingSafety #EngineeringExcellence`,

    maps: `🎓 Licensed Structural Engineers — Not Just Contractors.

When your building's safety is on the line, credentials matter.

Technicss Structural Consultants:
✅ BMC & MHADA accepted audit reports
✅ IS-456 compliant testing methodology
✅ Licensed Structural Engineers on every project
✅ Serving Khar, Bandra, Santacruz & Vile Parle

📞 Ask us for our engineering license — we'll share it proudly.
🌐 ayush-34.github.io/technicss

Keywords: licensed structural engineer Mumbai, BMC approved audit Khar Bandra, IS 456 structural assessment Mumbai`,

    poster: {
      headline: "Licensed. Tested. Trusted by BMC & MHADA.",
      subtext: "Cheap audits from unlicensed vendors are rejected by BMC — and cost you double. Our reports are accepted by BMC, MHADA & Civil Courts.",
      visual: "Professional engineer in hard hat and safety vest reviewing blueprints. Clean, authoritative background with credentials/badge overlay. Logo prominent. 'Licensed Structural Engineers' text badge. Blue-white color scheme.",
      cta: "🎓 Hire Credentialed Engineers",
      colorStyle: "Deep navy blue (#0f3460) background + Crimson red (#e94560) accent + White text. Authority, trust, credentials, premium.",
    },

    captions: {
      linkedin: `🎓 Asked your structural auditor to show you their engineering license recently?

Unlicensed vendors are producing ₹15,000 "audit reports" that BMC rejects outright.

Then the society pays again — after losing 12 months of repair time.

Technicss Structural Consultants — Licensed. BMC-accepted. MHADA-approved.
📞 Serving Khar · Bandra · Santacruz · Vile Parle

#LicensedEngineers #StructuralAudit #CHSMumbai #MumbaiBuildings`,

      instagram: `🏅 Your building deserves REAL engineers. Not contractors pretending to be one.

At Technicss, we're licensed structural engineers — not agents.

Our reports are accepted by BMC, MHADA & Civil Courts.

📍 Khar · Bandra · Santacruz · Vile Parle · Mumbai
📞 DM for a FREE consultation

#LicensedEngineer #StructuralAudit #MumbaiCHS #KharWest #BandraWest #BMCApproved #RealEngineers`,

      whatsapp: `🎓 *Mumbai CHS Advisory: Check Your Structural Auditor's Credentials*

Many societies are paying ₹15,000–₹25,000 for "audits" by unlicensed vendors.

These reports are *rejected by BMC* and have zero legal standing.

*What to check before hiring:*
✅ Valid structural engineering license
✅ IS-456 compliant methodology
✅ BMC/MHADA report acceptance track record

*Technicss Structural Consultants* — Licensed Structural Engineers, Mumbai.
📍 Khar · Bandra · Santacruz · Vile Parle

📞 Call us. We'll show you our license on the first call.`,
    },

    hashtags: [
      "#LicensedEngineers", "#StructuralAudit", "#MumbaiCHS", "#BMCApproved",
      "#MHADAApproved", "#KharWest", "#BandraWest", "#SantacruzMumbai",
      "#VileParle", "#EngineeringExcellence", "#BuildingSafety", "#IS456",
      "#StructuralEngineering", "#TechnicssConsultants", "#MumbaiRealEstate",
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════════ */
let currentDay = 0; // 0-indexed

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */
function el(id) { return document.getElementById(id); }

function showToast(msg) {
  const t = el("toast");
  t.textContent = "✔ " + (msg || "Copied!");
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

function copyText(text) {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast()).catch(fallbackCopy.bind(null, text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand("copy"); showToast(); } catch (e) { showToast("Copy failed"); }
  document.body.removeChild(ta);
}

/* ══════════════════════════════════════════════════════════════
   RENDER
   ══════════════════════════════════════════════════════════════ */
function renderDay(index) {
  const day = DAYS[index];

  /* Day label */
  el("day-label").textContent = `Day ${index + 1} of ${DAYS.length}`;
  el("day-theme").textContent = day.theme;

  /* LinkedIn */
  el("content-linkedin").textContent = day.linkedin;

  /* Google Maps */
  el("content-maps").textContent = day.maps;

  /* Poster fields */
  const { headline, subtext, visual, cta, colorStyle: cs } = day.poster;
  const posterFieldsHtml = `
    <div class="poster-field full">
      <div class="poster-label">Headline</div>
      <div class="poster-value">${escHtml(headline)}</div>
    </div>
    <div class="poster-field full">
      <div class="poster-label">Subtext</div>
      <div class="poster-value">${escHtml(subtext)}</div>
    </div>
    <div class="poster-field full">
      <div class="poster-label">Visual Idea</div>
      <div class="poster-value">${escHtml(visual)}</div>
    </div>
    <div class="poster-field">
      <div class="poster-label">CTA</div>
      <div class="poster-value">${escHtml(cta)}</div>
    </div>
    <div class="poster-field">
      <div class="poster-label">Color Style</div>
      <div class="poster-value">${escHtml(cs)}</div>
    </div>
  `;
  el("poster-fields").innerHTML = posterFieldsHtml;

  /* Poster preview */
  const preview = el("poster-preview");
  const dc = day.colorStyle;
  preview.style.background = `linear-gradient(145deg, ${dc.bg} 0%, ${shadeColor(dc.bg, 20)} 100%)`;
  preview.style.color = dc.text;
  el("pv-headline").textContent = headline;
  el("pv-headline").style.color = dc.accent;
  el("pv-subtext").textContent = subtext;
  el("pv-cta").textContent = cta;

  /* Hidden poster text for copy */
  el("content-poster-text").textContent =
    `HEADLINE: ${headline}\n\nSUBTEXT: ${subtext}\n\nVISUAL IDEA: ${visual}\n\nCTA: ${cta}\n\nCOLOR STYLE: ${cs}`;

  /* Captions */
  el("content-cap-linkedin").textContent = day.captions.linkedin;
  el("content-cap-instagram").textContent = day.captions.instagram;
  el("content-cap-whatsapp").textContent = day.captions.whatsapp;

  /* Hashtags */
  const cloud = el("hashtag-cloud");
  cloud.innerHTML = day.hashtags.map(h =>
    `<span class="hashtag-pill" role="button" tabindex="0" aria-label="Copy ${h}">${escHtml(h)}</span>`
  ).join("");

  /* Attach pill click handlers */
  cloud.querySelectorAll(".hashtag-pill").forEach(pill => {
    pill.addEventListener("click", () => copyText(pill.textContent));
    pill.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") copyText(pill.textContent); });
  });

  /* Nav buttons state */
  el("btn-prev").disabled = index === 0;
  el("btn-next").disabled = index === DAYS.length - 1;
  el("btn-prev").style.opacity = index === 0 ? "0.4" : "1";
  el("btn-next").style.opacity = index === DAYS.length - 1 ? "0.4" : "1";
}

/* ══════════════════════════════════════════════════════════════
   COPY BUTTONS
   ══════════════════════════════════════════════════════════════ */
document.querySelectorAll(".copy-btn[data-target]").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;

    if (targetId === "active-caption") {
      const activePane = document.querySelector(".tab-pane.active pre.content-text");
      copyText(activePane ? activePane.textContent : "");
    } else {
      const target = el(targetId);
      copyText(target ? target.textContent : "");
    }

    btn.classList.add("copied");
    btn.textContent = "✔ Copied";
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerHTML = "📋 Copy";
    }, 2000);
  });
});

/* Copy all hashtags */
el("copy-all-hashtags").addEventListener("click", () => {
  const tags = DAYS[currentDay].hashtags.join(" ");
  copyText(tags);
  const btn = el("copy-all-hashtags");
  btn.classList.add("copied");
  btn.textContent = "✔ Copied";
  setTimeout(() => {
    btn.classList.remove("copied");
    btn.innerHTML = "📋 Copy All";
  }, 2000);
});

/* ══════════════════════════════════════════════════════════════
   CAPTION TABS
   ══════════════════════════════════════════════════════════════ */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const pane = el(btn.dataset.tab);
    if (pane) pane.classList.add("active");
  });
});

/* ══════════════════════════════════════════════════════════════
   DAY NAVIGATION
   ══════════════════════════════════════════════════════════════ */
el("btn-prev").addEventListener("click", () => {
  if (currentDay > 0) { currentDay--; renderDay(currentDay); }
});
el("btn-next").addEventListener("click", () => {
  if (currentDay < DAYS.length - 1) { currentDay++; renderDay(currentDay); }
});

/* ══════════════════════════════════════════════════════════════
   DOWNLOAD / EXPORT
   ══════════════════════════════════════════════════════════════ */
function buildFullText(day, index) {
  const sep = "═".repeat(68);
  const thin = "─".repeat(68);
  return [
    sep,
    `TECHNICSS STRUCTURAL CONSULTANTS — DAILY MARKETING CONTENT`,
    `Day ${index + 1}: ${day.theme}`,
    `Generated: ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
    sep,
    "",
    "🔹 LINKEDIN POST:",
    thin,
    day.linkedin,
    "",
    "🔹 GOOGLE BUSINESS POST:",
    thin,
    day.maps,
    "",
    "🔹 POSTER CONTENT:",
    thin,
    `HEADLINE: ${day.poster.headline}`,
    `SUBTEXT: ${day.poster.subtext}`,
    `VISUAL IDEA: ${day.poster.visual}`,
    `CTA: ${day.poster.cta}`,
    `COLOR STYLE: ${day.poster.colorStyle}`,
    "",
    "🔹 CAPTIONS:",
    thin,
    "LinkedIn Caption:",
    day.captions.linkedin,
    "",
    "Instagram Caption:",
    day.captions.instagram,
    "",
    "WhatsApp Forward:",
    day.captions.whatsapp,
    "",
    "🔹 HASHTAGS:",
    thin,
    day.hashtags.join(" "),
    "",
    sep,
  ].join("\n");
}

el("btn-copy-all").addEventListener("click", () => {
  copyText(buildFullText(DAYS[currentDay], currentDay));
  showToast("All content copied!");
});

el("btn-download").addEventListener("click", () => {
  const text = buildFullText(DAYS[currentDay], currentDay);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `technicss-marketing-day${currentDay + 1}-${dateStr}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

/* ══════════════════════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════════════════════ */
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Lighten or darken a hex color by `amount` (positive = lighter) */
function shadeColor(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */
(function init() {
  /* Set today's date */
  const now = new Date();
  el("today-date").textContent = now.toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  /* Auto-select day based on day of week (Mon=Day1 … Sun=Day7) */
  currentDay = (now.getDay() + 6) % DAYS.length;

  renderDay(currentDay);
})();
