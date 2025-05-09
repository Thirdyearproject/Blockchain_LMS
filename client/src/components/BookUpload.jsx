import React, { useState, useEffect } from "react";
import axios from "axios";
import { keccak256, toUtf8Bytes, ethers } from "ethers";

import Upload from "../build/contracts/BookManager.json";
import { RPC_URL } from "../services/apis";

const BookUpload = ({ account, privateKey }) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);

  const networkId = Object.keys(Upload.networks)[0];
  console.log("Connected networkId:", networkId);

  const networkData = Upload.networks[networkId];

  if (!networkData || !networkData.address) {
    console.error(`Contract not deployed on network ${networkId}`);
    throw new Error(`Contract not deployed on network ${networkId}`);
  }

  const contract = new ethers.Contract(networkData.address, Upload.abi, wallet);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [clearance, setClearance] = useState(0);
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
    if (file && title && author) {
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
        console.log(
          "Uploaded file URL:",
          `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
        );

        const bookId = keccak256(toUtf8Bytes(title + author));

        const transaction = await contract.proposeBook(
          bookId,
          title,
          author,
          ipfsHash,
          clearance,
          FILE_TYPE_ENUM[fileType] // Map string to numeric value
        );
        await transaction.wait();

        alert("Successfully uploaded book and updated contract");
        resetForm();
      } catch (error) {
        console.error("Error uploading book:", error);
        alert("Unable to upload book to Pinata or update contract");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please fill in all fields and select a file to upload");
    }
  };

  const resetForm = () => {
    setFileName("No file selected");
    setFile(null);
    setFilePreviewUrl(null);
    setTitle("");
    setAuthor("");
    setClearance(0);
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

    switch (fileType) {
      case "IMAGE":
        return (
          <img
            src={filePreviewUrl}
            alt="Book preview"
            className="max-h-48 rounded-md border border-gray-300 object-contain mb-4"
          />
        );
      case "PDF":
        return (
          <embed
            src={filePreviewUrl}
            type="application/pdf"
            className="w-full h-48 rounded-md border border-gray-300 mb-4"
          />
        );
      case "VIDEO":
        return (
          <video
            src={filePreviewUrl}
            controls
            className="w-full h-48 rounded-md border border-gray-300 object-contain mb-4"
          />
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-md border border-gray-300 text-center text-sm text-gray-700 mb-4">
            <p>
              Selected File: <strong>{fileName}</strong>
            </p>
            <p>Type: {fileType}</p>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center md:items-start md:w-1/3">
          {renderPreview()}
          <label
            htmlFor="file-upload"
            className="inline-block cursor-pointer select-none
              bg-gradient-to-r from-blue-300 to-blue-400 
              text-white font-semibold px-4 py-2 rounded-lg 
              shadow-md hover:from-blue-400 hover:to-blue-500 
              transition-colors duration-300 ease-in-out w-full text-center mb-2"
          >
            Choose Book File
          </label>
          <input
            disabled={!account}
            type="file"
            id="file-upload"
            name="data"
            onChange={retrieveFile}
            className="hidden"
          />
          <p className="text-sm italic text-gray-500 text-center md:text-left break-all w-full mb-6">
            File: {fileName}
          </p>
        </div>

        <div className="flex flex-col md:w-2/3 space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block mb-1 font-semibold text-gray-700"
            >
              Book Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 py-2 px-3
                text-gray-900 placeholder-gray-400 focus:border-blue-500
                focus:ring-blue-500 focus:outline-none focus:ring-1"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block mb-1 font-semibold text-gray-700"
            >
              Author
            </label>
            <input
              id="author"
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 py-2 px-3
                text-gray-900 placeholder-gray-400 focus:border-blue-500
                focus:ring-blue-500 focus:outline-none focus:ring-1"
            />
          </div>

          <div>
            <label
              htmlFor="fileType"
              className="block mb-1 font-semibold text-gray-700"
            >
              Book Type
            </label>
            <select
              id="fileType"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 py-2 px-3
                bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500
                focus:outline-none focus:ring-1"
            >
              <option value="PDF">PDF</option>
              <option value="EPUB">EPUB</option>
              <option value="MOBI">MOBI</option>
              <option value="TEXT">TEXT</option>
              <option value="IMAGE">IMAGE</option>
              <option value="VIDEO">VIDEO</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full py-3 rounded-lg text-white font-semibold text-lg
              transition-colors duration-300 ease-in-out shadow-md
              ${
                loading || !file
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-400 hover:bg-blue-500 active:bg-blue-600 cursor-pointer"
              }`}
          >
            {loading ? "Uploading..." : "Upload Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookUpload;
