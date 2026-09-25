import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { gsap } from "../gsapSetup";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const activeCategory = searchParams.get("category") || "";
  const gridRef = useRef(null);

  useEffect(() => {
    api.get("/listings/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (searchParams.get("keyword")) params.keyword = searchParams.get("keyword");
    if (searchParams.get("category")) params.category = searchParams.get("category");
    if (searchParams.get("location")) params.location = searchParams.get("location");
    api.get("/listings", { params })
      .then((res) => setListings(res.data))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  // Every time a new set of results comes in, fade + lift the cards in
  useEffect(() => {
    if (!listings.length || !gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".listing-card", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", clearProps: "all" });
    }, gridRef);
    return () => ctx.revert();
  }, [listings]);

  const applySearch = (e) => {
    e.preventDefault();
    const next = {};
    if (keyword) next.keyword = keyword;
    if (location) next.location = location;
    if (activeCategory) next.category = activeCategory;
    setSearchParams(next);
  };

  const toggleCategory = (name) => {
    const next = Object.fromEntries(searchParams);
    if (activeCategory === name) delete next.category;
    else next.category = name;
    setSearchParams(next);
  };

  return (
    <div className="container" style={{ padding: "36px 24px 64px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Search Vendors</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        {loading ? "Searching…" : `${listings.length} approved listing${listings.length === 1 ? "" : "s"} found`}
      </p>

      <form onSubmit={applySearch} className="search-bar" style={{ marginBottom: 18, maxWidth: 640 }}>
        <input placeholder="Search by business name" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={{ borderLeft: "1px solid var(--border)" }} />
        <button className="btn btn-primary btn-sm">Search</button>
      </form>

      <div className="chip-row" style={{ marginBottom: 28 }}>
        {categories.map((c) => (
          <button
            key={c._id}
            className={`chip ${activeCategory === c.name ? "active" : ""}`}
            onClick={() => toggleCategory(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {!loading && listings.length === 0 && (
        <div className="empty-state">
          <p>No listings match your search yet.</p>
        </div>
      )}

      <div className="listing-grid" ref={gridRef}>
        {listings.map((l) => (
          <Link to={`/listing/${l._id}`} key={l._id} className="listing-card">
            <div className="listing-thumb">
              {l.images?.[0]?.url ? (
                <img src={l.images[0].url} alt={l.businessName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                l.businessName.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="listing-body">
              <div className="listing-cat">{l.category}</div>
              <h4>{l.businessName}</h4>
              <p>{l.description?.slice(0, 80)}{l.description?.length > 80 ? "…" : ""}</p>
              <div className="listing-meta">
                <span>{l.price ? `₹ ${l.price} • ` : ""}{l.location}</span>
                <span>View details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}



