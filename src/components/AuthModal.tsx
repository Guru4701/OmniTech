import React, { useState, useEffect } from "react";
import { 
  auth, 
  googleProvider,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut
} from "../firebase";
import { 
  X, 
  Mail, 
  Lock, 
  Phone, 
  User as UserIcon, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  Info
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMethod = "google" | "email" | "phone";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [method, setMethod] = useState<AuthMethod>("email");
  const [isSignUp, setIsSignUp] = useState(false);
  
  // General states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Email form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone form states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState<any>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);
  const [isSandboxPhone, setIsSandboxPhone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset states
      setError(null);
      setSuccess(null);
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");
      setVerificationCode("");
      setVerificationId(null);
      setIsSandboxPhone(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Custom simulation login for seamless iframe demo
  const handleSimulatedLogin = (userType: "google" | "email" | "phone", customName?: string, customEmail?: string) => {
    setLoading(true);
    setTimeout(() => {
      // Sign out current real user if any
      signOut(auth);
      
      // Store a custom event or simulated user state in localStorage
      // We will let App.tsx listen to both real firebase auth and this simulated state
      const mockUser = {
        uid: `simulated-${Date.now()}`,
        displayName: customName || (userType === "google" ? "Google Explorer" : userType === "phone" ? "Phone Veteran" : "Matrix Enthusiast"),
        email: customEmail || (userType === "google" ? "google.explorer@matrix.io" : userType === "phone" ? "" : "matrix.developer@gmail.com"),
        phoneNumber: userType === "phone" ? (phoneNumber || "+1 (555) 019-2831") : null,
        photoURL: null,
        isSimulated: true
      };
      
      localStorage.setItem("omnitech_simulated_user", JSON.stringify(mockUser));
      // Dispatch custom storage event so other components react immediately
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("simulated_auth_change", { detail: mockUser }));
      
      setSuccess("Simulated login successful! Connected to live matrix.");
      setLoading(false);
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 800);
  };

  // Google sign in handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      // Remove simulated user if real login succeeds
      localStorage.removeItem("omnitech_simulated_user");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("simulated_auth_change", { detail: null }));
      
      setSuccess("Successfully authenticated via Google Secure!");
      setTimeout(() => onClose(), 1200);
    } catch (err: any) {
      console.warn("Real Google Auth failed (often due to sandboxed iframe permissions):", err);
      // Fallback popup hint
      setError(`Auth blocked by browser environment (${err.code || err.message}). Try the Sandbox secure sign-in below.`);
    } finally {
      setLoading(false);
    }
  };

  // Email/password sign-in and sign-up handler
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        setSuccess("Account successfully established! Profile synced.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Welcome back to the Intelligence Matrix!");
      }
      
      // Clean up simulated user
      localStorage.removeItem("omnitech_simulated_user");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("simulated_auth_change", { detail: null }));
      
      setTimeout(() => onClose(), 1200);
    } catch (err: any) {
      console.error(err);
      let errMsg = "Authentication credentials rejected.";
      if (err.code === "auth/email-already-in-use") errMsg = "Email address already registered.";
      if (err.code === "auth/weak-password") errMsg = "Password must be at least 6 characters.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errMsg = "Invalid email or password combination.";
      }
      setError(`${errMsg} (Error Code: ${err.code || 'unknown'})`);
    } finally {
      setLoading(false);
    }
  };

  // Setup reCAPTCHA for real Firebase Phone Auth
  const setupRecaptcha = () => {
    if (recaptchaVerifier) return recaptchaVerifier;
    try {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved");
        },
        "expired-callback": () => {
          setError("reCAPTCHA expired. Please try again.");
        }
      });
      setRecaptchaVerifier(verifier);
      return verifier;
    } catch (err) {
      console.warn("reCAPTCHA init failed in sandboxed iframe. Falling back to simulated verification.", err);
      setIsSandboxPhone(true);
      return null;
    }
  };

  // Phone send SMS handler
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError("Please input a valid phone number.");
      return;
    }
    setLoading(true);
    setError(null);

    // If sandbox mode is flagged or reCAPTCHA setup throws, go simulated mode
    if (isSandboxPhone) {
      setTimeout(() => {
        setVerificationId("mock-verification-id-12345");
        setSuccess("SMS code dispatched to " + phoneNumber + " (Simulated for local sandbox review)");
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const verifier = setupRecaptcha();
      if (!verifier) {
        // Fallback to simulated code if verifier could not be set up
        setIsSandboxPhone(true);
        setTimeout(() => {
          setVerificationId("mock-verification-id-12345");
          setSuccess("SMS code dispatched to " + phoneNumber + " (Simulated for local sandbox review)");
          setLoading(false);
        }, 1000);
        return;
      }

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setVerificationId(confirmationResult);
      setSuccess("SMS code successfully dispatched to " + phoneNumber);
    } catch (err: any) {
      console.warn("Real Phone Auth error:", err);
      // Automatically activate elegant sandbox fallback so user is never blocked
      setIsSandboxPhone(true);
      setVerificationId("mock-verification-id-12345");
      setSuccess("SMS code dispatched to " + phoneNumber + " (Simulated for local sandbox review)");
    } finally {
      setLoading(false);
    }
  };

  // Phone verification OTP code handler
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError("Please input the 6-digit confirmation code.");
      return;
    }
    setLoading(true);
    setError(null);

    if (isSandboxPhone || typeof verificationId === "string") {
      // Simulated verification
      setTimeout(() => {
        handleSimulatedLogin("phone", "Hardware Innovator (" + phoneNumber.slice(-4) + ")", `phone-${phoneNumber.replace(/[^0-9]/g, "")}@omnitech.io`);
      }, 1000);
      return;
    }

    try {
      await verificationId.confirm(verificationCode);
      
      // Clean up simulated user
      localStorage.removeItem("omnitech_simulated_user");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("simulated_auth_change", { detail: null }));

      setSuccess("Successfully authenticated via Mobile secure OTP!");
      setTimeout(() => onClose(), 1200);
    } catch (err: any) {
      console.error(err);
      setError("Invalid OTP confirmation code. Try again or use simulated verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      
      {/* Invisible container for recaptcha */}
      <div id="recaptcha-container"></div>

      <div className="relative w-full max-w-md bg-[#050505] border border-zinc-800 rounded-2xl overflow-hidden p-6 md:p-8 space-y-6 shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-500 uppercase block">Secure Gateway</span>
          <h2 className="text-2xl font-serif font-light text-zinc-100 flex items-center justify-center gap-2">
            OmniTech Unified Access
          </h2>
          <p className="text-zinc-400 text-xs">
            Unlock developer telemetry, live benchmarks, and personalized hardware databases.
          </p>
        </div>

        {/* Method Toggle Buttons */}
        <div className="grid grid-cols-3 gap-2 border-b border-zinc-900 pb-4">
          <button
            onClick={() => { setMethod("email"); setError(null); }}
            className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center ${
              method === "email" 
                ? "bg-zinc-900 text-white border-zinc-800" 
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Email Access
          </button>
          <button
            onClick={() => { setMethod("phone"); setError(null); }}
            className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center ${
              method === "phone" 
                ? "bg-zinc-900 text-white border-zinc-800" 
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Phone SMS
          </button>
          <button
            onClick={() => { setMethod("google"); setError(null); }}
            className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center ${
              method === "google" 
                ? "bg-zinc-900 text-white border-zinc-800" 
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Google OAuth
          </button>
        </div>

        {/* Status Toast Indicators */}
        {error && (
          <div className="p-3.5 bg-red-950/20 border border-red-900/30 rounded-xl text-xs text-red-400 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium">{error}</p>
              {/* Optional simulated helper button for easy testing */}
              {method === "google" && (
                <button
                  type="button"
                  onClick={() => handleSimulatedLogin("google")}
                  className="bg-red-900/20 hover:bg-red-900/30 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1.5 rounded border border-red-900/40 cursor-pointer block"
                >
                  Bypass with Google Sandbox Mode
                </button>
              )}
            </div>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* FORM SWITCHES */}
        
        {/* EMAIL ACCESS FORM */}
        {method === "email" && !success && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    required
                    placeholder="Deepali Patil"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 outline-none focus:border-zinc-700 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-200 text-black py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSignUp ? (
                "Establish Credentials"
              ) : (
                "Authorize Connection"
              )}
            </button>

            {/* Simulated instant testing credentials */}
            <div className="pt-3 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-500">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="hover:text-zinc-300 underline transition-colors cursor-pointer"
              >
                {isSignUp ? "Already have credentials? Sign In" : "Register a new secure profile"}
              </button>
              
              <button
                type="button"
                onClick={() => handleSimulatedLogin("email", isSignUp ? name : undefined, email)}
                className="hover:text-white flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-zinc-500 border border-zinc-900 px-2 py-1 rounded hover:border-zinc-800 transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-white" /> Demo Sandbox
              </button>
            </div>
          </form>
        )}

        {/* PHONE SMS LOGIN FORM */}
        {method === "phone" && !success && (
          <div className="space-y-4">
            {!verificationId ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Mobile Number</label>
                    {isSandboxPhone && (
                      <span className="text-[8px] font-mono text-zinc-500 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800 uppercase tracking-widest">Sandbox Active</span>
                    )}
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2831"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="p-3 bg-zinc-900/20 border border-zinc-900/40 rounded-xl text-[10px] text-zinc-500 leading-normal flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <span>Realtime OTP relies on reCAPTCHA. If your browser blocks iframe frames, we will automatically switch to a beautiful demo simulator.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-zinc-200 text-black py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Send Authorization Code <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSandboxPhone(true);
                      handleSimulatedLogin("phone");
                    }}
                    className="hover:text-white font-mono text-[9px] uppercase tracking-widest text-zinc-500 border border-zinc-900 px-3 py-1.5 rounded hover:border-zinc-800 transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-white" /> Bypass to Phone Demo Sandbox
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">6-Digit SMS Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-center text-lg font-mono tracking-widest text-zinc-100 outline-none focus:border-zinc-700 transition-colors"
                  />
                </div>

                {isSandboxPhone && (
                  <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-center">
                    <p className="text-[10px] text-zinc-400 font-mono">Sandbox Demo active. Click verify to complete with any code!</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-zinc-200 text-black py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Identity"}
                </button>

                <button
                  type="button"
                  onClick={() => setVerificationId(null)}
                  className="w-full text-center text-zinc-500 hover:text-zinc-300 text-xs underline transition-colors cursor-pointer"
                >
                  Use a different phone number
                </button>
              </form>
            )}
          </div>
        )}

        {/* GOOGLE OAUTH ACCESS */}
        {method === "google" && !success && (
          <div className="space-y-5 text-center py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-zinc-900/40 rounded-2xl border border-zinc-800 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-5.22-4.53z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
            </div>

            <p className="text-zinc-400 text-xs px-4">
              Access the system instantly with standard Google secure single sign-on.
            </p>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-200 text-black py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Authorize with Google"
              )}
            </button>

            <div className="pt-2 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => handleSimulatedLogin("google")}
                className="hover:text-white font-mono text-[9px] uppercase tracking-widest text-zinc-500 border border-zinc-900 px-3 py-1.5 rounded hover:border-zinc-800 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-white" /> Direct Google Sandbox login
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
