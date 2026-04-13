const API_BASE = "http://127.0.0.1:8000";

const refs = {
    userPanel: document.getElementById("userPanel"),
    backToTask: document.getElementById("backToTask"),
    areaConfirm: document.getElementById("areaConfirm"),
    province: document.getElementById("province"),
    city: document.getElementById("city"),
    district: document.getElementById("district"),
    routeName: document.getElementById("routeName"),
    lng: document.getElementById("lng"),
    lat: document.getElementById("lat"),
    distance: document.getElementById("distance"),
    pointCount: document.getElementById("pointCount"),
    direction: document.getElementById("direction"),
    height: document.getElementById("height"),
    saveRoute: document.getElementById("saveRoute"),
    cancelRoute: document.getElementById("cancelRoute"),
    formTip: document.getElementById("formTip"),
    draftList: document.getElementById("draftList"),
    tools: document.querySelectorAll(".tool-btn")
};

const drafts = [];

function initUserPanel() {
    const raw = localStorage.getItem("uav_user");
    if (!raw) {
        window.location.href = "../login/login.html";
        return;
    }

    try {
        const user = JSON.parse(raw);
        const displayName = user.displayName || user.username || "未知用户";
        refs.userPanel.textContent = `管理员：${displayName}`;
    } catch (error) {
        localStorage.removeItem("uav_user");
        window.location.href = "../login/login.html";
    }
}

function showTip(message, isError = true) {
    refs.formTip.style.color = isError ? "#ef4444" : "#16a34a";
    refs.formTip.textContent = message;
}

function isNumber(value) {
    return value !== "" && !Number.isNaN(Number(value));
}

function validateForm() {
    if (!refs.routeName.value.trim()) {
        return "请填写航线名称";
    }
    if (!isNumber(refs.lng.value) || Number(refs.lng.value) < -180 || Number(refs.lng.value) > 180) {
        return "经度应为 -180 到 180 之间的数字";
    }
    if (!isNumber(refs.lat.value) || Number(refs.lat.value) < -90 || Number(refs.lat.value) > 90) {
        return "纬度应为 -90 到 90 之间的数字";
    }
    if (!isNumber(refs.distance.value) || Number(refs.distance.value) <= 0) {
        return "航点间距应为大于 0 的数字";
    }
    if (!isNumber(refs.pointCount.value) || Number(refs.pointCount.value) <= 1) {
        return "航点数量应为大于 1 的数字";
    }
    if (!isNumber(refs.direction.value) || Number(refs.direction.value) < 0 || Number(refs.direction.value) > 360) {
        return "航点方向应为 0 到 360 之间的数字";
    }
    if (!isNumber(refs.height.value) || Number(refs.height.value) <= 0) {
        return "航线高度应为大于 0 的数字";
    }
    return "";
}

function renderDrafts() {
    if (drafts.length === 0) {
        refs.draftList.innerHTML = "<li>暂无航线草稿</li>";
        return;
    }

    refs.draftList.innerHTML = drafts.map((item, index) => {
        return `<li>${index + 1}. ${item.name} | 点数: ${item.pointCount} | 高度: ${item.height}m | 起点: (${item.lng}, ${item.lat})</li>`;
    }).join("");
}

function resetForm() {
    refs.routeName.value = "";
    refs.lng.value = "";
    refs.lat.value = "";
    refs.distance.value = "";
    refs.pointCount.value = "";
    refs.direction.value = "";
    refs.height.value = "";
    showTip("", false);
}

refs.backToTask.addEventListener("click", () => {
    window.location.href = "../task-center/index.html";
});

refs.areaConfirm.addEventListener("click", () => {
    if ([refs.province.value, refs.city.value, refs.district.value].some((value) => ["省", "市", "区/县"].includes(value))) {
        showTip("请完整选择省市区后再确认", true);
        return;
    }
    showTip(`区域已切换为：${refs.province.value}-${refs.city.value}-${refs.district.value}`, false);
});

async function loadDrafts() {
    const response = await fetch(`${API_BASE}/api/routes?limit=50`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail || "草稿加载失败");
    }
    drafts.length = 0;
    (data.items || []).forEach((item) => drafts.push(item));
    renderDrafts();
}

refs.saveRoute.addEventListener("click", async () => {
    const err = validateForm();
    if (err) {
        showTip(err, true);
        return;
    }

    if ([refs.province.value, refs.city.value, refs.district.value].some((value) => ["省", "市", "区/县"].includes(value))) {
        showTip("请先选择有效区域", true);
        return;
    }

    const payload = {
        name: refs.routeName.value.trim(),
        province: refs.province.value,
        city: refs.city.value,
        district: refs.district.value,
        lng: refs.lng.value.trim(),
        lat: refs.lat.value.trim(),
        distance: refs.distance.value.trim(),
        pointCount: Number(refs.pointCount.value),
        direction: refs.direction.value.trim(),
        height: refs.height.value.trim()
    };

    refs.saveRoute.disabled = true;
    showTip("正在保存航线...", false);
    try {
        const response = await fetch(`${API_BASE}/api/routes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || "保存失败");
        }

        await loadDrafts();
        showTip("航线草稿已保存到数据库", false);
    } catch (error) {
        showTip(error.message || "保存失败", true);
    } finally {
        refs.saveRoute.disabled = false;
    }
});

refs.cancelRoute.addEventListener("click", resetForm);

refs.tools.forEach(button => {
    button.addEventListener("click", () => {
        refs.tools.forEach(item => item.classList.remove("active"));
        button.classList.add("active");
    });
});

loadDrafts().catch((error) => {
    showTip(error.message || "草稿初始化失败", true);
});

initUserPanel();
