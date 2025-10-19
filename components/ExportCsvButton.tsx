import Papa from "papaparse";

export default function ExportCsvButton({ data, filename }: { data: any[]; filename: string }) {
  const handleExport = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded">Export CSV</button>
  );
}
