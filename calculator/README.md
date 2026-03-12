# Redevelopment Feasibility Calculator

A web-based tool for calculating Preliminary Feasibility Reports (PFR) for building redevelopment projects in Mumbai, in accordance with DCPR 2034 regulations.

## Features

- **Input Form**: Enter project details including plot area, road width, number of flats, carpet area, built-up area, building age, and market rates
- **Calculation Engine**: Computes FSI (existing, base, fungible, TDR, total permissible), buildable area, rehab and sale components, and financial feasibility
- **Results Dashboard**: Displays FSI tables, area calculations, rehab vs sale breakdown with visual bar, financial estimates, and a feasibility conclusion
- **PDF Report**: Generate and download a professional "Preliminary Feasibility Report (PFR) for Redevelopment" in PDF format
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## DCPR 2034 Calculations

The calculator uses the following norms based on DCPR 2034:

### Base FSI (Suburbs / Extended Suburbs)
| Road Width | Base FSI |
|---|---|
| Below 9 m | 2.0 |
| 9 m – 12 m | 2.5 |
| Above 12 m | 3.0 |

### Base FSI (Island City)
| Road Width | Base FSI |
|---|---|
| Below 9 m | 1.33 |
| 9 m – 12 m | 2.0 |
| Above 12 m | 3.0 |

### Additional Components
- **Fungible FSI**: 35% of Base FSI (for residential)
- **TDR Loading**: 0 (road < 9m), 0.5 (9–12m), 1.0 (> 12m) — suburbs only
- **Rehab Carpet Increase**: 35% over existing carpet area
- **Carpet-to-Built-up Factor**: 1.30x for common areas

## Files

| File | Description |
|---|---|
| `index.html` | Main HTML page with form and results dashboard |
| `style.css` | CSS styling (responsive, professional UI) |
| `script.js` | JavaScript calculation engine and PDF generation |

## Hosting Instructions

This is a static website — no server-side processing is required.

### Option 1: Standard Web Hosting
1. Upload the `calculator/` folder contents (`index.html`, `style.css`, `script.js`) to your web server
2. Place them inside a directory such as `/calculator/` on your hosting
3. Access at `https://yourdomain.com/calculator/`

### Option 2: Embed in Existing Page
You can embed the calculator in an existing page on technicss.com using an iframe:
```html
<iframe src="/calculator/index.html" width="100%" height="800" frameborder="0"></iframe>
```

### Option 3: GitHub Pages
1. Push the files to a GitHub repository
2. Enable GitHub Pages in Settings → Pages → Deploy from branch
3. The calculator will be available at `https://username.github.io/repo-name/calculator/`

### Option 4: Netlify / Vercel
1. Connect your repository to Netlify or Vercel
2. Set the publish directory to the repository root or `calculator/`
3. Deploy — the calculator will be live at your custom domain

### Dependencies
The calculator loads these libraries from CDN (no local installation required):
- [jsPDF](https://github.com/parallax/jsPDF) — PDF generation
- [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) — PDF table formatting

## Disclaimer

This tool provides preliminary estimates based on DCPR 2034 norms and general assumptions. Actual feasibility may vary based on site-specific conditions, regulatory approvals, premium charges, and market conditions. Consult a qualified structural consultant for a detailed feasibility study.
