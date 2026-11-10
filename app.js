console.log(`PTO Tracker JavaScript has been connected`);

/*These projects integrate **DOM manipulation, local storage, navigation, API usage, a contact form, 
and responsive design** using **HTML, CSS, and JavaScript**.*/

const defaultPtoData = {
    currentBalance: 40.6,
    accrualRate: 2.0,
    nextPaycheck: "2026-10-30",
    payFrequency: 14,
    lastPtoProcessedDate: null,

    ptoRequests: [
        {
            id: 1,
            startDate: "2026-11-12",
            endDate: "2026-11-14",
            hours: 24,
            status: "scheduled"
        },
        {
            id: 2,
            startDate: "2026-12-24",
            endDate: "2026-12-25",
            hours: 16,
            status: "pending"
        },
        {
            id: 3,
            startDate: "2027-01-10",
            endDate: "2027-01-16",
            hours: 56,
            status: "planned"
        }
    ]
};

let ptoData = loadDataFromStorage();

updateNextPaycheck();
updateUsedPto();
console.log(ptoData);

function renderData() {
    const ptoValue = document.getElementById("current-pto-value");
    const accrualRateValue = document.getElementById("accrual-rate-value");
    const nextPaycheckValue = document.getElementById("next-paycheck-value");
    const ptoRequestList = document.getElementById("pto-request-list");
    const ptoRequestData = ptoData.ptoRequests;

    const currentDate = document.getElementById("date-time");
    const today = new Date();
    currentDate.textContent = formatDate(today);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    currentDate.dateTime = `${year}-${month}-${day}`;

    ptoValue.textContent = ptoData.currentBalance.toFixed(1);
    accrualRateValue.textContent = ptoData.accrualRate.toFixed(1);
    nextPaycheckValue.textContent = formatDate(ptoData.nextPaycheck);

    ptoRequestList.innerHTML = "";
    ptoRequestData.forEach((request) => {
        addPtoRequest(request);
    });
    

}

renderData();

function updateNextPaycheck() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextPayDay = dateBreakdown(ptoData.nextPaycheck);
    const payFrequency = ptoData.payFrequency;

    if (Number.isNaN(nextPayDay.getTime()) || !Number.isInteger(payFrequency) || payFrequency <= 0 || 
        !Number.isFinite(ptoData.currentBalance) || !Number.isFinite(ptoData.accrualRate) || ptoData.accrualRate < 0) {

        return;
    }

    let previousPaychecks = 0;

    while (nextPayDay <= today) {
        ptoData.currentBalance += ptoData.accrualRate;
        previousPaychecks++;

        nextPayDay.setDate(nextPayDay.getDate() + payFrequency);
    }

    if (previousPaychecks === 0) {
        return;
    }
yesterdaysDateyes

    const year = nextPayDay.getFullYear();
    const month = String(nextPayDay.getMonth() + 1).padStart(2, "0");
    const day = String(nextPayDay.getDate()).padStart(2, "0");

    ptoData.nextPaycheck = `${year}-${month}-${day}`;

    localStorage.setItem("profileData", JSON.stringify(ptoData));
}


function updateUsedPto() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const day = String(yesterday.getDate()).padStart(2, "0");

    const yesterdaysDate = `${year}-${month}-${day}`;

    if (!ptoData.lastPtoProcessedDate) {
        ptoData.lastPtoProcessedDate = yesterdaysDate;
        localStorage.setItem("profileData", JSON.stringify(ptoData));
        return;
    }

    const lastProcessed = dateBreakdown(ptoData.lastPtoProcessedDate);

    if (Number.isNaN(lastProcessed.getTime())) {
        console.error("Invalid last PTO processed date.");
        return;
    }

    if (lastProcessed >= yesterday) {
        return;
    }

    const firstUnprocessedDay = new Date(lastProcessed);
    firstUnprocessedDay.setDate(firstUnprocessedDay.getDate() + 1);

    let totalHoursUsed = 0;

    ptoData.ptoRequests.forEach((request) => {
        if (request.status !== "scheduled") {
            return;
        }

        const scheduledStart = dateBreakdown(request.startDate);
        const scheduledEnd = dateBreakdown(request.endDate);
        const hours = Number(request.hours);

        if (Number.isNaN(scheduledStart.getTime()) || Number.isNaN(scheduledEnd.getTime()) || scheduledEnd < scheduledStart ||
            !Number.isFinite(hours) || hours < 0) {

            return;
        }

        const overlapStart = scheduledStart > firstUnprocessedDay ? scheduledStart : firstUnprocessedDay;

        const overlapEnd = scheduledEnd < yesterday ? scheduledEnd : yesterday;

        if (overlapStart > overlapEnd) {
            return;
        }

        const totalDays = countDaysInclusive(scheduledStart, scheduledEnd);
        const usedDays = countDaysInclusive(overlapStart, overlapEnd);

        const hoursUsed = hours * (usedDays / totalDays);

        totalHoursUsed += hoursUsed;
    });

    ptoData.currentBalance -= totalHoursUsed;
    ptoData.lastPtoProcessedDate = yesterdaysDate;

    localStorage.setItem("profileData", JSON.stringify(ptoData));

    console.log(`PTO deducted: ${totalHoursUsed} hours`);
}


