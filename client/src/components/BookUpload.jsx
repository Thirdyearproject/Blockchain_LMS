/* File: BookUpload.jsx */
import React, { useState } from "react";
import axios from "axios";
import { id } from "ethers";

const BookUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [clearance, setClearance] = useState(1);
  const [fileType, setFileType] = useState("PDF");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && title && author) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Pin the file to IPFS using Pinata
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `YOUR_PINATA_API_KEY`,
            pinata_secret_api_key: `YOUR_PINATA_SECRET_API_KEY`,
            "Content-Type": "multipart/form-data",
          },
        });

        const ipfsHash = resFile.data.IpfsHash;
        const bookId = id(title + author); // Use the id function directly

        // Call the smart contract to add the uploaded book
        const transaction = await contract.addBook(
          bookId,
          title,
          author,
          ipfsHash,
          clearance,
          fileType
        );
        await transaction.wait();

        alert("Successfully uploaded book and updated contract");
        resetForm();
      } catch (e) {
        console.error("Error uploading book:", e);
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
    setTitle("");
    setAuthor("");
    setClearance(1);
    setFileType("PDF");
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    setFile(data);
    setFileName(data.name);
    e.preventDefault();
  };

  // Styles
  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      maxWidth: "500px",
      margin: "0 auto",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "5px",
    },
    input: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    buttonDisabled: {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
    textArea: {
      marginTop: "10px",
      fontStyle: "italic",
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="file-upload" style={styles.label}>
          Choose Book File
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
          style={styles.input}
        />
        <span style={styles.textArea}>File: {fileName}</span>

        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Clearance Level (1-5)"
          value={clearance}
          onChange={(e) => setClearance(e.target.value)}
          min="1"
          max="5"
          required
          style={styles.input}
        />
        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          required
          style={styles.input}
        >
          <option value="PDF">PDF</option>
          <option value="EPUB">EPUB</option>
          <option value="MOBI">MOBI</option>
          <option value="TEXT">TEXT</option>
          <option value="IMAGE">IMAGE</option>
          <option value="VIDEO">VIDEO</option>
        </select>

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading || !file ? styles.buttonDisabled : {}),
          }}
          disabled={!file || loading}
        >
          {loading ? "Uploading..." : "Upload Book"}
        </button>
      </form>
    </div>
  );
};

export default BookUpload;
