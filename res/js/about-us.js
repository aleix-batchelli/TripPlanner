document.getElementById("contact-form").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target;

  const teamPayload = {
    service_id: "service_gacbg1e",
    template_id: "template_zta7zf4",
    user_id: "mjIEhf58eDWMda31-",
    template_params: {
      nom: form.nom.value,
      cognoms: form.cognoms.value,
      email: form.email.value,
      missatge: form.missatge.value
    }
  };

  const clientPayload = {
    service_id: "service_gacbg1e",
    template_id: "template_hjpa3ok",
    user_id: "mjIEhf58eDWMda31-",
    template_params: {
      nom: form.nom.value,
      cognoms: form.cognoms.value,
      email: form.email.value,
      missatge: form.missatge.value
    }
  };

  try {
    const resTeam = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamPayload)
    });

    const resClient = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientPayload)
    });

    if (resTeam.ok && resClient.ok) {
      alert("Message sent! Our team has received it and a confirmation email was sent to you.");
      form.reset();
    } else {
      alert("Failed to send one or both emails. Check console for details.");
    }
  } catch (err) {
    console.error("Error sending emails:", err);
    alert("Error connecting to EmailJS.");
  }
});
