import { useState, useEffect } from "react";
import api from "../api/axios";
import "./Login.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [roleId, setRoleId] = useState(1);
  const [roles, setRoles] = useState([]);
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [type, setType] = useState(""); // success | error

  useEffect(() => {
    api.get("/users/roles")
      .then((res) => setRoles(res.data))
      .catch(() => {
        setType("error");
        setMessage("Failed to load roles — defaulting to Student role");
        // Fallback so signup still works if backend/DB is unavailable
        const fallback = [{ role_id: 1, role_name: "Student" }];
        setRoles(fallback);
        setRoleId(1);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    /* =====================
       REQUIRED FIELD CHECKS
       ===================== */
    const fields = [
      { name: "Full Name", value: name },
      { name: "Email", value: email },
      { name: "Password", value: password },
    ];

    // Only check department for roles that show it
    const selectedRole = roles.find(r => r.role_id === roleId);
    if (!["Estate Manager", "Principal", "Director"].includes(selectedRole?.role_name)) {
      fields.push({ name: "Department", value: department });
    }

    // Only check year if role is Student or Club Head
    if (selectedRole?.role_name === "Student" || selectedRole?.role_name === "Club Head") {
      fields.push({ name: "Year", value: year });
    }

    const emptyFields = fields.filter(f => !f.value);

    if (emptyFields.length === 1) {
      setType("error");
      return setMessage(`${emptyFields[0].name} is required`);
    }

    if (emptyFields.length > 1) {
      setType("error");
      return setMessage("All fields are required");
    }

    /* =====================
       EMAIL FORMAT CHECK
       ===================== */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setType("error");
      return setMessage("Please enter a valid email address");
    }

    if ((selectedRole?.role_name === "Student" || selectedRole?.role_name === "Club Head") && (year < 1 || year > 4)) {
      setType("error");
      return setMessage("Year must be between 1 and 4");
    }

    // Key validation for roles that need it
    const rolesRequiringKeys = ["Club Head", "Admin", "Faculty", "Club Mentor", "Estate Manager", "Principal", "Director"];
    if (rolesRequiringKeys.includes(selectedRole?.role_name) && !secretKey) {
      setType("error");
      return setMessage(`${selectedRole.role_name} role requires a secret key`);
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        department,
        year: showYear ? year : null, // only send year if role requires it
        role_id: roleId,
        secret_key: secretKey
      });

      setType("success");
      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (err) {
      setType("error");
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Determine if current role requires a key
  const rolesRequiringKeys = ["Club Head", "Admin", "Faculty", "Club Mentor", "Estate Manager", "Principal", "Director"];
  const requiresKey = rolesRequiringKeys.includes(
    roles.find(r => r.role_id === roleId)?.role_name
  );

  // Determine placeholder based on role
  const currentRoleName = roles.find(r => r.role_id === roleId)?.role_name;
  const keyPlaceholder = currentRoleName === "Club Head"
    ? "Enter Club Secret Key"
    : `Enter ${currentRoleName} Key`;

  // Determine if year should be shown
  const showYear = ["Student", "Club Head"].includes(roles.find(r => r.role_id === roleId)?.role_name);

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h2>Sign Up</h2>

        {message && (
          <div className={`auth-message ${type}`}>
            {message}
          </div>
        )}

        <select
          value={roleId}
          onChange={(e) => setRoleId(Number(e.target.value))}
          className="role-select"
        >
          {roles.map((role) => (
            <option key={role.role_id} value={role.role_id}>
              {role.role_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Hide Department for high-level authorities */}
        {!["Estate Manager", "Principal", "Director"].includes(currentRoleName) && (
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        )}

        {showYear && (
          <input
            type="number"
            placeholder="Year (1-4)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1"
            max="4"
          />
        )}

        {requiresKey && (
          <input
            type="text"
            placeholder={keyPlaceholder}
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
