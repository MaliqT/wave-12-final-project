function setupContactForm() {
    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("contact-feedback");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const subject = document.getElementById("contact-subject").value;
        const message = document.getElementById("contact-message").value.trim();

        if (!name || !email || !subject || !message) {
            feedback.textContent = "Please fill all required fields";
            return
        }

        feedback.textContent = `Thank you, ${name} for your submission. Your form was validated successfully.`;

        form.reset();
    });
}

setupContactForm();