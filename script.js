// =======================
// State (client-side)
// =======================
const STORAGE_KEY = "webdev2_items_v1";

let state = {
  items: [],          // array of objects { id, text, category, createdAt }
  search: "",
  categoryFilter: "all"
};

// =======================
// DOM refs
// =======================
const itemForm = document.getElementById("itemForm");
const itemText = document.getElementById("itemText");
const itemCategory = document.getElementById("itemCategory");
const formMessage = document.getElementById("formMessage");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const clearAllBtn = document.getElementById("clearAllBtn");

const itemList = document.getElementById("itemList");
const emptyState = document.getElementById("emptyState");
const countText = document.getElementById("countText");

// =======================
// Helpers
// =======================
function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

function setMessage(text, type = "") {
  formMessage.textContent = text;
  formMessage.className = "message";
  if (type) formMessage.classList.add(type);
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) state.items = parsed;
  } catch (e) {
    // If storage corrupted, ignore safely
    state.items = [];
  }
}

// =======================
// Rendering (DOM updates)
// =======================
function getVisibleItems() {
  let items = [...state.items];

  // filter by category
  if (state.categoryFilter !== "all") {
    items = items.filter(it => it.category === state.categoryFilter);
  }

  // filter by search
  const q = state.search.trim().toLowerCase();
  if (q.length > 0) {
    items = items.filter(it => it.text.toLowerCase().includes(q));
  }

  return items;
}

function render() {
  const visible = getVisibleItems();

  // clear list
  itemList.innerHTML = "";

  // count
  countText.textContent = String(visible.length);

  // empty state
  if (visible.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  // create DOM nodes dynamically
  for (const item of visible) {
    const li = document.createElement("li");
    li.className = "listItem";
    li.dataset.id = item.id; // for event delegation

    const top = document.createElement("div");
    top.className = "itemTop";

    const title = document.createElement("div");
    title.textContent = item.text;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = item.category;

    top.appendChild(title);
    top.appendChild(badge);

    const meta = document.createElement("div");
    meta.className = "muted";
    const date = new Date(item.createdAt);
    meta.textContent = `Created: ${date.toLocaleString()}`;

    const actions = document.createElement("div");
    actions.className = "itemActions";

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "Delete";
    delBtn.dataset.action = "delete";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.dataset.action = "edit";

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(top);
    li.appendChild(meta);
    li.appendChild(actions);

    itemList.appendChild(li);
  }
}

// =======================
// Actions (logic)
// =======================
function addItem(text, category) {
  const trimmed = text.trim();

  // validation / edge cases
  if (trimmed.length === 0) {
    setMessage("Title cannot be empty.", "error");
    return;
  }
  if (trimmed.length > 60) {
    setMessage("Title too long (max 60 chars).", "error");
    return;
  }

  const newItem = {
    id: uid(),
    text: trimmed,
    category,
    createdAt: Date.now()
  };

  state.items.unshift(newItem);
  saveToStorage();
  render();

  setMessage("Item added ✅", "success");
}

function deleteItem(id) {
  state.items = state.items.filter(it => it.id !== id);
  saveToStorage();
  render();
}

function editItem(id) {
  const item = state.items.find(it => it.id === id);
  if (!item) return;

  const newText = prompt("Edit title:", item.text);
  if (newText === null) return; // user cancelled

  const trimmed = newText.trim();
  if (trimmed.length === 0) {
    alert("Title cannot be empty.");
    return;
  }

  item.text = trimmed;
  saveToStorage();
  render();
}

function clearAll() {
  const ok = confirm("Clear ALL items? This cannot be undone.");
  if (!ok) return;

  state.items = [];
  saveToStorage();
  render();
}

// =======================
// Event listeners
// =======================

// Form submit
itemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  setMessage("");

  addItem(itemText.value, itemCategory.value);

  // reset only if success-looking: we can just clear anyway
  itemText.value = "";
  itemCategory.value = "general";
  itemText.focus();
});

// Search typing (keyboard event)
searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  render();
});

// Filter change
filterCategory.addEventListener("change", (e) => {
  state.categoryFilter = e.target.value;
  render();
});

// Clear all
clearAllBtn.addEventListener("click", () => {
  clearAll();
});

// Event delegation for list buttons
itemList.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const li = e.target.closest(".listItem");
  if (!li) return;

  const id = li.dataset.id;
  const action = btn.dataset.action;

  if (action === "delete") deleteItem(id);
  if (action === "edit") editItem(id);
});

// =======================
// Init
// =======================
loadFromStorage();
render();
