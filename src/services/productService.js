const API_URL = "https://dummyjson.com/products";

export function getProducts(limit = 12, skip = 0) {
  return fetch(API_URL + "?limit=" + limit + "&skip=" + skip).then((res) => {
    if (!res.ok) throw new Error("Error al obtener los productos");
    return res.json();
  });
}

export function searchProducts(query) {
  return fetch(API_URL + "/search?q=" + query).then((res) => {
    if (!res.ok) throw new Error("Error al buscar productos");
    return res.json();
  });
}

export function getCategories() {
  return fetch(API_URL + "/categories").then((res) => {
    if (!res.ok) throw new Error("Error al obtener las categorías");
    return res.json();
  });
}

export function getProductsByCategory(category) {
  return fetch(API_URL + "/category/" + category).then((res) => {
    if (!res.ok) throw new Error("Error al filtrar por categoría");
    return res.json();
  });
}

export function deleteProduct(id) {
  return fetch(API_URL + "/" + id, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error("Error al eliminar el producto");
    return res.json();
  });
}

export function createProduct(productData) {
  return fetch(API_URL + "/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  }).then((res) => {
    if (!res.ok) throw new Error("Error al crear el producto");
    return res.json();
  });
}

// Función del paso 14 (actualizar producto)
export function updateProduct(id, productData) {
  return fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  }).then((res) => {
    if (!res.ok) throw new Error("Error al actualizar el producto");
    return res.json();
  });
}