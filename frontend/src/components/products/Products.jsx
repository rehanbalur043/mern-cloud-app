// frontend/src/components/products/Products.jsx

import React, { useState, useEffect } from "react";
import api from "../../services/apiService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  // Add‑product form state (admin only)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName]         = useState("");
  const [newQty, setNewQty]           = useState("");

  const userRole = localStorage.getItem("userRole") || "user"; // default "user"

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts();
      setProducts(data.products || data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddClick = () => {
    if (userRole !== "admin") return;
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setNewName("");
    setNewQty("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const qtyNumber = Number(newQty);
    if (!newName.trim() || !newQty || qtyNumber <= 0) {
      alert("Please enter a valid product name and quantity.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: newName.trim(),
        description: "Added from UI",
        price: 0,
        category: "Other",
        stock: qtyNumber,
      };

      await api.createProduct(payload);

      setShowAddForm(false);
      setNewName("");
      setNewQty("");
      await fetchProducts();
    } catch (err) {
      console.error("Create product error:", err);
      setError(
        err.response?.data?.message || "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = userRole === "admin";

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>Products</h2>

        {isAdmin && (
          <button onClick={handleAddClick}>
            ADD PRODUCT
          </button>
        )}
      </div>

      {isAdmin && showAddForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <input
            type="text"
            placeholder="Product name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newQty}
            onChange={(e) => setNewQty(e.target.value)}
            min="1"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "0.5rem",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Name
            </th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Quantity
            </th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Category
            </th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Price
            </th>
            {isAdmin && (
              <th
                style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 5 : 4} style={{ paddingTop: "0.75rem" }}>
                No products found.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: "0.5rem 0" }}>{p.name}</td>
                <td style={{ padding: "0.5rem 0" }}>{p.stock}</td>
                <td style={{ padding: "0.5rem 0" }}>{p.category}</td>
                <td style={{ padding: "0.5rem 0" }}>{p.price}</td>
                {isAdmin && (
                  <td style={{ padding: "0.5rem 0" }}>
                    {/* Placeholder for future edit/delete buttons */}
                    {/* <button>Edit</button>
                    <button>Delete</button> */}
                    Admin
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
