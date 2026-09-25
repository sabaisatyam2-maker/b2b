import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { CATEGORY_IMAGES, DEFAULT_CATEGORY_IMAGE, FALLBACK_BLURBS } from "../utils/categoryData";

export default function Services() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/listings/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const goToCategory = (name) => navigate(`/browse?category=${encodeURIComponent(name)}`);

  return (
    <div className="container" style={{ padding: "36px 24px 64px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>All Services</h1>
      <p style={{ color: "var(--muted)", marginBottom: 32, maxWidth: 600 }}>
        Browse our complete directory of services. Click on any category to view verified providers and businesses offering these solutions.
      </p>

      <div className="cat-grid">
        {(categories.length ? categories : Object.keys(FALLBACK_BLURBS).map((name) => ({ name }))).map((c, i) => (
          <button
            key={c._id || c.name}
            className="cat-card"
            style={{ textAlign: "left", cursor: "pointer" }}
            onClick={() => goToCategory(c.name)}
          >
            <img src={CATEGORY_IMAGES[c.name] || DEFAULT_CATEGORY_IMAGE} alt={c.name} className="cat-img" />
            <div className="cat-content">
              <div className="cat-index">{String(i + 1).padStart(2, "0")}</div>
              <h4>{c.name}</h4>
              <p>{FALLBACK_BLURBS[c.name] || "Verified providers in this category."}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
