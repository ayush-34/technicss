(() => {
  const storageKey = "snagging.projects.v1";
  const maxImageSize = 2 * 1024 * 1024;
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
        ? parsed.map((project) => ({
            ...project,
            snags: Array.isArray(project.snags) ? project.snags : [],
          }))
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

  const createId = (prefix) =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString();

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
      card.innerHTML = `
        <div>
          <h3>${project.name}</h3>
          <p class="muted">${project.location} • ${project.client}</p>
          <p class="muted">Date: ${project.date}</p>
        </div>
        <div class="project-actions">
          <button class="btn primary" data-action="open" data-id="${project.id}">Open</button>
          <button class="btn ghost" data-action="delete" data-id="${project.id}">Delete</button>
        </div>
      `;
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
      card.innerHTML = `
        <div class="snag-thumb">
          ${snag.imageData ? `<img src="${snag.imageData}" alt="${snag.title}" />` : "No image"}
        </div>
        <div>
          <span class="badge ${statusClass(snag.status)}">${snag.status}</span>
          <h3>${snag.title}</h3>
          <p class="muted">Priority: ${snag.priority}</p>
        </div>
      `;
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
      id: createId("project"),
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
    if (state.currentImage) {
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
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
      alert(
        `Image is too large (${sizeInMb}MB). Please choose a file under 2MB.`
      );
      elements.snagImage.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.currentImage = reader.result;
      updatePreview();
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
        id: createId("snag"),
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

  const handlePrintReport = () => {
    setView("project");
    window.print();
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