function addPtoRequest(newRequest) {
    // Create the new list element for pto request to be added
    const requestList = document.getElementById("pto-request-list");
    const newLi = document.createElement("li");
    const requestDate = document.createElement("p");
    requestDate.textContent = `${formatDate(newRequest.startDate)} - ${formatDate(newRequest.endDate)}`;

    requestDate.classList.add("request-date");
    newLi.classList.add("request");

    // Create sub-elements inside list element
    const requestHours = document.createElement("p");
    const requestStatus = document.createElement("span");
    requestHours.textContent = `${newRequest.hours} hrs`;
    requestStatus.textContent = newRequest.status[0].toUpperCase() + newRequest.status.slice(1).toLowerCase();
    requestHours.classList.add("request-hours");
    
    // Assign appropriate class to request status
    if (newRequest.status === "scheduled") {
        requestStatus.classList.add("request-status", "status-scheduled");
    } else if (newRequest.status === "pending") {
        requestStatus.classList.add("request-status", "status-pending");
    } else if (newRequest.status === "planned") {
        requestStatus.classList.add("request-status", "status-planned");
    }

    const deleteBtn = document.createElement("button");

    deleteBtn.type = "button";
    deleteBtn.classList.add("delete-request-btn");
    deleteBtn.textContent = "X";
    deleteBtn.setAttribute("aria-label", "Delete PTO Request");

    deleteBtn.addEventListener("click", () => {
        ptoData.ptoRequests = ptoData.ptoRequests.filter((request) => request.id !== newRequest.id);

        localStorage.setItem("profileData", JSON.stringify(ptoData));

        renderData();
    });


    newLi.append(requestDate, requestHours, requestStatus, deleteBtn);
    requestList.append(newLi);
}

function loadDataFromStorage() {
    // Grab local storage data and fill contents

    const saved = localStorage.getItem("profileData");

    // Handle edge case of no data stored
    if (saved === null) {
        return structuredClone(defaultPtoData);
    }

    try {
        const parsedData = JSON.parse(saved);

        if (parsedData === null || typeof parsedData !== "object" || Array.isArray(parsedData)) {
            throw new Error("Invalid PTO data");
        }

        const data = {
            ...structuredClone(defaultPtoData),
            ...parsedData
        };

        for (const field of ["currentBalance", "accrualRate"]) {
            const value = data[field];

            const number = (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) ? Number(value) : NaN;

            data[field] = Number.isFinite(number) && number >= 0 ? number : defaultPtoData[field];
        }

        if (!Number.isInteger(data.payFrequency) || data.payFrequency <= 0) {
            data.payFrequency = defaultPtoData.payFrequency;
        }

        if (typeof data.nextPaycheck !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.nextPaycheck)) {
            data.nextPaycheck = defaultPtoData.nextPaycheck;
        }

        if (!Array.isArray(data.ptoRequests)) {
            data.ptoRequests = structuredClone(defaultPtoData.ptoRequests);
        }

        return data;
    } catch (err) {
        console.warn("Unable to load saved PTO data:", err);
        return structuredClone(defaultPtoData);
    }
}

function dateBreakdown(date) {
    const dateParts = date.split("-");
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]) - 1;
    const day = Number(dateParts[2]);

    return new Date(year, month, day);
}

function formatDate(dateInput) {
    const date = dateInput instanceof Date ? dateInput : dateBreakdown(dateInput);

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    

    return formatter.format(date);
}

function darkMode(isDark) {
    if (isDark) {
        document.body.classList.add("dark-mode");
        //document.getElementById("theme-btn").textContent = "Light";
    } else {
        document.body.classList.remove("dark");
        //document.getElementById("theme-btn").textContent = "Dark";
    }
}

