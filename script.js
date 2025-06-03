document.getElementById("caseForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    Date: form.Date.value,
    AssignedDate: form.AssignedDate.value,
    Customer: form.Customer.value,
    ReviewPlatform: form.ReviewPlatform.value,
    ReviewLink: form.ReviewLink.value,
    ApproachConfirmed: form.ApproachConfirmed.value,
    AssignTo: form.AssignTo.value
  };

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbzJoQYlodh43Op_KdmbRBEXUHmhZVZEyQezUHNR_OmSuNYguVfWIblm9tHFt-6tuUNm/exec", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    alert("Case submitted successfully!");
    form.reset();
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("There was a problem submitting your case. Please try again.");
  }
});
