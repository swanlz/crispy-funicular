const STORAGE_KEY = "idesam-expenses";

const form = document.getElementById("expense-form");
const tbody = document.getElementById("expense-tbody");
const statusFilter = document.getElementById("status-filter");
const actorRole = document.getElementById("actor-role");
const seedDemoBtn = document.getElementById("seed-demo");
const rowTemplate = document.getElementById("row-template");

function readExpenses() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeExpenses(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function brl(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function mapStatusLabel(status) {
  return {
    PENDENTE: "Pendente",
    APROVADO_GESTOR: "Aprovado pelo Gestor",
    APROVADO_FINANCEIRO: "Aprovado pelo Financeiro",
    REJEITADO: "Rejeitado",
  }[status] ?? status;
}

function canApprove(expense, role) {
  return (role === "GESTOR" && expense.status === "PENDENTE") ||
    (role === "FINANCEIRO" && expense.status === "APROVADO_GESTOR");
}

function approveExpense(id, role) {
  const items = readExpenses().map((item) => {
    if (item.id !== id) return item;
    if (role === "GESTOR" && item.status === "PENDENTE") {
      return {
        ...item,
        status: "APROVADO_GESTOR",
        history: [...item.history, `${new Date().toISOString()} - Gestor aprovou`],
      };
    }
    if (role === "FINANCEIRO" && item.status === "APROVADO_GESTOR") {
      return {
        ...item,
        status: "APROVADO_FINANCEIRO",
        history: [...item.history, `${new Date().toISOString()} - Financeiro aprovou`],
      };
    }
    return item;
  });

  writeExpenses(items);
  render();
}

function rejectExpense(id, role) {
  const items = readExpenses().map((item) => {
    if (item.id !== id) return item;
    if (item.status === "APROVADO_FINANCEIRO") return item;
    return {
      ...item,
      status: "REJEITADO",
      history: [...item.history, `${new Date().toISOString()} - ${role} rejeitou`],
    };
  });

  writeExpenses(items);
  render();
}

function buildActionsCell(expense) {
  const container = document.createElement("div");
  container.className = "row-actions";

  const role = actorRole.value;

  if (canApprove(expense, role)) {
    const approveBtn = document.createElement("button");
    approveBtn.className = "btn-approve";
    approveBtn.textContent = "Aprovar";
    approveBtn.addEventListener("click", () => approveExpense(expense.id, role));
    container.appendChild(approveBtn);
  }

  if (expense.status !== "APROVADO_FINANCEIRO" && expense.status !== "REJEITADO") {
    const rejectBtn = document.createElement("button");
    rejectBtn.className = "btn-reject";
    rejectBtn.textContent = "Rejeitar";
    rejectBtn.addEventListener("click", () => rejectExpense(expense.id, role));
    container.appendChild(rejectBtn);
  }

  if (!container.childElementCount) {
    const info = document.createElement("span");
    info.className = "small";
    info.textContent = "Sem ações";
    container.appendChild(info);
  }

  return container;
}

function render() {
  const status = statusFilter.value;
  const items = readExpenses().filter((item) => status === "all" || item.status === status);

  tbody.innerHTML = "";

  for (const item of items) {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    row.querySelector('[data-col="id"]').textContent = item.id;
    row.querySelector('[data-col="requester"]').textContent = item.requester;
    row.querySelector('[data-col="costCenter"]').textContent = item.costCenter;
    row.querySelector('[data-col="amount"]').textContent = brl(item.amount);
    row.querySelector('[data-col="dueDate"]').textContent = new Date(item.dueDate).toLocaleDateString("pt-BR");

    const statusEl = document.createElement("span");
    statusEl.className = `status ${item.status}`;
    statusEl.textContent = mapStatusLabel(item.status);
    row.querySelector('[data-col="status"]').appendChild(statusEl);

    row.querySelector('[data-col="actions"]').appendChild(buildActionsCell(item));

    tbody.appendChild(row);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = Object.fromEntries(new FormData(form));
  const expense = {
    id: `DESP-${Date.now().toString().slice(-6)}`,
    requester: payload.requester.trim(),
    costCenter: payload.costCenter.trim(),
    description: payload.description.trim(),
    amount: Number(payload.amount),
    dueDate: payload.dueDate,
    status: "PENDENTE",
    history: [`${new Date().toISOString()} - Solicitação criada`],
  };

  const items = readExpenses();
  items.unshift(expense);
  writeExpenses(items);

  form.reset();
  render();
});

statusFilter.addEventListener("change", render);
actorRole.addEventListener("change", render);

seedDemoBtn.addEventListener("click", () => {
  const demo = [
    {
      id: "DESP-1001",
      requester: "Ana Lima",
      costCenter: "Projeto Água Viva",
      description: "Pagamento de fornecedor de logística",
      amount: 2480.9,
      dueDate: "2026-04-10",
      status: "PENDENTE",
      history: [],
    },
    {
      id: "DESP-1002",
      requester: "Bruno Souza",
      costCenter: "Projeto Carbono",
      description: "Serviço de consultoria técnica",
      amount: 5330,
      dueDate: "2026-04-05",
      status: "APROVADO_GESTOR",
      history: [],
    },
  ];

  writeExpenses(demo);
  render();
});

render();
