import { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/ProductService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  
  // Estados para la edición y paginación
  const [editingId, setEditingId] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    loadProducts(skip);
    loadCategories();
  }, [skip]);

  async function loadProducts(currentSkip) {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts(limit, currentSkip);
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    try {
      setLoading(true);
      if (search.trim() === "") {
        setSkip(0);
        await loadProducts(0);
        return;
      }
      const data = await searchProducts(search);
      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCategory(event) {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);

    try {
      setLoading(true);
      if (selectedCategory === "") {
        setSkip(0);
        await loadProducts(0);
        return;
      }
      const data = await getProductsByCategory(selectedCategory);
      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleCreate(event) {
    event.preventDefault();
    try {
      const newProduct = await createProduct({
        ...form,
        price: Number(form.price),
      });

      setProducts([newProduct, ...products]);

      setForm({
        title: "",
        price: "",
        description: "",
      });
    } catch (error) {
      setError(error.message);
    }
  }

  // Paso 14: handleEdit para cargar los datos del producto en el formulario
  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      title: product.title,
      price: product.price,
      description: product.description || "",
    });
  }

  // Paso 14: handleUpdate para guardar los cambios del producto editado
  async function handleUpdate(event) {
    event.preventDefault();
    try {
      const updated = await updateProduct(editingId, {
        ...form,
        price: Number(form.price),
      });

      setProducts(
        products.map((product) =>
          product.id === editingId ? { ...product, ...updated } : product
        )
      );

      setEditingId(null);
      setForm({
        title: "",
        price: "",
        description: "",
      });
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      setError(error.message);
    }
  }

  function handleNextPage() {
    if (skip + limit < total) {
      setSkip(skip + limit);
    }
  }

  function handlePrevPage() {
    if (skip - limit >= 0) {
      setSkip(skip - limit);
    }
  }

  if (loading && products.length === 0) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Productos</h1>

      {/* Formulario dinámico para Crear o Actualizar (Paso 14) */}
      <form
        onSubmit={editingId ? handleUpdate : handleCreate}
        className="product-form"
        style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc" }}
      >
        <h3>{editingId ? "Actualizar Producto" : "Crear Producto"}</h3>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="title"
            placeholder="Nombre"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">
          {editingId ? "Actualizar" : "Guardar"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", price: "", description: "" });
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch} className="search-form" style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {/* Selector de categorías */}
      <select value={category} onChange={handleCategory} style={{ marginBottom: "15px" }}>
        <option value="">Todas las categorías</option>
        {categories.map((item) => {
          const value = item.slug ?? item;
          const label = item.name ?? item;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Controles de Paginación */}
      <div className="pagination-controls" style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <button onClick={handlePrevPage} disabled={skip === 0}>
          Anterior
        </button>
        <span>
          Página {Math.floor(skip / limit) + 1} de {Math.ceil(total / limit) || 1}
        </span>
        <button onClick={handleNextPage} disabled={skip + limit >= total}>
          Siguiente
        </button>
      </div>
    </section>
  );
}

export default Products;