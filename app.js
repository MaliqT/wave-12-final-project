console.log(`PTO Tracker JavaScript has been connected`);

const ptoData = {
    currentBalance: 30.6,
    accrualRate: 2.0,
    nextPaycheck: "Oct, 30, 2026"
};

const currentPtoElement = document.getElementById("current-pto-value");
const accrualRateElement = document.getElementById("accrual-rate-value");
const nextPaycheckElement = document.getElementById("next-paycheck-value");

function updateDashboard() {
    currentPtoElement.textContent = `${ptoData.currentBalance.toFixed(1)} hrs`;
    accrualRateElement.textContent = `${ptoData.accrualRate.toFixed(1)} hrs`;
    nextPaycheckElement.textContent = ptoData.nextPaycheck;
}



// PTO Projection Form

const projectionForm = document.querySelector(".projection-form");
const projectionDateInput = document.getElementById("projection-date");
const projectionResultLabel = document.querySelector(".projection-result-label");
const projectionResultValue = document.querySelector(".projection-result-value");

// Event Listener

projectionForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Input type="date" will return date string in YYYY-MM-DD format
    const selectedDate = projectionDateInput.value;

    projectionResultLabel.textContent = `Selected Date`;
    projectionResultValue.textContent = selectedDate;
});