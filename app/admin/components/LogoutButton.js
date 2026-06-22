// /admin/components/LogoutButton.tsx
'use client';

export default function LogoutButton({ children }) {
  const handleLogout = async () => {
    // Remove any authentication tokens/cookies (example for NextAuth or JWT)
    if (typeof window !== "undefined") {
      // Remove token and user info from localStorage/sessionStorage if used
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      sessionStorage.removeItem("jwt");
      sessionStorage.removeItem("user");
    }
    // Optionally, call your backend logout API if needed
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});

    // Redirect to login page
    window.location.href = "/admin/login";
  };

  return (
    <button onClick={handleLogout}>
      {children}
    </button>
  );
}
