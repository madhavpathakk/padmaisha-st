import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/router";
import { useState } from "react";

export default function GoogleSignInButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== "padmaisha940@gmail.com") {
        await signOut(auth);
        setError("Access denied: Invalid account");
        return;
      }
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Network error: Please retry");
    }
  };

  return (
    <div style={{marginTop: 12}}>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </div>
  );
}
