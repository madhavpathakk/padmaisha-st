import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export function usePromptUserForm(userId: string) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);
      const data = snap.data();
      if (!data?.name || !data?.phone || !data?.address) setShowModal(true);
    }
    checkUser();
  }, [userId]);

  const handleSave = async (formData: any) => {
    await setDoc(doc(db, "users", userId), formData, { merge: true });
    setShowModal(false);
  };

  return { showModal, handleSave };
}
