const mockTasks = [
    {
        id: 1,
        name: "XX区日常巡检",
        type: "周期性任务",
        cycle: "每天",
        status: "执行中",
        startTime: "2021-11-15 14:00",
        endTime: "2022-11-14",
        executed: "49/52",
        enabled: true
    },
    {
        id: 2,
        name: "XX区临时巡检",
        type: "单次性任务",
        cycle: "单次",
        status: "已完成",
        startTime: "2021-11-01 09:00",
        endTime: "2021-11-01",
        executed: "1/1",
        enabled: true
    },
    {
        id: 3,
        name: "XX区紧急巡检",
        type: "单次性任务",
        cycle: "单次",
        status: "待执行",
        startTime: "2021-11-01 14:00",
        endTime: "2021-11-01",
        executed: "0/1",
        enabled: false
    },
    {
        id: 4,
        name: "XX区日常巡检",
        type: "周期性任务",
        cycle: "每3天",
        status: "待执行",
        startTime: "2021-11-01 09:00",
        endTime: "2022-10-31",
        executed: "0/120",
        enabled: true
    },
    {
        id: 5,
        name: "XX区临时巡检",
        type: "单次性任务",
        cycle: "单次",
        status: "已完成",
        startTime: "2021-11-01 09:40",
        endTime: "2021-11-01",
        executed: "1/1",
        enabled: true
    },
    {
        id: 6,
        name: "XX区日常巡检",
        type: "周期性任务",
        cycle: "每7天",
        status: "执行中",
        startTime: "2021-11-01 08:00",
        endTime: "2021-10-31",
        executed: "8/52",
        enabled: true
    },
    {
        id: 7,
        name: "XX区月度巡检",
        type: "周期性任务",
        cycle: "每30天",
        status: "已取消",
        startTime: "2021-11-01 10:00",
        endTime: "2023-10-31",
        executed: "30/30",
        enabled: false
    },
    {
        id: 8,
        name: "XX区特别巡检",
        type: "单次性任务",
        cycle: "单次",
        status: "待执行",
        startTime: "2021-11-01 12:00",
        endTime: "2021-11-01",
        executed: "0/1",
        enabled: true
    }
];

const state = {
    page: 1,
    pageSize: 6,
    filtered: [...mockTasks]
};

const refs = {
    taskName: document.getElementById("taskName"),
    taskType: document.getElementById("taskType"),
    taskCycle: document.getElementById("taskCycle"),
    taskStatus: document.getElementById("taskStatus"),
    taskTableBody: document.getElementById("taskTableBody"),
    summary: document.getElementById("summary"),
    pageText: document.getElementById("pageText"),
    prevPage: document.getElementById("prevPage"),
    nextPage: document.getElementById("nextPage"),
    searchBtn: document.getElementById("searchBtn"),
    resetBtn: document.getElementById("resetBtn")
};

function getOpsByStatus(status) {
    if (status === "执行中" || status === "已完成") {
        return ["详情"];
    }
    return ["详情", "编辑", "删除"];
}

function renderTable() {
    const total = state.filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    state.page = Math.min(state.page, totalPages);

    const start = (state.page - 1) * state.pageSize;
    const rows = state.filtered.slice(start, start + state.pageSize);

    refs.taskTableBody.innerHTML = rows.map(task => {
        const ops = getOpsByStatus(task.status).map(op => `<span class="action-link" data-op="${op}" data-id="${task.id}">${op}</span>`).join("");
        return `
            <tr>
                <td>${task.id}</td>
                <td>${task.name}</td>
                <td>${task.type}</td>
                <td>${task.cycle}</td>
                <td>${task.status}</td>
                <td>${task.startTime}</td>
                <td>${task.endTime}</td>
                <td>${task.executed}</td>
                <td>
                    <span class="switch">
                        <button class="${task.enabled ? "on" : "off"}" data-toggle-id="${task.id}">${task.enabled ? "开启" : "禁用"}</button>
                    </span>
                </td>
                <td><div class="actions">${ops}</div></td>
            </tr>
        `;
    }).join("");

    refs.summary.textContent = `共 ${total} 条任务`;
    refs.pageText.textContent = `${state.page} / ${totalPages}`;
    refs.prevPage.disabled = state.page <= 1;
    refs.nextPage.disabled = state.page >= totalPages;
}

function applyFilter() {
    const name = refs.taskName.value.trim();
    const type = refs.taskType.value;
    const cycle = refs.taskCycle.value;
    const status = refs.taskStatus.value;

    state.filtered = mockTasks.filter(task => {
        const byName = !name || task.name.includes(name);
        const byType = type === "all" || task.type === type;
        const byCycle = cycle === "all" || task.cycle === cycle;
        const byStatus = status === "all" || task.status === status;
        return byName && byType && byCycle && byStatus;
    });
    state.page = 1;
    renderTable();
}

function resetFilter() {
    refs.taskName.value = "";
    refs.taskType.value = "all";
    refs.taskCycle.value = "all";
    refs.taskStatus.value = "all";
    state.filtered = [...mockTasks];
    state.page = 1;
    renderTable();
}

refs.searchBtn.addEventListener("click", applyFilter);
refs.resetBtn.addEventListener("click", resetFilter);

refs.prevPage.addEventListener("click", () => {
    if (state.page > 1) {
        state.page -= 1;
        renderTable();
    }
});

refs.nextPage.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    if (state.page < totalPages) {
        state.page += 1;
        renderTable();
    }
});

refs.taskTableBody.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
        return;
    }

    const toggleId = target.getAttribute("data-toggle-id");
    if (toggleId) {
        const task = mockTasks.find(item => item.id === Number(toggleId));
        if (task) {
            task.enabled = !task.enabled;
            renderTable();
        }
        return;
    }

    const op = target.getAttribute("data-op");
    const id = Number(target.getAttribute("data-id"));
    if (op && id) {
        const task = mockTasks.find(item => item.id === id);
        if (task) {
            alert(`${op}：${task.name}`);
        }
    }
});

renderTable();