function editForm() {
    const editButtons = document.querySelectorAll(".edit-summary-btn");
    const editDialog = document.getElementById("edit-summary-dialog");
    const editForm = document.getElementById("edit-summary-form");
    const editInput = document.getElementById("edit-summary-input");
    let field = null;

    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            field = button.dataset.field;
            if (field === "nextPaycheck") {
                editInput.type = "date";
            } else {
                editInput.type = "number";
            }

            editDialog.showModal();
        });
    });

    editForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (field === "currentBalance") {
            ptoData.currentBalance = Number(editInput.value);
        } else if (field === "accrualRate") {
            ptoData.accrualRate = Number(editInput.value);
        } else if (field === "nextPaycheck") {
            console.log(editInput.value);
            ptoData.nextPaycheck = editInput.value;
        }

        editDialog.close();
        renderData();
        localStorage.setItem("profileData", JSON.stringify(ptoData));
    })
}

function cancelForm() {
    const editDialog = document.getElementById("edit-summary-dialog");
    const cancelEditButton = document.getElementById("cancel-summary-edit");

    cancelEditButton.addEventListener("click", () => {
        editDialog.close();
    });
}

editForm();
cancelForm();

document.body.classList.add("dark-mode");


function calculateProjectedPto(currentBalance, accrualRate, nextPaycheck, payFrequency, targetDate, ptoRequests) {
    if (currentBalance < 0 || accrualRate < 0 || payFrequency <= 0) {
        return null;
    }

    const nextPayDay = dateBreakdown(nextPaycheck);
    const targetedDate = dateBreakdown(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (targetedDate < today || nextPayDay < today) {
        return null;
    }

    let projectedBalance = currentBalance;

    while(nextPayDay <= targetedDate) {
        projectedBalance += accrualRate;
        console.log(nextPayDay, projectedBalance);
        nextPayDay.setDate(nextPayDay.getDate() + payFrequency);
    }

    ptoRequests.forEach((request) => {
            if (request.status !== "scheduled") {
                return;
            }

            const scheduledStart = dateBreakdown(request.startDate);
            const scheduledEnd = dateBreakdown(request.endDate);

            const overlapStart = scheduledStart > today ? scheduledStart : today;
            const overlapEnd = scheduledEnd < targetedDate ? scheduledEnd : targetedDate;

            if (scheduledEnd < scheduledStart || overlapStart > overlapEnd) {
                return;
            }

            const totalDays = countDaysInclusive(scheduledStart, scheduledEnd);
            const includedDays = countDaysInclusive(overlapStart, overlapEnd);

            const hoursToSubtract = request.hours * (includedDays / totalDays);

            projectedBalance -= hoursToSubtract;
        });

    
    return projectedBalance;
}

function countDaysInclusive(startDate, endDate) {
    let days = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        days++;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
}


function setupProjectionForm() {
    const projectionForm = document.querySelector(".projection-form");
    const projectionDate = document.getElementById("projection-date");
    const projectedValue = document.getElementById("projected-value");

    projectionForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const targetDate = projectionDate.value;
        const result = calculateProjectedPto(
            ptoData.currentBalance,
            ptoData.accrualRate,
            ptoData.nextPaycheck,
            ptoData.payFrequency,
            targetDate,
            ptoData.ptoRequests
        );

        if (result === null) {
            projectedValue.textContent = "Invalid date or PTO data";
            return;
        }

        projectedValue.textContent = `${result.toFixed(1)} hrs`;
    });
}

setupProjectionForm();

function setupAddRequestForm() {
    const addBtn = document.querySelector(".add-request-btn");
    const dialog = document.getElementById("add-request-dialog");
    const form = document.getElementById("add-request-form");
    const cancelBtn = document.getElementById("cancel-add-request");

    const startInput = document.getElementById("request-start");
    const endInput = document.getElementById("request-end");
    const hoursInput = document.getElementById("request-hours");
    const statusInput = document.getElementById("request-status");

    addBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    cancelBtn.addEventListener("click", () => {
        dialog.close();
    });

    startInput.addEventListener("change", () => {
        endInput.min = startInput.value;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const startDate = startInput.value;
        const endDate = endInput.value;
        const hours = Number(hoursInput.value);
        const status = statusInput.value;

        if (endDate < startDate || !Number.isFinite(hours) || hours <= 0) {
            return;
        }

        const nextId = Math.max(0, ...ptoData.ptoRequests.map(request => request.id)) + 1;

        const newRequest = {
            id: nextId,
            startDate: startDate,
            endDate: endDate,
            hours: hours,
            status: status
        };

        ptoData.ptoRequests.push(newRequest);

        localStorage.setItem("profileData", JSON.stringify(ptoData));

        renderData();

        form.reset();
        endInput.removeAttribute("min");
        dialog.close();
    });
}

setupAddRequestForm();