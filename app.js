(() => {
  const storageKey = "snagging.projects.v1";
  const bytesPerMB = 1024 * 1024;
  const maxImageSize = 2 * bytesPerMB;
  const state = {
    projects: [],
    activeProjectId: null,
    activeSnagId: null,
    currentImage: "",
    filters: {
      status: "",
      priority: "",
      search: "",
    },
  };

  const elements = {
    views: {
      projects: document.getElementById("projects-view"),
      project: document.getElementById("project-view"),
      snag: document.getElementById("snag-view"),
    },
    backButton: document.getElementById("back-button"),
    headerSubtitle: document.getElementById("header-subtitle"),
    projectForm: document.getElementById("project-form"),
    projectsList: document.getElementById("projects-list"),
    projectsEmpty: document.getElementById("projects-empty"),
    projectTitle: document.getElementById("project-title"),
    projectMeta: document.getElementById("project-meta"),
    statTotal: document.getElementById("stat-total"),
    statOpen: document.getElementById("stat-open"),
    statClosed: document.getElementById("stat-closed"),
    filterStatus: document.getElementById("filter-status"),
    filterPriority: document.getElementById("filter-priority"),
    searchInput: document.getElementById("search-input"),
    snagList: document.getElementById("snag-list"),
    snagsEmpty: document.getElementById("snags-empty"),
    addSnagButton: document.getElementById("add-snag-btn"),
    exportJsonButton: document.getElementById("export-json-btn"),
    printReportButton: document.getElementById("print-report-btn"),
    snagFormTitle: document.getElementById("snag-form-title"),
    snagDate: document.getElementById("snag-date"),
    snagId: document.getElementById("snag-id"),
    snagForm: document.getElementById("snag-form"),
    snagImage: document.getElementById("snag-image"),
    snagPreview: document.getElementById("snag-preview"),
    snagPreviewLabel: document.getElementById("snag-preview-label"),
    snagSaveButton: document.getElementById("snag-save-btn"),
    snagCancelButton: document.getElementById("snag-cancel-btn"),
    snagDeleteButton: document.getElementById("snag-delete-btn"),
  };

  const loadData = () => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      state.projects = [];
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      state.projects = Array.isArray(parsed)
        ? parsed.map(sanitizeProject).filter(Boolean)
        : [];
    } catch {
      state.projects = [];
    }
  };

  const saveData = () => {
    localStorage.setItem(storageKey, JSON.stringify(state.projects));
  };

  const setView = (view) => {
    Object.values(elements.views).forEach((section) => {
      section.classList.remove("active");
    });
    elements.views[view].classList.add("active");
    elements.backButton.classList.toggle("hidden", view === "projects");
    elements.addSnagButton.classList.toggle("hidden", view !== "project");
    elements.headerSubtitle.textContent = getHeaderSubtitle(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getHeaderSubtitle = (view) => {
    if (view === "projects") {
      return "Manage projects and snags in one place.";
    }
    if (view === "project") {
      const project = getActiveProject();
      return project ? `Project: ${project.name}` : "Project overview";
    }
    return "Review and update snag details.";
  };

  const getActiveProject = () =>
    state.projects.find((project) => project.id === state.activeProjectId);

  const getActiveSnag = () => {
    const project = getActiveProject();
    if (!project) return null;
    return project.snags.find((snag) => snag.id === state.activeSnagId);
  };

  const createId = (prefix) => {
    if (globalThis.crypto?.randomUUID) {
      return `${prefix}-${globalThis.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  };

  const createUniqueId = (prefix, existingIds) => {
    let candidate = createId(prefix);
    while (existingIds.has(candidate)) {
      candidate = createId(prefix);
    }
    return candidate;
  };

  const sanitizeSnag = (snag) => {
    if (!snag || typeof snag !== "object") return null;
    if (typeof snag.id !== "string" || typeof snag.title !== "string") return null;
    const priority = ["Low", "Medium", "High"].includes(snag.priority)
      ? snag.priority
      : "Low";
    const status = ["Open", "In Progress", "Closed"].includes(snag.status)
      ? snag.status
      : "Open";
    return {
      id: snag.id,
      title: snag.title,
      description: typeof snag.description === "string" ? snag.description : "",
      category: typeof snag.category === "string" ? snag.category : "Other",
      location: typeof snag.location === "string" ? snag.location : "",
      priority,
      status,
      date: typeof snag.date === "string" ? snag.date : new Date().toISOString(),
      imageData: typeof snag.imageData === "string" ? snag.imageData : "",
    };
  };

  const sanitizeProject = (project) => {
    if (!project || typeof project !== "object") return null;
    if (typeof project.id !== "string" || typeof project.name !== "string") return null;
    return {
      id: project.id,
      name: project.name,
      location: typeof project.location === "string" ? project.location : "",
      client: typeof project.client === "string" ? project.client : "",
      date: typeof project.date === "string" ? project.date : "",
      snags: Array.isArray(project.snags)
        ? project.snags.map(sanitizeSnag).filter(Boolean)
        : [],
    };
  };

  const isSafeImageData = (value) =>
    typeof value === "string" && value.startsWith("data:image/");

  const getSafeImageData = (value) => {
    if (!isSafeImageData(value)) return "";
    const trimmed = value.trim();
    const dataUriPattern =
      /^data:image\/[a-zA-Z0-9.+-]+;base64,[a-zA-Z0-9+/=]+$/;
    return dataUriPattern.test(trimmed) ? encodeURI(trimmed) : "";
  };

  const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString();

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const resetProjectForm = () => {
    elements.projectForm.reset();
  };

  const renderProjects = () => {
    elements.projectsList.innerHTML = "";
    if (state.projects.length === 0) {
      elements.projectsEmpty.classList.remove("hidden");
      return;
    }
    elements.projectsEmpty.classList.add("hidden");
    state.projects.forEach((project) => {
      const card = document.createElement("div");
      card.className = "card project-card";

      const info = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = project.name;
      const meta = document.createElement("p");
      meta.className = "muted";
      meta.textContent = `${project.location} • ${project.client}`;
      const date = document.createElement("p");
      date.className = "muted";
      date.textContent = `Date: ${project.date}`;
      info.append(title, meta, date);

      const actions = document.createElement("div");
      actions.className = "project-actions";
      const openButton = document.createElement("button");
      openButton.className = "btn primary";
      openButton.type = "button";
      openButton.dataset.action = "open";
      openButton.dataset.id = project.id;
      openButton.textContent = "Open";
      const deleteButton = document.createElement("button");
      deleteButton.className = "btn ghost";
      deleteButton.type = "button";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.id = project.id;
      deleteButton.textContent = "Delete";
      actions.append(openButton, deleteButton);

      card.append(info, actions);
      elements.projectsList.appendChild(card);
    });
  };

  const renderProjectHeader = (project) => {
    elements.projectTitle.textContent = project.name;
    elements.projectMeta.textContent = `${project.location} • ${project.client} • ${project.date}`;
  };

  const renderDashboard = (snags) => {
    const total = snags.length;
    const closed = snags.filter((snag) => snag.status === "Closed").length;
    const openSnags = total - closed;
    elements.statTotal.textContent = total;
    elements.statOpen.textContent = openSnags;
    elements.statClosed.textContent = closed;
  };

  const applyFilters = (snags) => {
    return snags.filter((snag) => {
      if (state.filters.status && snag.status !== state.filters.status) {
        return false;
      }
      if (state.filters.priority && snag.priority !== state.filters.priority) {
        return false;
      }
      if (
        state.filters.search &&
        !snag.title.toLowerCase().includes(state.filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  };

  const renderSnagList = (snags) => {
    elements.snagList.innerHTML = "";
    if (snags.length === 0) {
      elements.snagsEmpty.classList.remove("hidden");
      return;
    }
    elements.snagsEmpty.classList.add("hidden");
    snags.forEach((snag) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card snag-card";
      card.dataset.id = snag.id;

      const thumb = document.createElement("div");
      thumb.className = "snag-thumb";
      if (isSafeImageData(snag.imageData)) {
        const image = document.createElement("img");
        image.src = snag.imageData;
        image.alt = snag.title;
        thumb.appendChild(image);
      } else {
        thumb.textContent = "No image";
      }

      const details = document.createElement("div");
      const badge = document.createElement("span");
      badge.className = `badge ${statusClass(snag.status)}`;
      badge.textContent = snag.status;
      const title = document.createElement("h3");
      title.textContent = snag.title;
      const priority = document.createElement("p");
      priority.className = "muted";
      priority.textContent = `Priority: ${snag.priority}`;
      details.append(badge, title, priority);

      card.append(thumb, details);
      elements.snagList.appendChild(card);
    });
  };

  const statusClass = (status) => status.toLowerCase().replace(/\s+/g, "-");

  const renderProjectView = () => {
    const project = getActiveProject();
    if (!project) return;
    renderProjectHeader(project);
    renderDashboard(project.snags);
    const filtered = applyFilters(project.snags);
    renderSnagList(filtered);
  };

  const openProject = (projectId) => {
    state.activeProjectId = projectId;
    state.activeSnagId = null;
    state.filters = { status: "", priority: "", search: "" };
    elements.filterStatus.value = "";
    elements.filterPriority.value = "";
    elements.searchInput.value = "";
    setView("project");
    renderProjectView();
  };

  const openProjectsList = () => {
    state.activeProjectId = null;
    state.activeSnagId = null;
    setView("projects");
  };

  const clearSnagForm = () => {
    elements.snagForm.reset();
    elements.snagImage.value = "";
    elements.snagId.textContent = "";
    elements.snagDate.textContent = "";
    state.currentImage = "";
    updatePreview();
    elements.snagDeleteButton.classList.add("hidden");
  };

  const populateSnagForm = (snag) => {
    elements.snagImage.value = "";
    elements.snagForm.title.value = snag.title;
    elements.snagForm.description.value = snag.description;
    elements.snagForm.category.value = snag.category;
    elements.snagForm.location.value = snag.location;
    elements.snagForm.priority.value = snag.priority;
    elements.snagForm.status.value = snag.status;
    elements.snagId.textContent = `ID: ${snag.id}`;
    elements.snagDate.textContent = `Created: ${formatDate(snag.date)}`;
    state.currentImage = snag.imageData || "";
    updatePreview();
    elements.snagDeleteButton.classList.remove("hidden");
  };

  const openSnagForm = (snagId = null) => {
    state.activeSnagId = snagId;
    if (snagId) {
      const snag = getActiveSnag();
      if (snag) {
        elements.snagFormTitle.textContent = "Snag Details";
        populateSnagForm(snag);
      }
    } else {
      elements.snagFormTitle.textContent = "Add Snag";
      clearSnagForm();
    }
    setView("snag");
  };

  const handleProjectSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const project = {
      id: createUniqueId(
        "project",
        new Set(state.projects.map((entry) => entry.id))
      ),
      name: form.name.value.trim(),
      location: form.location.value.trim(),
      client: form.client.value.trim(),
      date: form.date.value,
      snags: [],
    };
    state.projects.unshift(project);
    saveData();
    renderProjects();
    resetProjectForm();
  };

  const handleProjectListClick = (event) => {
    const action = event.target.dataset.action;
    const projectId = event.target.dataset.id;
    if (!action || !projectId) return;
    if (action === "open") {
      openProject(projectId);
      return;
    }
    if (action === "delete") {
      if (!confirm("Delete this project and all its snags?")) return;
      state.projects = state.projects.filter((project) => project.id !== projectId);
      saveData();
      renderProjects();
    }
  };

  const handleFiltersChange = () => {
    state.filters.status = elements.filterStatus.value;
    state.filters.priority = elements.filterPriority.value;
    state.filters.search = elements.searchInput.value.trim();
    renderProjectView();
  };

  const updatePreview = () => {
    if (isSafeImageData(state.currentImage)) {
      elements.snagPreview.src = state.currentImage;
      elements.snagPreviewLabel.textContent = "Attached image preview.";
    } else {
      elements.snagPreview.removeAttribute("src");
      elements.snagPreviewLabel.textContent = "No image selected.";
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > maxImageSize) {
      const sizeInMB = (file.size / bytesPerMB).toFixed(2);
      alert(
        `Image is too large (${sizeInMB}MB). Please choose a file under 2MB.`
      );
      elements.snagImage.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.currentImage = reader.result;
      updatePreview();
    };
    reader.onerror = () => {
      alert("Unable to load image. Please try a different file.");
      elements.snagImage.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleSnagSubmit = (event) => {
    event.preventDefault();
    const project = getActiveProject();
    if (!project) return;
    const form = event.target;
    const snagPayload = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      category: form.category.value,
      location: form.location.value.trim(),
      priority: form.priority.value,
      status: form.status.value,
      imageData: state.currentImage,
    };

    if (state.activeSnagId) {
      const existing = project.snags.find((snag) => snag.id === state.activeSnagId);
      if (existing) {
        Object.assign(existing, snagPayload);
      }
    } else {
      project.snags.unshift({
        id: createUniqueId("snag", new Set(project.snags.map((snag) => snag.id))),
        date: new Date().toISOString(),
        ...snagPayload,
      });
    }
    saveData();
    renderProjectView();
    state.activeSnagId = null;
    clearSnagForm();
    setView("project");
  };

  const handleSnagDelete = () => {
    const project = getActiveProject();
    if (!project || !state.activeSnagId) return;
    if (!confirm("Delete this snag?")) return;
    project.snags = project.snags.filter((snag) => snag.id !== state.activeSnagId);
    saveData();
    state.activeSnagId = null;
    clearSnagForm();
    renderProjectView();
    setView("project");
  };

  const handleSnagListClick = (event) => {
    const card = event.target.closest(".snag-card");
    if (!card) return;
    openSnagForm(card.dataset.id);
  };

  const handleExportJson = () => {
    const project = getActiveProject();
    if (!project) return;
    const data = {
      project: {
        name: project.name,
        location: project.location,
        client: project.client,
        date: project.date,
      },
      snags: project.snags,
    };
    const safeName =
      project.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || "project";
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName}-snags.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const generatePrintReport = () => {
    const project = getActiveProject();
    if (!project) return;

    const snags = project.snags;
    const total = snags.length;
    const open = snags.filter((snag) => snag.status === "Open").length;
    const inProgress = snags.filter((snag) => snag.status === "In Progress").length;
    const closed = snags.filter((snag) => snag.status === "Closed").length;

    const inspectionDate = project.date
      ? formatDate(project.date)
      : formatDate(new Date().toISOString());

    const rowsHtml =
      snags.length === 0
        ? `<tr><td class="empty-row" colspan="5">No snags recorded.</td></tr>`
        : snags
            .map((snag, index) => {
              const status = statusClass(snag.status);
              const details = [
                `<div><span class="label">Location:</span> ${escapeHtml(
                  snag.location
                )}</div>`,
                `<div><span class="label">Priority:</span> ${escapeHtml(
                  snag.priority
                )}</div>`,
                `<div><span class="label">Status:</span> ${escapeHtml(
                  snag.status
                )}</div>`,
              ];
              if (snag.assignedTo) {
                details.push(
                  `<div><span class="label">Assigned To:</span> ${escapeHtml(
                    snag.assignedTo
                  )}</div>`
                );
              }

              const safeImageData = getSafeImageData(snag.imageData);
              const imageCell = safeImageData
                ? `<img src="${safeImageData}" alt="${escapeHtml(
                    snag.title
                  )}" />`
                : `<span class="placeholder">No image</span>`;

              return `
                <tr>
                  <td class="id-cell status-${status}">${index + 1}</td>
                  <td>${escapeHtml(formatDate(snag.date))}</td>
                  <td>
                    <div class="title">${escapeHtml(snag.title)}</div>
                    <div class="description">${escapeHtml(
                      snag.description || "—"
                    )}</div>
                  </td>
                  <td class="details">
                    ${details.join("")}
                  </td>
                  <td class="image-cell">
                    ${imageCell}
                  </td>
                </tr>
              `;
            })
            .join("");

    const reportHtml = `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Snag List Report</title>
          <style>
            :root {
              --text: #1f1f1f;
              --muted: #6b6b6b;
              --border: #d9d9d9;
              --header-bg: #f4f4f4;
              --row-alt: #fafafa;
              --open: #d64541;
              --progress: #f39c12;
              --closed: #27ae60;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
              color: var(--text);
              background: #fff;
            }

            .report {
              padding: 24px;
            }

            .report-header {
              display: flex;
              justify-content: space-between;
              gap: 24px;
              padding-bottom: 16px;
              border-bottom: 1px solid var(--border);
            }

            .company {
              font-size: 0.9rem;
              letter-spacing: 0.08em;
              font-weight: 700;
              color: var(--muted);
              text-transform: uppercase;
            }

            .report-title {
              margin: 6px 0 0;
              font-size: 1.7rem;
              font-weight: 700;
            }

            .report-meta {
              display: grid;
              gap: 6px;
              font-size: 0.92rem;
              color: var(--muted);
              min-width: 220px;
            }

            .report-meta span {
              color: var(--text);
              font-weight: 600;
            }

            .summary {
              margin: 20px 0 24px;
              display: grid;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: 12px;
            }

            .summary-card {
              border: 1px solid var(--border);
              padding: 12px 14px;
              border-radius: 10px;
              background: #fff;
              position: relative;
            }

            .summary-card::before {
              content: "";
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 4px;
              border-radius: 10px 0 0 10px;
              background: var(--border);
            }

            .summary-card.open::before {
              background: var(--open);
            }

            .summary-card.progress::before {
              background: var(--progress);
            }

            .summary-card.closed::before {
              background: var(--closed);
            }

            .summary-card h3 {
              margin: 6px 0 0;
              font-size: 1.4rem;
            }

            .summary-card p {
              margin: 0;
              font-size: 0.8rem;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: var(--muted);
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 0.9rem;
            }

            thead th {
              text-align: left;
              padding: 10px;
              background: var(--header-bg);
              border: 1px solid var(--border);
              font-weight: 700;
            }

            tbody td {
              padding: 10px;
              border: 1px solid var(--border);
              vertical-align: top;
            }

            tbody tr:nth-child(even) {
              background: var(--row-alt);
            }

            .id-cell {
              text-align: center;
              font-weight: 700;
              color: #fff;
              width: 50px;
            }

            .id-cell.status-open {
              background: var(--open);
            }

            .id-cell.status-in-progress {
              background: var(--progress);
            }

            .id-cell.status-closed {
              background: var(--closed);
            }

            .title {
              font-weight: 700;
              margin-bottom: 4px;
            }

            .description {
              color: var(--muted);
              line-height: 1.4;
            }

            .details {
              line-height: 1.5;
              color: var(--text);
            }

            .details .label {
              color: var(--muted);
              font-weight: 600;
              margin-right: 4px;
            }

            .image-cell {
              text-align: center;
              width: 140px;
            }

            .image-cell img {
              width: 120px;
              height: 90px;
              object-fit: contain;
              border: 1px solid var(--border);
              background: #fff;
            }

            .placeholder {
              display: inline-block;
              font-size: 0.8rem;
              color: var(--muted);
              padding: 24px 8px;
              border: 1px dashed var(--border);
              width: 120px;
            }

            .empty-row {
              text-align: center;
              color: var(--muted);
              padding: 20px;
            }

            @page {
              size: A4;
              margin: 16mm;
            }

            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }

              thead {
                display: table-header-group;
              }

              tr {
                break-inside: avoid;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="report">
            <header class="report-header">
              <div>
                <div class="company">Technicss Structural Consultants</div>
                <div class="report-title">Snag List Report</div>
              </div>
              <div class="report-meta">
                <div><span>Project:</span> ${escapeHtml(project.name)}</div>
                <div><span>Inspection Date:</span> ${escapeHtml(
                  inspectionDate
                )}</div>
                <div><span>Prepared By:</span> SnagTrack</div>
              </div>
            </header>

            <section class="summary">
              <div class="summary-card">
                <p>Total Snags</p>
                <h3>${total}</h3>
              </div>
              <div class="summary-card open">
                <p>Open</p>
                <h3>${open}</h3>
              </div>
              <div class="summary-card progress">
                <p>In Progress</p>
                <h3>${inProgress}</h3>
              </div>
              <div class="summary-card closed">
                <p>Closed</p>
                <h3>${closed}</h3>
              </div>
            </section>

            <section>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Details</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </section>
          </div>
        </body>
      </html>`;

    const printWindow = window.open("", "_blank", "width=1200,height=800");
    if (!printWindow) {
      alert(
        "Unable to open the print window. Please enable pop-ups for this site in your browser settings."
      );
      return;
    }
    printWindow.opener = null;
    const handlePrintLoad = () => {
      printWindow.focus();
      printWindow.print();
    };
    printWindow.addEventListener("load", handlePrintLoad, { once: true });
    printWindow.document.open();
    printWindow.document.write(reportHtml);
    printWindow.document.close();
  };

  const handlePrintReport = () => {
    setView("project");
    generatePrintReport();
  };

  const returnToProject = () => {
    state.activeSnagId = null;
    clearSnagForm();
    setView("project");
  };

  const init = () => {
    loadData();
    renderProjects();
    setView("projects");

    elements.projectForm.addEventListener("submit", handleProjectSubmit);
    elements.projectsList.addEventListener("click", handleProjectListClick);
    elements.backButton.addEventListener("click", () => {
      if (elements.views.snag.classList.contains("active")) {
        returnToProject();
        return;
      }
      openProjectsList();
    });
    elements.filterStatus.addEventListener("change", handleFiltersChange);
    elements.filterPriority.addEventListener("change", handleFiltersChange);
    elements.searchInput.addEventListener("input", handleFiltersChange);
    elements.snagList.addEventListener("click", handleSnagListClick);
    elements.addSnagButton.addEventListener("click", () => openSnagForm());
    elements.snagCancelButton.addEventListener("click", returnToProject);
    elements.snagForm.addEventListener("submit", handleSnagSubmit);
    elements.snagImage.addEventListener("change", handleImageChange);
    elements.snagDeleteButton.addEventListener("click", handleSnagDelete);
    elements.exportJsonButton.addEventListener("click", handleExportJson);
    elements.printReportButton.addEventListener("click", handlePrintReport);
  };

  init();
})();
