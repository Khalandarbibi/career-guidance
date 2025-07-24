// frontend/public/js/main.js
// REGISTER
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        console.log("done");
        const res = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        console.log("done2");
        const data = await res.json();

        if (res.ok) {
          alert("Registration successful!");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Registration failed!");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
      }
    });
  }

  // LOGIN
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Login successful!");
          window.location.href = "education.html"; // ✅ Redirect to next page
        } else {
          alert(data.message || "Login failed!");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
      }
    });
  }
});
