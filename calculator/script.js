/* ========================================
   Redevelopment Feasibility Calculator
   JavaScript Calculation Engine
   Technicss Structural Consultants
   ======================================== */

(function () {
    "use strict";

    // ---- Constants ----
    var SQM_TO_SQFT = 10.7639;
    var FUNGIBLE_RESIDENTIAL_PCT = 0.35;
    var REHAB_CARPET_INCREASE_PCT = 0.35; // 35% carpet area increase for rehab
    var CARPET_TO_BUILTUP_FACTOR = 1.30; // loading factor for common areas
    var PREMIUM_CHARGES_PCT = 0.10; // 10% of construction cost as premium/charges
    var RENT_RATE = 80;
    var CORPUS_PER_FLAT = 2000000;
    var PROJECT_DURATION = 36;

    // ---- Zone Label Helper ----
    function getZoneLabel(zone) {
        var labels = {
            "33_1": "Normal Housing Society (33(1))",
            "33_5": "MHADA Layout (33(5))",
            "33_7": "Cessed Building (33(7))",
            "33_9": "Cluster Redevelopment (33(9))",
            "suburbs": "Suburbs / Extended Suburbs",
            "island-city": "Island City"
        };
        return labels[zone] || zone;
    }

    // ---- FSI Rules per DCPR 2034 ----
    function getBaseFSI(roadWidth, zone) {
        // Scheme-specific FSI overrides
        if (zone === "33_5") return 3.5;
        if (zone === "33_7") return 4.0;
        if (zone === "33_9") return 4.5;
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
        if (roadWidth < 12) return 0.5;
        return 1.0;
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
        var constructionCost = parseFloat(document.getElementById("construction-cost").value) || 4000;

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
            constructionCost: constructionCost
        };

        // FSI Calculations
        var existingFSI = existingBuiltup / plotAreaSqFt;
        var baseFSI = getBaseFSI(roadWidth, zone);
        var fungibleFSI = baseFSI * FUNGIBLE_RESIDENTIAL_PCT;
        var tdr = getTDR(roadWidth, zone);
        var totalPermissibleFSI = baseFSI + fungibleFSI + tdr;

        // Area Calculations
        var totalBuildableArea = totalPermissibleFSI * plotAreaSqFt;
        var existingTotalCarpet = numFlats * carpetAreaPerFlat;
        var rehabCarpetPerFlat = carpetAreaPerFlat * (1 + REHAB_CARPET_INCREASE_PCT);
        var totalRehabCarpet = numFlats * rehabCarpetPerFlat;
        var totalRehabBuiltup = totalRehabCarpet * CARPET_TO_BUILTUP_FACTOR;
        var saleComponentArea = totalBuildableArea - totalRehabBuiltup;
        if (saleComponentArea < 0) saleComponentArea = 0;

        // Financial Calculations
        var saleRevenue = saleComponentArea * marketRate;
        var totalConstructionCost = totalBuildableArea * constructionCost;
        var premiumCharges = totalConstructionCost * PREMIUM_CHARGES_PCT;
        var rentCost = totalRehabCarpet * RENT_RATE * PROJECT_DURATION;
        var corpusCost = numFlats * CORPUS_PER_FLAT;
        var professionalFees = saleRevenue * 0.02;
        var financeCost = saleRevenue * 0.08;
        var totalProjectCost = totalConstructionCost + premiumCharges + rentCost + corpusCost + professionalFees + financeCost;
        var developerProfit = saleRevenue - totalProjectCost;
        // Margin on sale revenue — standard developer benchmark (20%+ revenue margin = feasible)
        var profitMarginPct = saleRevenue > 0 ? (developerProfit / saleRevenue) * 100 : 0;
        // Rehab vs Sale percentages
        var rehabPct = totalBuildableArea > 0 ? (totalRehabBuiltup / totalBuildableArea) * 100 : 0;
        var salePct = totalBuildableArea > 0 ? (saleComponentArea / totalBuildableArea) * 100 : 0;
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
            saleRevenue: saleRevenue,
            totalConstructionCost: totalConstructionCost,
            premiumCharges: premiumCharges,
            rentCost: rentCost,
            corpusCost: corpusCost,
            professionalFees: professionalFees,
            financeCost: financeCost,
            totalProjectCost: totalProjectCost,
            developerProfit: developerProfit,
            profitMarginPct: profitMarginPct,
            rehabPct: rehabPct,
            salePct: salePct
        };

        return lastResults;
    }

    // ---- Render Results ----
    function renderResults(r) {
        // FSI Table
        var fsiBody = document.querySelector("#fsi-table tbody");
        fsiBody.innerHTML = [
            row("Existing FSI", r.existingFSI.toFixed(2)),
            row("Base Permissible FSI", r.baseFSI.toFixed(2)),
            row("Fungible FSI (35% Residential)", r.fungibleFSI.toFixed(2)),
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
            row("Rehab Carpet per Flat (+" + (REHAB_CARPET_INCREASE_PCT * 100) + "%)", formatNumber(r.rehabCarpetPerFlat) + " sq.ft"),
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
        finBody.innerHTML = [
            row("Sale Revenue (" + formatNumber(r.saleComponentArea) + " sq.ft × ₹" + formatNumber(lastInputs.marketRate) + ")", formatCurrency(r.saleRevenue)),
            row("Construction Cost (" + formatNumber(r.totalBuildableArea) + " sq.ft × ₹" + formatNumber(lastInputs.constructionCost) + ")", formatCurrency(r.totalConstructionCost)),
            row("Premium & Statutory Charges (10%)", formatCurrency(r.premiumCharges)),
            row("Rent / Alternate Accommodation (" + lastInputs.numFlats + " flats × " + PROJECT_DURATION + " months)", formatCurrency(r.rentCost)),
            row("Corpus Fund (₹20L × " + lastInputs.numFlats + " flats)", formatCurrency(r.corpusCost)),
            row("Professional Fees (Architect/PMC, 2%)", formatCurrency(r.professionalFees)),
            row("Finance Cost (8%)", formatCurrency(r.financeCost)),
            row("Total Project Cost", formatCurrency(r.totalProjectCost)),
            rowHighlight("Estimated Developer Profit", formatCurrency(r.developerProfit)),
            row("Profit Margin", r.profitMarginPct.toFixed(1) + "%")
        ].join("");

        // Conclusion
        var conclusionBox = document.getElementById("conclusion-box");
        var conclusionText = document.getElementById("conclusion-text");

        conclusionBox.className = "conclusion-box";

        if (r.saleComponentArea <= 0) {
            conclusionBox.classList.add("not-feasible");
            conclusionText.innerHTML = "<strong>Not Feasible:</strong> The total rehab area exceeds the total buildable area. There is no sale component available for the developer. The project is not feasible under current parameters.";
        } else if (r.profitMarginPct >= 20) {
            conclusionBox.classList.add("feasible");
            conclusionText.innerHTML = "<strong>Feasible:</strong> The project shows a healthy profit margin of <strong>" + r.profitMarginPct.toFixed(1) + "%</strong>. With a sale component of <strong>" + formatNumber(r.saleComponentArea) + " sq.ft</strong> and estimated developer profit of <strong>" + formatCurrency(r.developerProfit) + "</strong>, this redevelopment appears financially viable.";
        } else if (r.profitMarginPct >= 5) {
            conclusionBox.classList.add("marginal");
            conclusionText.innerHTML = "<strong>Marginally Feasible:</strong> The project shows a thin profit margin of <strong>" + r.profitMarginPct.toFixed(1) + "%</strong>. While there is a sale component of <strong>" + formatNumber(r.saleComponentArea) + " sq.ft</strong>, the developer profit of <strong>" + formatCurrency(r.developerProfit) + "</strong> may not be sufficient to cover risks and contingencies. Further detailed analysis is recommended.";
        } else {
            conclusionBox.classList.add("not-feasible");
            conclusionText.innerHTML = "<strong>Not Feasible:</strong> The project shows a negative or very low profit margin of <strong>" + r.profitMarginPct.toFixed(1) + "%</strong>. The estimated developer profit is <strong>" + formatCurrency(r.developerProfit) + "</strong>. The project does not appear financially viable under current parameters.";
        }
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
                ["Fungible FSI (35% Residential)", r.fungibleFSI.toFixed(2)],
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
                ["Rehab Carpet per Flat (+35%)", formatNumber(r.rehabCarpetPerFlat) + " sq.ft"],
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
        doc.setFontSize(12);
        doc.setTextColor(26, 82, 118);
        doc.text("5. Financial Feasibility Estimate", margin, y);
        y += 6;

        doc.autoTable({
            startY: y,
            margin: { left: margin, right: margin },
            head: [["Parameter", "Value"]],
            body: [
                ["Sale Revenue", formatCurrency(r.saleRevenue)],
                ["Construction Cost", formatCurrency(r.totalConstructionCost)],
                ["Premium & Statutory Charges (10%)", formatCurrency(r.premiumCharges)],
                ["Rent / Alternate Accommodation", formatCurrency(r.rentCost)],
                ["Corpus Fund", formatCurrency(r.corpusCost)],
                ["Professional Fees (Architect/PMC, 2%)", formatCurrency(r.professionalFees)],
                ["Finance Cost (8%)", formatCurrency(r.financeCost)],
                ["Total Project Cost", formatCurrency(r.totalProjectCost)],
                ["Estimated Developer Profit", formatCurrency(r.developerProfit)],
                ["Profit Margin", r.profitMarginPct.toFixed(1) + "%"]
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

        // Section 6: Conclusion
        doc.setFontSize(12);
        doc.setTextColor(26, 82, 118);
        doc.text("6. Feasibility Conclusion", margin, y);
        y += 7;

        var conclusionStr;
        if (r.saleComponentArea <= 0) {
            conclusionStr = "NOT FEASIBLE: The total rehab area exceeds the total buildable area. There is no sale component available. The project is not feasible under current parameters.";
        } else if (r.profitMarginPct >= 20) {
            conclusionStr = "FEASIBLE: The project shows a healthy profit margin of " + r.profitMarginPct.toFixed(1) + "%. With a sale component of " + formatNumber(r.saleComponentArea) + " sq.ft and estimated developer profit of " + formatCurrency(r.developerProfit) + ", this redevelopment appears financially viable.";
        } else if (r.profitMarginPct >= 5) {
            conclusionStr = "MARGINALLY FEASIBLE: The project shows a thin profit margin of " + r.profitMarginPct.toFixed(1) + "%. Further detailed analysis is recommended before proceeding.";
        } else {
            conclusionStr = "NOT FEASIBLE: The project shows a negative or very low profit margin of " + r.profitMarginPct.toFixed(1) + "%. The project does not appear financially viable under current parameters.";
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
