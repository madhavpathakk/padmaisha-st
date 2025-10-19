import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Papa from "papaparse";

export default function ExportCsvButton() {
  const handleExport = async () => {
    const snap = await getDocs(collection(db, "users"));
    const users = snap.docs.map(doc => doc.data());
    const csv = Papa.unparse(users);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return <button onClick={handleExport}>Export Users as CSV</button>;
}
