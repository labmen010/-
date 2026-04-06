const refs = {
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
    showTip(`区域已切换为：${refs.province.value}-${refs.city.value}-${refs.district.value}`, false);
});

refs.saveRoute.addEventListener("click", () => {
    const err = validateForm();
    if (err) {
        showTip(err, true);
        return;
    }

    drafts.unshift({
        name: refs.routeName.value.trim(),
        lng: Number(refs.lng.value),
        lat: Number(refs.lat.value),
        pointCount: Number(refs.pointCount.value),
        height: Number(refs.height.value)
    });

    renderDrafts();
    showTip("航线草稿已生成", false);
});

refs.cancelRoute.addEventListener("click", resetForm);

refs.tools.forEach(button => {
    button.addEventListener("click", () => {
        refs.tools.forEach(item => item.classList.remove("active"));
        button.classList.add("active");
    });
});

renderDrafts();
