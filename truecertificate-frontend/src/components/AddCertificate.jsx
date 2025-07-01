import React, { useState } from "react";
import { ethers } from "ethers";
import CertiProofABI from "../abi/CertiProof.json";
import { QRCodeCanvas } from "qrcode.react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetCertificate from "./getCertificate";

const CONTRACT_ADDRESS = "0x6bFE01336016b9dE74BaD94D40325796CDf26a10";

const AddCertificate = () => {
  const [certId, setCertId] = useState(null);
  const [showGetCertificate, setShowGetCertificate] = useState(false);
  const [form, setForm] = useState({
    studentName: "",
    courseName: "",
    file: null,
  });

  const [uploading, setUploading] = useState(false);

  const encodeFilePathToHash = (file) => {
    const filePath = file.name + Date.now().toString();
    const hash = ethers.keccak256(ethers.toUtf8Bytes(filePath));
    return hash;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const copyCertId = () => {
    if (certId) {
      navigator.clipboard.writeText(certId);
      toast.success("Certificate ID copied to clipboard!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.file) {
        toast.error("Please select a file", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      setUploading(true);

      const fileHash = encodeFilePathToHash(form.file);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CertiProofABI,
        signer
      );

      const tx = await contract.addCertificate(
        form.studentName,
        form.courseName,
        fileHash
      );

      const receipt = await tx.wait();
      const eventInterface = new ethers.Interface(CertiProofABI);
      const event = receipt.logs.find((log) => {
        try {
          const parsed = eventInterface.parseLog(log);
          return parsed?.name === "CertificateAdded";
        } catch {
          return false;
        }
      });

      if (!event) {
        throw new Error("CertificateAdded event not found");
      }

      const emittedCertId = eventInterface.parseLog(event).args[0];

      setCertId(emittedCertId);
      setForm({ studentName: "", courseName: "", file: null });
      toast.success("✅ Certificate added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.error("❌ Error adding certificate:", err);
      toast.error("Failed to add certificate: " + err.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 shadow rounded bg-white mt-8">
      <h2 className="text-xl font-bold mb-4">📜 Add Certificate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={form.studentName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
          value={form.courseName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          name="file"
          accept=".pdf,.png,.jpg"
          onChange={handleChange}
          className="w-full p-2"
          required
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Add Certificate"}
        </button>
      </form>

      <button
        onClick={() => setShowGetCertificate(!showGetCertificate)}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        {showGetCertificate ? "Hide Get Certificate" : "Get Certificate"}
      </button>

      {showGetCertificate && <GetCertificate />}

      {certId && (
        <div className="mt-4 p-4 border rounded bg-gray-50 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Certificate ID: {certId}</p>
            <button
              onClick={copyCertId}
              className="mt-2 bg-gray-200 text-gray-800 py-1 px-2 rounded hover:bg-gray-300 text-sm"
            >
              Copy CertId
            </button>
          </div>
          <div>
            <QRCodeCanvas
              value={String(certId)}
              size={65}
              className="bg-white p-1 rounded shadow"
              onError={(err) => console.error("QRCode error:", err)}
            />
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AddCertificate;