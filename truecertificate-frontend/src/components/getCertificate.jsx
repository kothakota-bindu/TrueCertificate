import React, { useState } from "react";
import { ethers } from "ethers";
import CertiProofABI from "../abi/CertiProof.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CONTRACT_ADDRESS = "0x6bFE01336016b9dE74BaD94D40325796CDf26a10";

const GetCertificate = () => {
  const [certId, setCertId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!certId) {
      toast.error("Please enter a Certificate ID", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CertiProofABI,
        signer
      );

      const result = await contract.getCertificate(certId);
      setCertificate({
        studentName: result[0],
        courseName: result[1],
        ipfsHash: result[2],
        issuedAt: Number(result[3]),
      });

      toast.success("Certificate fetched successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("❌ Error fetching certificate:", err);
      toast.error("Failed to fetch certificate.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow rounded bg-white mt-8">
      <h2 className="text-xl font-bold mb-4">🔍 Get Certificate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Certificate ID"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          {loading ? "Fetching..." : "Get Certificate"}
        </button>
      </form>

      {certificate && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Certificate Details</h3>
          <p><strong>Student Name:</strong> {certificate.studentName}</p>
          <p><strong>Course Name:</strong> {certificate.courseName}</p>
          <p className="text-sm"><strong>IPFS Hash:</strong> {certificate.ipfsHash}</p>
          <p><strong>Issued At:</strong> {new Date(certificate.issuedAt * 1000).toLocaleString()}</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default GetCertificate;