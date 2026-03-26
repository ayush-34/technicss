/* ========================================
   Redevelopment Feasibility Calculator
   JavaScript Calculation Engine
   Technicss Structural Consultants
   ======================================== */

(function () {
    "use strict";

    // ---- Constants ----
    var SQM_TO_SQFT = 10.7639;
    var CARPET_TO_BUILTUP_FACTOR = 1.30; // loading factor for common areas

    // ---- CONFIG – all editable assumptions ----
    var CONFIG = {
        fungiblePct:     0.35,   // Fungible FSI as % of base FSI
        tdrLoading:      0.5,    // TDR applied for eligible plots
        rehabIncrease:   0.35,   // Rehab carpet increase (35%)
        rentRate:        80,     // ₹/sq.ft/month alternate accommodation rent
        projectDuration: 36,     // months
        corpusPerFlat:   2000000,// ₹ per flat corpus fund
        premiumPct:      0.15,   // 15% of construction cost
        financePct:      0.10,   // 10% of net sale revenue
        riskPct:         0.10,   // 10% of net sale revenue
        saleDiscount:    0.10,   // 10% discount on gross sale revenue
        transitRate:     1500,   // ₹/sq.ft for transit camp
        includeTransit:  false
    };

    // ---- Read CONFIG from Settings UI ----
    function readConfig() {
        function pct(id) {
            var v = parseFloat(document.getElementById(id).value);
            return (isNaN(v) ? 0 : v) / 100;
        }
        function num(id) {
            var v = parseFloat(document.getElementById(id).value);
            return isNaN(v) ? 0 : v;
        }
        CONFIG.fungiblePct     = pct("cfg-fungible-pct");
        CONFIG.tdrLoading      = num("cfg-tdr-loading");
        CONFIG.rehabIncrease   = pct("cfg-rehab-increase");
        CONFIG.rentRate        = num("cfg-rent-rate");
        CONFIG.projectDuration = num("cfg-project-duration");
        CONFIG.corpusPerFlat   = num("cfg-corpus-per-flat");
        CONFIG.premiumPct      = pct("cfg-premium-pct");
        CONFIG.financePct      = pct("cfg-finance-pct");
        CONFIG.riskPct         = pct("cfg-risk-pct");
        CONFIG.saleDiscount    = pct("cfg-sale-discount");
        CONFIG.transitRate     = num("cfg-transit-rate");
        CONFIG.includeTransit  = document.getElementById("cfg-transit-camp").checked;
    }

    var SCHEME_BASE_FSI = {
        "33_5": 3.5,
        "33_5_no_mhada_share": 4.0,
        "33_7": 4.0,
        "33_9": 4.5,
        "33_10": 4.0,
        "33_11": 4.0,
        "33_19": 4.0,
        "30a_33_7a": 4.0,
        "30a_33_7b": 4.0,
        "30a_33_7a_33_12b": 4.5,
        "30a_33_7b_33_12b": 4.5,
        "30a_33_7a_33_20b": 4.5,
        "30a_33_7b_33_20b": 4.5
    };

    // ---- Zone Label Helper ----
    function getZoneLabel(zone) {
        var labels = {
            "33_1": "Normal Housing Society (33(1))",
            "33_5": "MHADA Layout (33(5))",
            "33_5_no_mhada_share": "33(5) Without MHADA Sharing",
            "33_7": "Cessed Building (33(7))",
            "33_9": "Cluster Redevelopment (33(9))",
            "33_10": "Regulation 33(10)",
            "33_11": "Regulation 33(11)",
            "33_19": "Regulation 33(19)",
            "30a_33_7a": "30(A)+33(7A)",
            "30a_33_7b": "30(A)+33(7B)",
            "30a_33_7a_33_12b": "30(A)+33(7A)+33(12B)",
            "30a_33_7b_33_12b": "30(A)+33(7B)+33(12B)",
            "30a_33_7a_33_20b": "30(A)+33(7A)+33(20B)",
            "30a_33_7b_33_20b": "30(A)+33(7B)+33(20B)",
            "suburbs": "Suburbs / Extended Suburbs",
            "island-city": "Island City"
        };
        return labels[zone] || zone;
    }

    // ---- FSI Rules per DCPR 2034 ----
    function getBaseFSI(roadWidth, zone) {
        // Scheme-specific FSI overrides
        if (Object.prototype.hasOwnProperty.call(SCHEME_BASE_FSI, zone)) return SCHEME_BASE_FSI[zone];
        // Island City norms (33_1 or explicit island-city)
        if (zone === "island-city") {
            if (roadWidth < 9) return 1.33;
            if (roadWidth < 12) return 2.0;
            return 3.0;
        }
        // Suburbs / Extended Suburbs / 33_1 (normal society)
        if (roadWidth < 9) return 2.0;
        if (roadWidth < 12) return 2.5;
        return 3.0;
    }

    function getTDR(roadWidth, zone) {
        if (zone === "island-city") {
            return 0; // TDR not commonly loaded in island city
        }
        if (roadWidth < 9) return 0;
        return CONFIG.tdrLoading;
    }

    // ---- Utility Functions ----
    function formatNumber(num) {
        if (num === undefined || num === null || isNaN(num)) return "0";
        return Number(num).toLocaleString("en-IN", { maximumFractionDigits: 2 });
    }

    function formatCurrency(num) {
        if (num === undefined || num === null || isNaN(num)) return "₹0";
        if (Math.abs(num) >= 1e7) {
            return "₹" + (num / 1e7).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " Cr";
        }
        if (Math.abs(num) >= 1e5) {
            return "₹" + (num / 1e5).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " L";
        }
        return "₹" + Number(num).toLocaleString("en-IN", { maximumFractionDigits: 0 });
    }

    // ---- DOM References ----
    var form = document.getElementById("feasibility-form");
    var resultsSection = document.getElementById("results-section");
    var inputSection = document.getElementById("input-section");
    var downloadPdfBtn = document.getElementById("download-pdf-btn");
    var recalculateBtn = document.getElementById("recalculate-btn");
    var plotAreaHint = document.getElementById("plot-area-hint");
    var footerYear = document.getElementById("footer-year");
    var transitCampToggle = document.getElementById("cfg-transit-camp");
    var transitRateGroup = document.getElementById("transit-rate-group");

    // Transit camp rate group visibility toggle
    if (transitCampToggle && transitRateGroup) {
        transitCampToggle.addEventListener("change", function () {
            if (transitCampToggle.checked) {
                transitRateGroup.classList.remove("hidden");
            } else {
                transitRateGroup.classList.add("hidden");
            }
        });
    }

    // Store last results for PDF
    var lastResults = null;
    var lastInputs = null;

    // ---- Footer year ----
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ---- Plot area unit conversion hint ----
    var plotAreaInput = document.getElementById("plot-area");
    var plotAreaUnit = document.getElementById("plot-area-unit");

    function updatePlotAreaHint() {
        var val = parseFloat(plotAreaInput.value);
        if (!val || val <= 0) {
            plotAreaHint.textContent = "";
            return;
        }
        if (plotAreaUnit.value === "sqm") {
            plotAreaHint.textContent = "= " + formatNumber(val * SQM_TO_SQFT) + " sq.ft";
        } else {
            plotAreaHint.textContent = "= " + formatNumber(val / SQM_TO_SQFT) + " sq.m";
        }
    }

    plotAreaInput.addEventListener("input", updatePlotAreaHint);
    plotAreaUnit.addEventListener("change", updatePlotAreaHint);

    // ---- Form Validation ----
    function validateForm() {
        var valid = true;
        var fields = ["plot-area", "road-width", "num-flats", "carpet-area", "existing-builtup", "num-buildings", "building-age", "market-rate"];

        fields.forEach(function (id) {
            var input = document.getElementById(id);
            var val = parseFloat(input.value);
            if (!val || val <= 0) {
                input.classList.add("error");
                valid = false;
            } else {
                input.classList.remove("error");
            }
        });

        return valid;
    }

    // ---- Main Calculation ----
    function calculate() {
        // Read settings before computing
        readConfig();

        // Gather inputs
        var plotAreaRaw = parseFloat(document.getElementById("plot-area").value);
        var plotAreaUnitVal = plotAreaUnit.value;
        var roadWidth = parseFloat(document.getElementById("road-width").value);
        var zone = document.getElementById("zone").value;
        var numFlats = parseInt(document.getElementById("num-flats").value, 10);
        var carpetAreaPerFlat = parseFloat(document.getElementById("carpet-area").value);
        var existingBuiltup = parseFloat(document.getElementById("existing-builtup").value);
        var numBuildings = parseInt(document.getElementById("num-buildings").value, 10);
        var buildingAge = parseInt(document.getElementById("building-age").value, 10);
        var marketRate = parseFloat(document.getElementById("market-rate").value);
        var constructionRate = parseFloat(document.getElementById("construction-cost").value) || 4000;

        // Convert plot area to sq.ft for calculations
        var plotAreaSqFt = plotAreaUnitVal === "sqm" ? plotAreaRaw * SQM_TO_SQFT : plotAreaRaw;
        var plotAreaSqM = plotAreaUnitVal === "sqm" ? plotAreaRaw : plotAreaRaw / SQM_TO_SQFT;

        // Save inputs for PDF
        lastInputs = {
            plotAreaRaw: plotAreaRaw,
            plotAreaUnit: plotAreaUnitVal,
            plotAreaSqFt: plotAreaSqFt,
            plotAreaSqM: plotAreaSqM,
            roadWidth: roadWidth,
            zone: zone,
            numFlats: numFlats,
            carpetAreaPerFlat: carpetAreaPerFlat,
            existingBuiltup: existingBuiltup,
            numBuildings: numBuildings,
            buildingAge: buildingAge,
            marketRate: marketRate,
            constructionCost: constructionRate
        };

        // FSI Calculations
        var existingFSI = existingBuiltup / plotAreaSqFt;
        var baseFSI = getBaseFSI(roadWidth, zone);
        var fungibleFSI = baseFSI * CONFIG.fungiblePct;
        var tdr = getTDR(roadWidth, zone);
        var totalPermissibleFSI = baseFSI + fungibleFSI + tdr;

        // Area Calculations
        var totalBuildableArea = totalPermissibleFSI * plotAreaSqFt;
        var existingTotalCarpet = numFlats * carpetAreaPerFlat;
        var rehabCarpetPerFlat = carpetAreaPerFlat * (1 + CONFIG.rehabIncrease);
        var totalRehabCarpet = numFlats * rehabCarpetPerFlat;
        var totalRehabBuiltup = totalRehabCarpet * CARPET_TO_BUILTUP_FACTOR;
        var saleComponentArea = totalBuildableArea - totalRehabBuiltup;
        if (saleComponentArea < 0) saleComponentArea = 0;

        // Financial Calculations (realistic model)
        // Effective sale revenue: apply discount for loading, negotiation, unsold inventory
        var grossSaleRevenue = saleComponentArea * marketRate;
        var saleRevenue = grossSaleRevenue * (1 - CONFIG.saleDiscount);

        // Costs
        var constructionCost = totalBuildableArea * constructionRate;
        var premiumCharges = constructionCost * CONFIG.premiumPct;
        var rentCost = totalRehabCarpet * CONFIG.rentRate * CONFIG.projectDuration;
        var corpusCost = numFlats * CONFIG.corpusPerFlat;
        var professionalFees = saleRevenue * 0.02;
        var financeCost = saleRevenue * CONFIG.financePct;
        var riskCost = saleRevenue * CONFIG.riskPct;
        var transitCost = CONFIG.includeTransit ? totalRehabCarpet * CONFIG.transitRate : 0;

        var totalProjectCost = constructionCost + premiumCharges + rentCost + corpusCost +
            professionalFees + financeCost + riskCost + transitCost;

        var developerProfit = saleRevenue - totalProjectCost;
        var profitMarginPct = saleRevenue > 0 ? (developerProfit / saleRevenue) * 100 : 0;

        // Rehab vs Sale percentages
        var rehabPct = totalBuildableArea > 0 ? (totalRehabBuiltup / totalBuildableArea) * 100 : 0;
        var salePct = totalBuildableArea > 0 ? (saleComponentArea / totalBuildableArea) * 100 : 0;

        // Feasibility rating
        var feasibilityRating;
        if (saleComponentArea <= 0) {
            feasibilityRating = "Not Feasible";
        } else if (profitMarginPct > 35) {
            feasibilityRating = "Highly Attractive";
        } else if (profitMarginPct >= 20) {
            feasibilityRating = "Feasible";
        } else {
            feasibilityRating = "Risky";
        }

        // Store results
        lastResults = {
            existingFSI: existingFSI,
            baseFSI: baseFSI,
            fungibleFSI: fungibleFSI,
            tdr: tdr,
            totalPermissibleFSI: totalPermissibleFSI,
            totalBuildableArea: totalBuildableArea,
            existingTotalCarpet: existingTotalCarpet,
            rehabCarpetPerFlat: rehabCarpetPerFlat,
            totalRehabCarpet: totalRehabCarpet,
            totalRehabBuiltup: totalRehabBuiltup,
            saleComponentArea: saleComponentArea,
            grossSaleRevenue: grossSaleRevenue,
            saleRevenue: saleRevenue,
            constructionCost: constructionCost,
            premiumCharges: premiumCharges,
            rentCost: rentCost,
            corpusCost: corpusCost,
            professionalFees: professionalFees,
            financeCost: financeCost,
            riskCost: riskCost,
            transitCost: transitCost,
            totalProjectCost: totalProjectCost,
            developerProfit: developerProfit,
            profitMarginPct: profitMarginPct,
            rehabPct: rehabPct,
            salePct: salePct,
            feasibilityRating: feasibilityRating
        };

        return lastResults;
    }

    // ---- Render Results ----
    function renderResults(r) {
        var fungiblePctDisplay = (CONFIG.fungiblePct * 100).toFixed(0);
        var rehabIncreasePctDisplay = (CONFIG.rehabIncrease * 100).toFixed(0);
        var saleDiscountPctDisplay = (CONFIG.saleDiscount * 100).toFixed(0);
        var premiumPctDisplay = (CONFIG.premiumPct * 100).toFixed(0);
        var financePctDisplay = (CONFIG.financePct * 100).toFixed(0);
        var riskPctDisplay = (CONFIG.riskPct * 100).toFixed(0);

        // FSI Table
        var fsiBody = document.querySelector("#fsi-table tbody");
        fsiBody.innerHTML = [
            row("Existing FSI", r.existingFSI.toFixed(2)),
            row("Base Permissible FSI", r.baseFSI.toFixed(2)),
            row("Fungible FSI (" + fungiblePctDisplay + "% Residential)", r.fungibleFSI.toFixed(2)),
            row("TDR Loading", r.tdr.toFixed(2)),
            rowHighlight("Total Permissible FSI", r.totalPermissibleFSI.toFixed(2))
        ].join("");

        // Area Table
        var areaBody = document.querySelector("#area-table tbody");
        areaBody.innerHTML = [
            row("Plot Area", formatNumber(lastInputs.plotAreaSqFt) + " sq.ft (" + formatNumber(lastInputs.plotAreaSqM) + " sq.m)"),
            row("Existing Total Built-up Area", formatNumber(lastInputs.existingBuiltup) + " sq.ft"),
            row("Existing Total Carpet Area (" + lastInputs.numFlats + " flats)", formatNumber(r.existingTotalCarpet) + " sq.ft"),
            rowHighlight("Total Buildable Area", formatNumber(r.totalBuildableArea) + " sq.ft"),
            row("Rehab Carpet per Flat (+" + rehabIncreasePctDisplay + "%)", formatNumber(r.rehabCarpetPerFlat) + " sq.ft"),
            row("Total Rehab Carpet Area", formatNumber(r.totalRehabCarpet) + " sq.ft"),
            row("Total Rehab Built-up Area", formatNumber(r.totalRehabBuiltup) + " sq.ft"),
            rowHighlight("Sale Component Area", formatNumber(r.saleComponentArea) + " sq.ft")
        ].join("");

        // Component Bar
        document.getElementById("bar-rehab").style.width = r.rehabPct.toFixed(1) + "%";
        document.getElementById("bar-sale").style.width = r.salePct.toFixed(1) + "%";
        document.getElementById("rehab-pct").textContent = r.rehabPct.toFixed(1) + "%";
        document.getElementById("sale-pct").textContent = r.salePct.toFixed(1) + "%";

        // Component Table
        var compBody = document.querySelector("#component-table tbody");
        compBody.innerHTML = [
            row3("Rehab Component", formatNumber(r.totalRehabBuiltup), r.rehabPct.toFixed(1) + "%"),
            row3("Sale Component", formatNumber(r.saleComponentArea), r.salePct.toFixed(1) + "%"),
            row3Highlight("Total Buildable Area", formatNumber(r.totalBuildableArea), "100%")
        ].join("");

        // Financial Table
        var finBody = document.querySelector("#financial-table tbody");
        var transitRow = CONFIG.includeTransit
            ? row("Transit Camp Cost (" + formatNumber(r.totalRehabCarpet) + " sq.ft × ₹" + formatNumber(CONFIG.transitRate) + ")", formatCurrency(r.transitCost))
            : "";
        finBody.innerHTML = [
            row("Gross Sale Revenue (" + formatNumber(r.saleComponentArea) + " sq.ft × ₹" + formatNumber(lastInputs.marketRate) + ")", formatCurrency(r.grossSaleRevenue)),
            row("Sale Discount (" + saleDiscountPctDisplay + "% – loading / negotiation / unsold)", "–" + formatCurrency(r.grossSaleRevenue - r.saleRevenue)),
            rowHighlight("Net Sale Revenue", formatCurrency(r.saleRevenue)),
            row("Construction Cost (" + formatNumber(r.totalBuildableArea) + " sq.ft × ₹" + formatNumber(lastInputs.constructionCost) + ")", formatCurrency(r.constructionCost)),
            row("Premium & Statutory Charges (" + premiumPctDisplay + "%)", formatCurrency(r.premiumCharges)),
            row("Rent / Alternate Accommodation (" + lastInputs.numFlats + " flats × " + CONFIG.projectDuration + " months)", formatCurrency(r.rentCost)),
            row("Corpus Fund (₹" + formatNumber(CONFIG.corpusPerFlat / 100000) + "L × " + lastInputs.numFlats + " flats)", formatCurrency(r.corpusCost)),
            row("Professional Fees (Architect/PMC, 2%)", formatCurrency(r.professionalFees)),
            row("Finance Cost (" + financePctDisplay + "%)", formatCurrency(r.financeCost)),
            row("Risk Factor (" + riskPctDisplay + "% – contingencies, corpus overruns, etc.)", formatCurrency(r.riskCost)),
            transitRow,
            row("Total Project Cost", formatCurrency(r.totalProjectCost)),
            rowHighlight("Estimated Developer Profit", formatCurrency(r.developerProfit)),
            row("Profit Margin (on Net Sale Revenue)", r.profitMarginPct.toFixed(1) + "% " + getFeasibilityBadge(r.feasibilityRating))
        ].join("");

        // Conclusion
        var conclusionBox = document.getElementById("conclusion-box");
        var conclusionText = document.getElementById("conclusion-text");
        conclusionBox.className = "conclusion-box";

        if (r.saleComponentArea <= 0) {
            conclusionBox.classList.add("not-feasible");
            conclusionText.innerHTML = "<strong>Not Feasible:</strong> The total rehab area exceeds the total buildable area. There is no sale component available for the developer. The project is not feasible under current parameters.";
        } else if (r.profitMarginPct > 35) {
            conclusionBox.classList.add("feasible");
            conclusionText.innerHTML = "<strong>Highly Attractive &#10003;:</strong> The project shows an excellent profit margin of <strong>" + r.profitMarginPct.toFixed(1) + "%</strong>. With a sale component of <strong>" + formatNumber(r.saleComponentArea) + " sq.ft</strong> and estimated developer profit of <strong>" + formatCurrency(r.developerProfit) + "</strong>, this redevelopment is highly attractive for developers.";
        } else if (r.profitMarginPct >= 20) {
            conclusionBox.classList.add("feasible");
            conclusionText.innerHTML = "<strong>Feasible &#10003;:</strong> The project shows a healthy profit margin of <strong>" + r.profitMarginPct.toFixed(1) + "%</strong>. With a sale component of <strong>" + formatNumber(r.saleComponentArea) + " sq.ft</strong> and estimated developer profit of <strong>" + formatCurrency(r.developerProfit) + "</strong>, this redevelopment appears financially viable.";
        } else if (r.profitMarginPct >= 5) {
            conclusionBox.classList.add("marginal");
            conclusionText.innerHTML = "<strong>Risky / Marginally Feasible &#9888;:</strong> The project shows a thin profit margin of <strong>" + r.profitMarginPct.toFixed(1) + "%</strong>. While there is a sale component of <strong>" + formatNumber(r.saleComponentArea) + " sq.ft</strong>, the developer profit of <strong>" + formatCurrency(r.developerProfit) + "</strong> may not be sufficient to cover risks and contingencies. Further detailed analysis and negotiation is recommended.";
        } else {
            conclusionBox.classList.add("not-feasible");
            conclusionText.innerHTML = "<strong>Not Feasible &#10007;:</strong> The project shows a negative or very low profit margin of <strong>" + r.profitMarginPct.toFixed(1) + "%</strong>. The estimated developer profit is <strong>" + formatCurrency(r.developerProfit) + "</strong>. The project does not appear financially viable under current parameters.";
        }

        // Developer Perspective Note
        var noteBox = document.getElementById("developer-note-box");
        noteBox.innerHTML = buildDeveloperNote(r);
    }

    function getFeasibilityBadge(rating) {
        var cls = rating === "Highly Attractive" ? "rating-high"
                : rating === "Feasible"          ? "rating-feasible"
                : "rating-risky";
        return '<span class="feasibility-rating-badge ' + cls + '">' + rating + '</span>';
    }

    function buildDeveloperNote(r) {
        var lines = [];
        lines.push("<strong>Key observations from a developer's perspective:</strong>");
        lines.push("<ul>");

        var saleToTotal = r.totalBuildableArea > 0 ? (r.saleComponentArea / r.totalBuildableArea * 100) : 0;
        var saleComment;
        if (saleToTotal >= 40) {
            saleComment = "good commercial headroom.";
        } else if (saleToTotal >= 30) {
            saleComment = "moderate commercial headroom.";
        } else {
            saleComment = "limited sale inventory; project viability is sensitive to market rates.";
        }
        lines.push("<li>Sale component represents <strong>" + saleToTotal.toFixed(1) + "%</strong> of total buildable area – " + saleComment + "</li>");

        lines.push("<li>Net sale revenue after " + (CONFIG.saleDiscount * 100).toFixed(0) + "% discount: <strong>" + formatCurrency(r.saleRevenue) + "</strong> (gross: " + formatCurrency(r.grossSaleRevenue) + ").</li>");

        var costRatio = r.saleRevenue > 0 ? (r.totalProjectCost / r.saleRevenue * 100) : 0;
        var costComment;
        if (costRatio < 70) {
            costComment = "well within acceptable range.";
        } else if (costRatio < 85) {
            costComment = "tight; cost overruns could erode margins.";
        } else {
            costComment = "very high; project economics are fragile.";
        }
        lines.push("<li>Total project cost is <strong>" + costRatio.toFixed(1) + "%</strong> of net sale revenue – " + costComment + "</li>");

        lines.push("<li>Construction + premium charges: <strong>" + formatCurrency(r.constructionCost + r.premiumCharges) + "</strong> (" +
            (r.saleRevenue > 0 ? ((r.constructionCost + r.premiumCharges) / r.saleRevenue * 100).toFixed(1) : 0) + "% of net revenue).</li>");

        if (CONFIG.includeTransit && r.transitCost > 0) {
            lines.push("<li>Transit camp cost included: <strong>" + formatCurrency(r.transitCost) + "</strong>.</li>");
        }

        if (r.profitMarginPct > 35) {
            lines.push("<li>&#127881; At <strong>" + r.profitMarginPct.toFixed(1) + "%</strong> margin this project offers strong developer returns well above the industry benchmark of 20–25%.</li>");
        } else if (r.profitMarginPct >= 20) {
            lines.push("<li>&#9989; Profit margin of <strong>" + r.profitMarginPct.toFixed(1) + "%</strong> meets the industry benchmark of 20–25% for Mumbai redevelopment.</li>");
        } else if (r.profitMarginPct >= 5) {
            lines.push("<li>&#9888;&#65039; Margin of <strong>" + r.profitMarginPct.toFixed(1) + "%</strong> is below the 20% benchmark. Consider negotiating plot area, sale rates, or construction costs.</li>");
        } else {
            lines.push("<li>&#10060; Margin of <strong>" + r.profitMarginPct.toFixed(1) + "%</strong> is unviable. The project requires significant restructuring of assumptions or a higher-FSI scheme.</li>");
        }

        lines.push("</ul>");
        return lines.join("");
    }

    // Table row helpers
    function row(label, value) {
        return "<tr><td>" + label + "</td><td>" + value + "</td></tr>";
    }

    function rowHighlight(label, value) {
        return '<tr class="highlight"><td>' + label + "</td><td>" + value + "</td></tr>";
    }

    function row3(c1, c2, c3) {
        return "<tr><td>" + c1 + "</td><td>" + c2 + "</td><td>" + c3 + "</td></tr>";
    }

    function row3Highlight(c1, c2, c3) {
        return '<tr class="highlight"><td>' + c1 + "</td><td>" + c2 + "</td><td>" + c3 + "</td></tr>";
    }

    // ---- Form Submit ----
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        var results = calculate();
        renderResults(results);
        resultsSection.classList.remove("hidden");
        resultsSection.scrollIntoView({ behavior: "smooth" });
    });

    // ---- Reset ----
    form.addEventListener("reset", function () {
        resultsSection.classList.add("hidden");
        plotAreaHint.textContent = "";
        var inputs = form.querySelectorAll("input");
        inputs.forEach(function (input) {
            input.classList.remove("error");
        });
        lastResults = null;
        lastInputs = null;
    });

    // ---- Recalculate ----
    recalculateBtn.addEventListener("click", function () {
        inputSection.scrollIntoView({ behavior: "smooth" });
    });

    // ---- PDF Generation ----
    downloadPdfBtn.addEventListener("click", function () {
        if (!lastResults || !lastInputs) return;
        generatePDF(lastInputs, lastResults);
    });

    function generatePDF(inputs, r) {
        var jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF("p", "mm", "a4");
        var pageWidth = doc.internal.pageSize.getWidth();
        var margin = 15;
        var y = 20;

        // Title
        doc.setFontSize(18);
        doc.setTextColor(26, 82, 118);
        doc.text("Preliminary Feasibility Report (PFR)", pageWidth / 2, y, { align: "center" });
        y += 8;
        doc.setFontSize(12);
        doc.text("for Building Redevelopment", pageWidth / 2, y, { align: "center" });
        y += 6;
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text("As per DCPR 2034 | Generated by Technicss Structural Consultants", pageWidth / 2, y, { align: "center" });
        y += 4;
        doc.setDrawColor(26, 82, 118);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;

        // Date
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text("Date: " + new Date().toLocaleDateString("en-IN"), pageWidth - margin, y, { align: "right" });
        y += 8;

        // Section 1: Project Inputs
        doc.setFontSize(12);
        doc.setTextColor(26, 82, 118);
        doc.text("1. Project Inputs", margin, y);
        y += 6;

        doc.autoTable({
            startY: y,
            margin: { left: margin, right: margin },
            head: [["Parameter", "Value"]],
            body: [
                ["Plot Area", formatNumber(inputs.plotAreaSqFt) + " sq.ft (" + formatNumber(inputs.plotAreaSqM) + " sq.m)"],
                ["Road Width", inputs.roadWidth + " m"],
                ["Zone / Scheme", getZoneLabel(inputs.zone)],
                ["Number of Existing Flats", inputs.numFlats.toString()],
                ["Existing Carpet Area per Flat", formatNumber(inputs.carpetAreaPerFlat) + " sq.ft"],
                ["Existing Total Built-up Area", formatNumber(inputs.existingBuiltup) + " sq.ft"],
                ["Number of Buildings", inputs.numBuildings.toString()],
                ["Building Age", inputs.buildingAge + " years"],
                ["Market Sale Rate", "\u20B9" + formatNumber(inputs.marketRate) + " / sq.ft"],
                ["Construction Cost", "\u20B9" + formatNumber(inputs.constructionCost) + " / sq.ft"]
            ],
            theme: "grid",
            headStyles: { fillColor: [26, 82, 118] },
            styles: { fontSize: 9 }
        });

        y = doc.lastAutoTable.finalY + 10;

        // Section 2: FSI Calculations
        doc.setFontSize(12);
        doc.setTextColor(26, 82, 118);
        doc.text("2. FSI Calculations", margin, y);
        y += 6;

        doc.autoTable({
            startY: y,
            margin: { left: margin, right: margin },
            head: [["Parameter", "Value"]],
            body: [
                ["Existing FSI", r.existingFSI.toFixed(2)],
                ["Base Permissible FSI", r.baseFSI.toFixed(2)],
                ["Fungible FSI (" + (CONFIG.fungiblePct * 100).toFixed(0) + "% Residential)", r.fungibleFSI.toFixed(2)],
                ["TDR Loading", r.tdr.toFixed(2)],
                ["Total Permissible FSI", r.totalPermissibleFSI.toFixed(2)]
            ],
            theme: "grid",
            headStyles: { fillColor: [26, 82, 118] },
            styles: { fontSize: 9 }
        });

        y = doc.lastAutoTable.finalY + 10;

        // Section 3: Area Calculations
        doc.setFontSize(12);
        doc.setTextColor(26, 82, 118);
        doc.text("3. Area Calculations", margin, y);
        y += 6;

        doc.autoTable({
            startY: y,
            margin: { left: margin, right: margin },
            head: [["Parameter", "Value"]],
            body: [
                ["Total Buildable Area", formatNumber(r.totalBuildableArea) + " sq.ft"],
                ["Existing Total Carpet Area", formatNumber(r.existingTotalCarpet) + " sq.ft"],
                ["Rehab Carpet per Flat (+" + (CONFIG.rehabIncrease * 100).toFixed(0) + "%)", formatNumber(r.rehabCarpetPerFlat) + " sq.ft"],
                ["Total Rehab Carpet Area", formatNumber(r.totalRehabCarpet) + " sq.ft"],
                ["Total Rehab Built-up Area", formatNumber(r.totalRehabBuiltup) + " sq.ft"],
                ["Sale Component Area", formatNumber(r.saleComponentArea) + " sq.ft"]
            ],
            theme: "grid",
            headStyles: { fillColor: [26, 82, 118] },
            styles: { fontSize: 9 }
        });

        y = doc.lastAutoTable.finalY + 10;

        // Check page overflow
        if (y > 230) {
            doc.addPage();
            y = 20;
        }

        // Section 4: Rehab vs Sale
        doc.setFontSize(12);
        doc.setTextColor(26, 82, 118);
        doc.text("4. Rehab vs Sale Component", margin, y);
        y += 6;

        doc.autoTable({
            startY: y,
            margin: { left: margin, right: margin },
            head: [["Component", "Area (sq.ft)", "% of Total"]],
            body: [
                ["Rehab Component", formatNumber(r.totalRehabBuiltup), r.rehabPct.toFixed(1) + "%"],
                ["Sale Component", formatNumber(r.saleComponentArea), r.salePct.toFixed(1) + "%"],
                ["Total Buildable Area", formatNumber(r.totalBuildableArea), "100%"]
            ],
            theme: "grid",
            headStyles: { fillColor: [26, 82, 118] },
            styles: { fontSize: 9 }
        });

        y = doc.lastAutoTable.finalY + 10;

        // Section 5: Financial Feasibility
        if (y > 200) { doc.addPage(); y = 20; }
        doc.setFontSize(12);
        doc.setTextColor(26, 82, 118);
        doc.text("5. Financial Feasibility Estimate", margin, y);
        y += 6;

        var financialBody = [
            ["Gross Sale Revenue", formatCurrency(r.grossSaleRevenue)],
            ["Sale Discount (" + (CONFIG.saleDiscount * 100).toFixed(0) + "%)", "-" + formatCurrency(r.grossSaleRevenue - r.saleRevenue)],
            ["Net Sale Revenue", formatCurrency(r.saleRevenue)],
            ["Construction Cost", formatCurrency(r.constructionCost)],
            ["Premium & Statutory Charges (" + (CONFIG.premiumPct * 100).toFixed(0) + "%)", formatCurrency(r.premiumCharges)],
            ["Rent / Alternate Accommodation", formatCurrency(r.rentCost)],
            ["Corpus Fund", formatCurrency(r.corpusCost)],
            ["Professional Fees (Architect/PMC, 2%)", formatCurrency(r.professionalFees)],
            ["Finance Cost (" + (CONFIG.financePct * 100).toFixed(0) + "%)", formatCurrency(r.financeCost)],
            ["Risk Factor (" + (CONFIG.riskPct * 100).toFixed(0) + "%)", formatCurrency(r.riskCost)]
        ];
        if (CONFIG.includeTransit) {
            financialBody.push(["Transit Camp Cost", formatCurrency(r.transitCost)]);
        }
        financialBody.push(["Total Project Cost", formatCurrency(r.totalProjectCost)]);
        financialBody.push(["Estimated Developer Profit", formatCurrency(r.developerProfit)]);
        financialBody.push(["Profit Margin (on Net Revenue)", r.profitMarginPct.toFixed(1) + "% – " + r.feasibilityRating]);

        doc.autoTable({
            startY: y,
            margin: { left: margin, right: margin },
            head: [["Parameter", "Value"]],
            body: financialBody,
            theme: "grid",
            headStyles: { fillColor: [26, 82, 118] },
            styles: { fontSize: 9 }
        });

        y = doc.lastAutoTable.finalY + 10;

        // Section 6: Assumptions Used
        if (y > 210) { doc.addPage(); y = 20; }
        doc.setFontSize(12);
        doc.setTextColor(26, 82, 118);
        doc.text("6. Assumptions Used", margin, y);
        y += 6;

        doc.autoTable({
            startY: y,
            margin: { left: margin, right: margin },
            head: [["Assumption", "Value"]],
            body: [
                ["Fungible FSI", (CONFIG.fungiblePct * 100).toFixed(0) + "% of base FSI"],
                ["TDR Loading", CONFIG.tdrLoading.toFixed(2)],
                ["Rehab Carpet Increase", (CONFIG.rehabIncrease * 100).toFixed(0) + "%"],
                ["Rent Rate", "\u20B9" + CONFIG.rentRate + " / sq.ft / month"],
                ["Project Duration", CONFIG.projectDuration + " months"],
                ["Corpus per Flat", "\u20B9" + formatNumber(CONFIG.corpusPerFlat)],
                ["Premium Charges", (CONFIG.premiumPct * 100).toFixed(0) + "% of construction cost"],
                ["Finance Cost", (CONFIG.financePct * 100).toFixed(0) + "% of net sale revenue"],
                ["Risk Factor", (CONFIG.riskPct * 100).toFixed(0) + "% of net sale revenue"],
                ["Sale Discount", (CONFIG.saleDiscount * 100).toFixed(0) + "% on gross revenue"],
                ["Transit Camp", CONFIG.includeTransit ? "Included @ \u20B9" + CONFIG.transitRate + "/sq.ft" : "Not included"]
            ],
            theme: "grid",
            headStyles: { fillColor: [26, 82, 118] },
            styles: { fontSize: 9 }
        });

        y = doc.lastAutoTable.finalY + 10;

        // Check page overflow
        if (y > 240) {
            doc.addPage();
            y = 20;
        }

        // Section 7: Conclusion
        doc.setFontSize(12);
        doc.setTextColor(26, 82, 118);
        doc.text("7. Feasibility Conclusion", margin, y);
        y += 7;

        var conclusionStr;
        if (r.saleComponentArea <= 0) {
            conclusionStr = "NOT FEASIBLE: The total rehab area exceeds the total buildable area. There is no sale component available. The project is not feasible under current parameters.";
        } else if (r.profitMarginPct > 35) {
            conclusionStr = "HIGHLY ATTRACTIVE (" + r.profitMarginPct.toFixed(1) + "% margin): The project shows excellent developer returns well above the industry benchmark of 20-25%. Sale component: " + formatNumber(r.saleComponentArea) + " sq.ft. Estimated developer profit: " + formatCurrency(r.developerProfit) + ".";
        } else if (r.profitMarginPct >= 20) {
            conclusionStr = "FEASIBLE (" + r.profitMarginPct.toFixed(1) + "% margin): The project shows a healthy profit margin meeting the industry benchmark. Sale component: " + formatNumber(r.saleComponentArea) + " sq.ft. Estimated developer profit: " + formatCurrency(r.developerProfit) + ".";
        } else if (r.profitMarginPct >= 5) {
            conclusionStr = "RISKY / MARGINALLY FEASIBLE (" + r.profitMarginPct.toFixed(1) + "% margin): The profit margin is below the 20% benchmark. Developer profit: " + formatCurrency(r.developerProfit) + ". Further detailed analysis and renegotiation of terms is recommended before proceeding.";
        } else {
            conclusionStr = "NOT FEASIBLE (" + r.profitMarginPct.toFixed(1) + "% margin): The project shows a negative or very low profit margin. Developer profit: " + formatCurrency(r.developerProfit) + ". The project does not appear financially viable under current parameters.";
        }

        doc.setFontSize(10);
        doc.setTextColor(50);
        var splitConclusion = doc.splitTextToSize(conclusionStr, pageWidth - 2 * margin);
        doc.text(splitConclusion, margin, y);
        y += splitConclusion.length * 5 + 10;

        // Disclaimer
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(8);
        doc.setTextColor(140);
        var disclaimer = "DISCLAIMER: This is a preliminary estimate based on DCPR 2034 norms and general assumptions. Actual feasibility may vary based on site-specific conditions, regulatory approvals, premium charges, and market conditions. This report does not constitute professional advice. Please consult a qualified structural consultant for a detailed feasibility study.";
        var splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
        doc.text(splitDisclaimer, margin, y);
        y += splitDisclaimer.length * 4 + 8;

        // Footer
        doc.setDrawColor(200);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text("Generated by Technicss Structural Consultants | technicss.com", pageWidth / 2, y, { align: "center" });

        // Save
        doc.save("PFR_Redevelopment_Feasibility_Report.pdf");
    }
})();
