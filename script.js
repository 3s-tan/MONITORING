// ============================================
// 📝 EDIT THIS SECTION AFTER EVERY SHIFT
// ============================================

const WEEKLY_GOAL = 60; // hours

const weekDays = [
  { day: "Monday",    date: "2026-07-20" },
  //{ day: "Tuesday",   date: "2026-07-21" },
  //{ day: "Wednesday", date: "2026-07-22" },
  //{ day: "Thursday",  date: "2026-07-23" },
  //{ day: "Friday",    date: "2026-07-24" },
  //{ day: "Saturday",  date: "2026-07-25" },

];

const weeklyLog = [
  
  
];

const lastUpdated = "July 21, 2026 - 6:00 PM";

// ============================================
// ⚙️ LOGIC — no need to edit below
// ============================================

function updateTotals() {
  const totalHours = weeklyLog.reduce((sum, e) => sum + Number(e.hours), 0);
  const remaining = Math.max(WEEKLY_GOAL - totalHours, 0);
  const percent = Math.min((totalHours / WEEKLY_GOAL) * 100, 100);

  document.getElementById("totalHours").textContent = totalHours + " hrs";
  document.getElementById("remainingHours").textContent = remaining + " hrs";

  const statusEl = document.getElementById("status");
  if (totalHours >= WEEKLY_GOAL) {
    statusEl.textContent = "✅ Fully Utilized";
    statusEl.style.color = "#34a853";
  } else {
    statusEl.textContent = "⏳ In Progress";
    statusEl.style.color = "#f4b400";
  }

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").textContent =
    percent.toFixed(1) + "% of weekly goal";
}

function renderWeek() {
  const container = document.getElementById("weekContainer");
  container.innerHTML = "";

  weekDays.forEach(({ day, date }) => {
    // Get entries with their original index so we know what to delete
    const entries = weeklyLog
      .map((e, i) => ({ ...e, _index: i }))
      .filter(e => e.date === date);

    const dayTotal = entries.reduce((s, e) => s + Number(e.hours), 0);

    const card = document.createElement("div");
    card.className = "day-card";
    card.innerHTML = `
      <div class="day-header">
        <h3>${day} — ${date}</h3>
        <span class="day-total">${dayTotal} hrs</span>
      </div>
      <div class="entries-list">
        ${entries.length === 0
          ? `<div class="no-entries">No entries yet</div>`
          : entries.map(e => `
            <div class="entry-item">
              <div class="entry-info">
                <strong>${e.board}</strong> — <span class="activity">${e.activity}</span>
                ${e.notes ? `<div class="notes">📝 ${e.notes}</div>` : ""}
              </div>
              <div class="entry-right">
                <span class="entry-hours">${e.hours} hrs</span>
                <button class="delete-btn" data-index="${e._index}" title="Delete entry">🗑️</button>
              </div>
            </div>
          `).join("")
        }
      </div>
      <button class="add-btn" data-date="${date}" data-day="${day}">➕ Add Entry</button>
    `;
    container.appendChild(card);
  });

  // Add button events
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.date, btn.dataset.day));
  });

  // Delete button events
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteEntry(Number(btn.dataset.index)));
  });
}

// --- Delete entry ---
function deleteEntry(index) {
  const entry = weeklyLog[index];
  if (!entry) return;

  const confirmMsg = `Delete this entry?\n\n📅 ${entry.date}\n🔧 ${entry.board} — ${entry.activity}\n⏱️ ${entry.hours} hrs`;
  if (!confirm(confirmMsg)) return;

  // Generate the code line to remove (so user knows what to delete from script.js)
  const lineToRemove = `  { date: "${entry.date}", board: "${entry.board}", activity: "${entry.activity}", hours: ${entry.hours}, notes: "${entry.notes}" },`;

  // Remove from array
  weeklyLog.splice(index, 1);
  updateTotals();
  renderWeek();

  // Show a reminder message
  showDeleteReminder(lineToRemove);
}

// --- Show reminder banner about what to remove from script.js ---
function showDeleteReminder(line) {
  // Remove old reminder if exists
  const oldReminder = document.getElementById("deleteReminder");
  if (oldReminder) oldReminder.remove();

  const reminder = document.createElement("div");
  reminder.id = "deleteReminder";
  reminder.className = "delete-info";
  reminder.innerHTML = `
    <strong>🗑️ Entry removed from preview.</strong><br>
    To make this permanent, delete this line from <code>weeklyLog</code> in <code>script.js</code>:
    <pre>${line}</pre>
    <button class="btn-secondary" onclick="copyDeleteLine(this)" data-line='${line.replace(/'/g, "\\'")}'>📄 Copy Line</button>
    <button class="btn-secondary" onclick="this.parentElement.remove()">✖ Dismiss</button>
  `;

  document.querySelector(".log-section").appendChild(reminder);

  // Auto-scroll to the reminder
  reminder.scrollIntoView({ behavior: "smooth", block: "center" });
}

// --- Copy delete line to clipboard ---
function copyDeleteLine(btn) {
  const line = btn.dataset.line;
  navigator.clipboard.writeText(line).then(() => {
    btn.textContent = "✅ Copied!";
    setTimeout(() => (btn.textContent = "📄 Copy Line"), 2000);
  });
}

// ============================================
// 🎛️ ADD ENTRY MODAL
// ============================================

const modal = document.getElementById("addModal");
const modalTitle = document.getElementById("modalTitle");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const codeOutput = document.getElementById("codeOutput");
const codeSnippet = document.getElementById("codeSnippet");
const copyBtn = document.getElementById("copyBtn");

let currentDate = "";

function openModal(date, day) {
  currentDate = date;
  modalTitle.textContent = `Add Entry — ${day} (${date})`;
  modal.classList.remove("hidden");
  codeOutput.classList.add("hidden");

  document.getElementById("entryBoard").value = "";
  document.getElementById("entryActivity").value = "Program Development";
  document.getElementById("entryHours").value = "";
  document.getElementById("entryNotes").value = "";
}

function closeModal() {
  modal.classList.add("hidden");
}

cancelBtn.addEventListener("click", closeModal);

saveBtn.addEventListener("click", () => {
  const board = document.getElementById("entryBoard").value;
  const activity = document.getElementById("entryActivity").value;
  const hours = document.getElementById("entryHours").value;
  const notes = document.getElementById("entryNotes").value;

  if (!board || !hours) {
    alert("Please fill in Board and Hours.");
    return;
  }

  const newEntry = {
    date: currentDate,
    board,
    activity,
    hours: Number(hours),
    notes
  };

  weeklyLog.push(newEntry);
  updateTotals();
  renderWeek();

  const line = `  { date: "${currentDate}", board: "${board}", activity: "${activity}", hours: ${hours}, notes: "${notes}" },`;
  codeSnippet.textContent = line;
  codeOutput.classList.remove("hidden");
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(codeSnippet.textContent).then(() => {
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => (copyBtn.textContent = "📄 Copy to Clipboard"), 2000);
  });
});

// --- Init ---
updateTotals();
renderWeek();
document.getElementById("lastUpdated").textContent = lastUpdated;