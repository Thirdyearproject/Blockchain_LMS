import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";

import Upload from "../build/contracts/BookManager.json";
import { RPC_URL, BookAddress } from "../services/apis";

const BookUpload = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [fileType, setFileType] = useState("PDF");
  const [loading, setLoading] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  const FILE_TYPE_ENUM = {
    PDF: 0,
    EPUB: 1,
    MOBI: 2,
    TEXT: 3,
    IMAGE: 4,
    VIDEO: 5,
  };

  // Connect to MetaMask
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const webProvider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const userSigner = await webProvider.getSigner();
          const bookContract = new ethers.Contract(
            BookAddress,
            Upload.abi,
            userSigner
          );

          setAccount(accounts[0]);
          setProvider(webProvider);
          setSigner(userSigner);
          setContract(bookContract);

          const balance = await webProvider.getBalance(accounts[0]);
          console.log(ethers.formatEther(balance)); // in ETH ✅
        } catch (error) {
          console.error("Wallet connection error:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    connectWallet();
  }, []);

  useEffect(() => {
    if (file) {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !author) {
      alert("Please fill all fields and select a file.");
      return;
    }
    if (!contract || !account) {
      alert("Please connect your wallet.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: "51bd33b7307e30887e87",
            pinata_secret_api_key:
              "cc803c7cac8712104fa091f7426ec97e4b2c2b955a585e636562dcc51b207cfd",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const ipfsHash = resFile.data.IpfsHash;

      const bookId = ethers.keccak256(ethers.toUtf8Bytes(title + author));
      const transaction = await contract.addBook(
        bookId,
        title,
        author,
        ipfsHash,
        0,
        FILE_TYPE_ENUM[fileType],
        {
          value: ethers.parseEther("0.02"), // 👈 send exactly 0.02 ETH
        }
      );

      alert("Successfully uploaded book and updated contract.");
      resetForm();
    } catch (error) {
      console.error("Error uploading book:", error);
      alert("Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFileName("No file selected");
    setFile(null);
    setFilePreviewUrl(null);
    setTitle("");
    setAuthor("");
    setFileType("PDF");
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    if (data) {
      setFile(data);
      setFileName(data.name);
    }
    e.preventDefault();
  };

  const renderPreview = () => {
    if (!file || !filePreviewUrl) return null;

    return (
      <div className="w-full h-96 border-2 border-gray-300 rounded-md overflow-hidden mb-4 flex items-center justify-center bg-gray-50">
        {fileType === "PDF" ? (
          <object
            data={filePreviewUrl}
            type="application/pdf"
            className="w-full h-full"
            aria-label="PDF Preview"
          >
            <p className="text-gray-600">
              PDF preview not available. <br /> Please download to view.
            </p>
          </object>
        ) : fileType === "IMAGE" ? (
          <img
            src={filePreviewUrl}
            alt="preview"
            className="object-contain h-full"
          />
        ) : fileType === "VIDEO" ? (
          <video
            src={filePreviewUrl}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="p-4 text-gray-600 text-center">
            <p>
              <strong>{fileName}</strong>
            </p>
            <p>Type: {fileType}</p>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 space-y-8">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
        Upload New Book
      </h2>
      {!account ? (
        <p className="text-center text-red-500">
          Please connect MetaMask to proceed.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderPreview()}

          <div className="space-y-4">
            <input
              disabled={!account}
              type="file"
              id="file-upload"
              name="data"
              onChange={retrieveFile}
              className="block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm italic text-gray-500 break-words">
              File: {fileName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Book Title
              </label>
              <input
                type="text"
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Author
              </label>
              <input
                type="text"
                placeholder="Enter author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                File Type
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 py-2 px-3 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              >
                <option value="PDF">PDF</option>
                <option value="EPUB">EPUB</option>
                <option value="MOBI">MOBI</option>
                <option value="TEXT">TEXT</option>
                <option value="IMAGE">IMAGE</option>
                <option value="VIDEO">VIDEO</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition duration-300 ${
              loading || !file
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Uploading..." : "Upload Book"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookUpload;
