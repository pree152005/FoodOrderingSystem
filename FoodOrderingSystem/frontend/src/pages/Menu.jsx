import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, menuItems } from "../data/menuData";
import FoodCard from "../components/FoodCard";

export default function Menu() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const activeCategory = searchParams.get("category") || "all";

    const filteredItems = useMemo(() => {
        return menuItems.filter((item) => {
            const matchesCategory = activeCategory === "all" || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, search]);

    const handleCategoryClick = (catId) => {
        if (catId === "all") {
            setSearchParams({});
        } else {
            setSearchParams({ category: catId });
        }
    };

    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h1 className="section-title d-inline-block">Our Menu</h1>
                <p className="text-muted">Handpicked dishes made fresh, just for you.</p>
            </div>

            {/* Search */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <div className="input-group search-bar">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search for dishes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Category Filters */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`filter-chip ${activeCategory === cat.id ? "active" : ""}`}
                        onClick={() => handleCategoryClick(cat.id)}
                    >
                        <i className={`bi ${cat.icon} me-1`}></i>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Results */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-emoji-frown display-4 text-muted"></i>
                    <p className="text-muted mt-3">No dishes found. Try a different search.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredItems.map((item) => (
                        <FoodCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}
