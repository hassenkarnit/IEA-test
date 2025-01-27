import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);
  const [sortColumn, setSortColumn] = useState("Total Energy Supply");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        console.log(response);

        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let comparison = 0;
    if (sortColumn === "country") {
      comparison = a.country.localeCompare(b.country);
    } else if (sortColumn === "region") {
      comparison = a.region.localeCompare(b.region);
    } else if (sortColumn === "Total Energy Supply") {
      comparison = a["Total energy supply"] - b["Total energy supply"];
    }
    return sortDirection === "asc" ? comparison : comparison * -1;
  });

  const paginatedData = sortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">IEA Data</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th
                className="py-2 px-4 border-b"
                onClick={() => handleSort("country")}
              >
                Country
              </th>
              <th
                className="py-2 px-4 border-b"
                onClick={() => handleSort("region")}
              >
                Region
              </th>
              <th
                className="py-2 px-4 border-b"
                onClick={() => handleSort("Total Energy Supply")}
              >
                Total Energy Supply
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{item.country}</td>
                <td className="py-2 px-4 border-b">{item.region}</td>
                <td className="py-2 px-4 border-b">
                  {item["Total energy supply"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 mx-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
