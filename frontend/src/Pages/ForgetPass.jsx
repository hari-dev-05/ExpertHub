import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ForgetPass = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // OTP flow email (typed manually)
  const [email, setEmail] = useState("");

  // Login email (passed from login page)
  const [loginEmail, setLoginEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState("otp"); // otp | reset | success
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // ✅ Get email from login page
  useEffect(() => {
    if (location.state?.email) {
      setLoginEmail(location.state.email);
      console.log("✅ Received login email:", location.state.email);
    }
  }, [location.state]);

  // ✅ Send OTP to entered email
  const handleSendCode = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const res = await fetch(`${import.meta.env.VITE_API_URL}
/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.otp !== undefined) {
        const backendOtp = String(data.otp).trim();
        setOtp(backendOtp);
        console.log("Backend OTP:", backendOtp);
        setMessage("OTP sent. Check your email.");
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = () => {
    const e = String(enteredOtp || "").trim();
    const b = String(otp || "").trim();

    console.log("Entered OTP:", e, "Backend OTP:", b);

    if (!e) {
      setMessage("Please enter the OTP.");
      return;
    }

    if (e === b) {
      setMessage("✅ OTP Verified Successfully!");
      setStep("reset"); // move to reset password box
    } else {
      setMessage("❌ Incorrect OTP. Try again.");
    }
  };

  // ✅ Change password using loginEmail
  const handlePasswordChange = async () => {
    if (!newPass || !confirmPass) {
      alert("Please fill both password fields.");
      return;
    }
    if (newPass !== confirmPass) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Password reset for:", loginEmail);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}
/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, newPassword: newPass }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep("success"); // ✅ show success screen
        setTimeout(() => navigate("/login"), 2000); // redirect after 2s
      } else {
        setMessage(data.message || "Password update failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error while updating password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4 text-center"
        style={{
          width: "23rem",
          minHeight: "400px",
          borderRadius: "1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {step === "otp" && (
          <div>
            <h4 className="fw-semibold mb-3">Forgot Password</h4>

            <input
              type="email"
              className="form-control mb-3 text-center"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSendCode}
              className="btn btn-success w-100 mb-2"
              disabled={loading}
            >
              {loading ? "Sending..." : "Get Email OTP"}
            </button>

            <hr />

            <input
              type="text"
              className="form-control mb-3 text-center"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              maxLength={6}
            />
            <button onClick={handleVerifyOtp} className="btn btn-primary w-100">
              Verify OTP
            </button>
          </div>
        )}

        {step === "reset" && (
          <div>
            <h4 className="fw-semibold mb-3">Reset Password</h4>
            <input
              type="email"
              className="form-control mb-3 text-center"
              placeholder="Your login email"
              value={loginEmail}
              readOnly
            />
            <input
              type="password"
              className="form-control mb-2 text-center"
              placeholder="Enter new password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <input
              type="password"
              className="form-control mb-3 text-center"
              placeholder="Confirm password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <button
              onClick={handlePasswordChange}
              className="btn btn-warning w-100"
            >
              Change Password
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center">
            <div
              style={{
                fontSize: "60px",
                color: "green",
                animation: "pop 0.4s ease-in-out",
              }}
            >
              ✅
            </div>
            <h5 className="mt-3 text-success fw-bold">
              Password changed successfully!
            </h5>
            <p className="text-muted">Redirecting to login...</p>
          </div>
        )}

        {message && step !== "success" && (
          <p className="mt-3 fw-semibold">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgetPass;
