import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../Dashboard/Navbar";
import ELibrary from "../../build/contracts/BookManager.json";
import { RPC_URL } from "../../services/apis";

// 1746774890805;

function GuestDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContract = async () => {
      try {
        // 1. Connect to blockchain
        const provider = new ethers.JsonRpcProvider(RPC_URL);

        // 2. Get network information
        const networkId = Object.keys(ELibrary.networks)[0];
        console.log("Connected networkId:", networkId);

        // 3. Get deployed network data from JSON
        const networkData = ELibrary.networks[networkId];

        if (!networkData || !networkData.address) {
          console.error(`Contract not deployed on network ${networkId}`);
          return;
        }

        // 4. Create contract instance
        const contract = new ethers.Contract(
          networkData.address,
          ELibrary.abi,
          provider
        );

        console.log("Contract loaded:", contract.target);

        // 5. Fetch books
        const booksCount = await contract.getBooksCount();
        console.log("Books count:", booksCount.toString());

        const booksArray = [];

        for (let i = 0; i < booksCount; i++) {
          const book = await contract.getBook(i);
          booksArray.push(book.title); // Only title
        }

        setBooks(booksArray);
      } catch (error) {
        console.error("Error loading contract or fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContract();
  }, []);

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen w-full p-4">
      <Navbar name="Guest Dashboard" />

      <div className="w-full flex flex-col gap-6 mx-auto mt-8">
        <h2 className="text-2xl font-bold text-center">Library Books</h2>

        {loading ? (
          <p className="text-center">Loading books...</p>
        ) : books.length > 0 ? (
          <div className="flex flex-col gap-4">
            {books.map((title, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow-md text-lg">
                {idx + 1}. {title}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No books available</p>
        )}
      </div>
    </div>
  );
}

export default GuestDashboard;
