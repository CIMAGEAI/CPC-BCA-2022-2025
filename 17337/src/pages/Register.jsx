import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [uiState, setUiState] = useState("enter-email");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [countdown, setCountdown] = useState(0);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const debouncedEmail = useDebounce(email, 500);

  const navigate = useNavigate();
  const functions = getFunctions();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("registrationEmail");
    const storedUiState = sessionStorage.getItem("registrationUiState");
    if (storedEmail && storedUiState === "enter-otp") {
      setEmail(storedEmail);
      setUiState(storedUiState);
      setMessage("Please enter the OTP sent to your email to continue.");
      setCountdown(60);
    }
  }, []);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate('/');
        }
      });
      return () => unsubscribe();
    }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const checkEmail = async () => {
      if (debouncedEmail && /^\S+@\S+\.\S+$/.test(debouncedEmail)) {
        setIsCheckingEmail(true);
        setEmailExists(false);
        setError(null);
        try {
          const checkEmailFunction = httpsCallable(
            functions,
            "checkIfEmailExists"
          );
          const result = await checkEmailFunction({ email: debouncedEmail });
          setEmailExists(result.data.exists);
        } catch (err) {
          console.error("Error checking email:", err);
        } finally {
          setIsCheckingEmail(false);
        }
      } else {
        setEmailExists(false);
      }
    };
    checkEmail();
  }, [debouncedEmail, functions]);

  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/\d/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  }, [password]);

  const strengthText = useMemo(() => {
    const texts = ["Too Weak", "Weak", "Moderate", "Strong", "Very Strong"];
    return texts[passwordStrength];
  }, [passwordStrength]);

  const handleSendOtp = async () => {
    if (emailExists) {
      setError("This email is already registered. Please log in.");
      return;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setMessage("");
    setUiState("sending-otp");

    try {
      const sendOtpFunction = httpsCallable(functions, "sendRegistrationOtp");
      await sendOtpFunction({ email });
      setMessage("An OTP (valid for 10 minutes) has been sent to your email.");
      setUiState("enter-otp");
      setCountdown(60);
      sessionStorage.setItem("registrationEmail", email);
      sessionStorage.setItem("registrationUiState", "enter-otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
      setUiState("enter-email");
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    if (password.length < 8 || passwordStrength < 3) {
      setError("Password is too weak. Must be 8+ characters with letters, numbers, and symbols.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setUiState("submitting");

    try {
      const verifyOtpFunction = httpsCallable(functions, "verifyRegistrationOtp");
      await verifyOtpFunction({ email, otp });

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.email.split("@")[0],
        createdAt: new Date().toISOString(),
        provider: "email",
        role: "user",
        isBlocked: false,
      });

      sessionStorage.removeItem("registrationEmail");
      sessionStorage.removeItem("registrationUiState");
      
      navigate("/");

    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      setUiState("enter-otp");
    }
  };

  const handleChangeEmail = () => {
    setUiState("enter-email");
    setMessage("");
    setError(null);
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setCountdown(0);
    sessionStorage.removeItem("registrationEmail");
    sessionStorage.removeItem("registrationUiState");
  };

  const isOtpSectionVisible =
    uiState === "enter-otp" || uiState === "submitting";
  const isSendOtpDisabled = isCheckingEmail || emailExists;

  return (
    <div className="auth-page-container">
      <div className="login-container">
        <div className="login-header">
          <h2>Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <div className="email-input-wrapper">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={uiState !== "enter-email"}
              />
              {uiState === "enter-email" && (
                <button
                  type="button"
                  className="otp-button"
                  onClick={handleSendOtp}
                  disabled={isSendOtpDisabled}
                >
                  {isCheckingEmail ? "Checking..." : "Send OTP"}
                </button>
              )}
              {uiState === "sending-otp" && (
                <button type="button" className="otp-button" disabled>
                  Sending...
                </button>
              )}
              {isOtpSectionVisible && (
                <button
                  type="button"
                  className="change-email-button"
                  onClick={handleChangeEmail}
                >
                  Change
                </button>
              )}
            </div>
            {emailExists && (
              <p className="email-exists-error">
                Email already registered. <Link to="/login">Login instead</Link>
                .
              </p>
            )}
          </div>

          <div
            className={`otp-section ${isOtpSectionVisible ? "visible" : ""}`}
          >
            <div className="form-group">
              <label>Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {password && (
                <div>
                  <div className="password-strength">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className={`strength-bar ${
                          passwordStrength >= i ? "filled" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <p className="strength-text">{strengthText}</p>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password:</label>
              <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              </div>
              {confirmPassword && (
                <p
                  className={`password-match-indicator ${
                    password === confirmPassword ? "match" : "no-match"
                  }`}
                >
                  {password === confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>OTP:</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
              />
              <div className="resend-otp-container">
                {countdown > 0 ? (
                  <p>Resend OTP in {countdown}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="resend-otp-button"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            <button type="submit" disabled={uiState === "submitting"}>
              {uiState === "submitting" ? "Registering..." : "Create Account"}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
        </form>

        <div className="or-separator">
          <span>or</span>
        </div>
        <GoogleSignInButton />

        <div className="login-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
