import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const StoreContext = createContext(null);
const PRODUCTS_URL = "https://fakestoreapi.com/products";
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack",
    price: 109.95,
    description:
      "Your everyday carry for work, weekends, and weeknight adventures.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirt",
    price: 22.3,
    description:
      "A refined silhouette with a soft hand feel and easy daily styling.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: "Women's Cotton Jacket",
    price: 55.99,
    description:
      "A polished layer for cool mornings, city commutes, and weekend plans.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: "Wireless Bluetooth Headphones",
    price: 89.99,
    description:
      "Balanced sound, all-day comfort, and a clean everyday design.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.3, count: 318 },
  },
  {
    id: 5,
    title: "John Hardy Women's Bracelet",
    price: 695,
    description:
      "A statement piece designed to feel personal and polished.",
    category: "jewelery",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 6,
    title: "Lightning Bolt Running Sneakers",
    price: 34.99,
    description:
      "Built for everyday movement with a fresh everyday finish.",
    category: "shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.4, count: 180 },
  },
];

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    if (error instanceof SyntaxError) {
      window.localStorage.removeItem(key);
      return fallback;
    }
    throw error;
  }
}

function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("Store components must be rendered inside StoreProvider.");
  }
  return store;
}

function StoreProvider({ children }) {
  const [theme, setTheme] = useState(() => readStorage("nova-theme", "light"));
  const [user, setUser] = useState(() => readStorage("nova-user", null));
  const [cart, setCart] = useState(() => readStorage("nova-cart", []));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("nova-theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("nova-user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem("nova-cart", JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  function addToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...currentCart, { product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== productId),
    );
  }

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      user,
      setUser,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
    }),
    [theme, user, cart, cartCount, cartTotal],
  );

  return (
    <StoreContext.Provider value={value}>
      <div className="app-shell">
        <Header />
        <main className="page-content">
          {children}
        </main>
        <Footer />
      </div>
    </StoreContext.Provider>
  );
}

function Header() {
  const { theme, setTheme, user, cartCount, setUser } = useStore();
  const navigate = useNavigate();

  function signOut() {
    setUser(null);
    navigate("/login");
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to={user ? "/products" : "/login"} aria-label="Nova Market home">
          <span className="brand-mark">n</span>
          <span>nova<span className="brand-light">market</span></span>
        </Link>
        {user ? (
          <nav className="main-nav" aria-label="Main navigation">
            <Link to="/products">Shop</Link>
            <Link className="cart-nav-link" to="/cart">
              Bag <span className="cart-count">{cartCount}</span>
            </Link>
          </nav>
        ) : (
          <div className="header-auth">
            <Link to="/login">Sign in</Link>
            <Link className="header-join" to="/register">Create account</Link>
          </div>
        )}
        <div className="header-actions">
          {user && <span className="welcome-label">Hi, {user.name.split(" ")[0]}</span>}
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          {user && (
            <button className="sign-out-button" type="button" onClick={signOut}>
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function AppRoutes() {
  const { user } = useStore();
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/products" : "/login"} replace />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route element={<RequireAuth />}>
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function RequireAuth() {
  const { user } = useStore();
  const location = useLocation();
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { user, setUser } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/products" replace />;

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (form.password.trim().length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }
    setUser({
      name: isRegister ? form.name.trim() : form.email.split("@")[0],
      email: form.email.trim(),
    });
    navigate("/products", { replace: true });
  }

  return (
    <section className="auth-layout">
      <div className="auth-art">
        <div className="auth-art-top">
          <span className="eyebrow light-eyebrow">A little more you</span>
          <span className="art-sparkle" aria-hidden="true">✳</span>
        </div>
        <div>
          <p className="auth-quote">Good things<br />find their way<br /><em>to you.</em></p>
          <p className="auth-caption">Thoughtful finds for wherever life takes you.</p>
        </div>
        <div className="art-orbit" aria-hidden="true"><span>n</span></div>
        <div className="auth-art-bottom"><span>EST. 2024</span><span>MADE FOR EVERYDAY</span></div>
      </div>
      <div className="auth-panel">
        <span className="eyebrow">{isRegister ? "YOUR NEXT CHAPTER" : "WELCOME BACK"}</span>
        <h1>{isRegister ? "Make yourself at home." : "Good to see you again."}</h1>
        <p className="auth-intro">
          {isRegister
            ? "Create an account and find your new everyday favorites."
            : "Sign in to pick up right where the good finds left off."}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Your name
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Alex Morgan"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
          )}
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="At least 6 characters"
              minLength={6}
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button auth-submit" type="submit">
            {isRegister ? "Create your account" : "Sign in"} <ArrowIcon />
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? "Already part of Nova?" : "New around here?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>
        <p className="demo-note">Demo shop — any email and 6+ character password will do.</p>
      </div>
    </section>
  );
}

function useProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2500);

    async function loadProducts() {
      try {
        const response = await fetch(PRODUCTS_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`The product service returned ${response.status}.`);
        }
        const data = await response.json();
        if (!Array.isArray(data) || !data.length) {
          throw new Error("The product service returned an unexpected response.");
        }
        setProducts(data);
        setStatus("success");
      } catch (fetchError) {
        setProducts(FALLBACK_PRODUCTS);
        setError("");
        setStatus("success");
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  return { products, status, error };
}

function ProductListing() {
  const { products, status, error } = useProducts();
  const { addToCart } = useStore();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const categories = [...new Set(products.map((product) => product.category))];
  const visibleProducts = products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesQuery = product.title.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error} />;

  return (
    <div className="shop-page">
      <section className="shop-hero">
        <div className="hero-copy">
          <span className="eyebrow">THE EVERYDAY EDIT · VOL. 01</span>
          <h1>Little things.<br /><em>Lovely living.</em></h1>
          <p>Considered pieces for the everyday moments that make a life.</p>
          <a className="hero-link" href="#collection">Explore the collection <ArrowIcon /></a>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame">
            <img
              src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"
              alt="A timeless everyday backpack"
            />
          </div>
          <div className="hero-stamp"><span>THE</span><strong>GOOD<br />STUFF</strong><span>FOUND HERE</span></div>
          <div className="hero-note">Made for your<br />kind of everyday <span>↗</span></div>
        </div>
        <div className="hero-index"><span>01 — 04</span><span>CURATED FOR YOU</span></div>
      </section>

      <section className="collection-section" id="collection">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A FEW THINGS WE LOVE</span>
            <h2>Find your <em>favorite.</em></h2>
          </div>
          <span className="results-count">{visibleProducts.length} lovely finds</span>
        </div>
        <div className="collection-tools">
          <div className="category-filters" aria-label="Filter products by category">
            <button
              className={category === "all" ? "filter-chip active" : "filter-chip"}
              onClick={() => setCategory("all")}
              type="button"
            >
              Everything
            </button>
            {categories.map((item) => (
              <button
                className={category === item ? "filter-chip active" : "filter-chip"}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {formatCategory(item)}
              </button>
            ))}
          </div>
          <label className="search-box">
            <SearchIcon />
            <input
              type="search"
              placeholder="Find something..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search products"
            />
          </label>
        </div>
        {visibleProducts.length ? (
          <div className="product-grid">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAdd={() => addToCart(product)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-search">
            <h3>No finds this time.</h3>
            <p>Try another search or choose a different collection.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product, index, onAdd }) {
  const [added, setAdded] = useState(false);
  const rating = product.rating?.rate ?? 0;

  function handleAdd() {
    onAdd();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="product-card">
      <Link className="product-image" to={`/products/${product.id}`} aria-label={`View ${product.title}`}>
        <span className="product-number">{String(index + 1).padStart(2, "0")}</span>
        <img src={product.image} alt={product.title} loading="lazy" />
        <span className="view-product">View piece <ArrowIcon /></span>
      </Link>
      <div className="product-meta">
        <span>{formatCategory(product.category)}</span>
        <span className="rating"><span aria-hidden="true">★</span> {rating.toFixed(1)}</span>
      </div>
      <div className="product-card-bottom">
        <div>
          <Link className="product-title" to={`/products/${product.id}`}>{product.title}</Link>
          <span className="product-price">${product.price.toFixed(2)}</span>
        </div>
        <button className="add-button" type="button" onClick={handleAdd} aria-label={`Add ${product.title} to bag`}>
          {added ? <CheckIcon /> : <PlusIcon />}
        </button>
      </div>
    </article>
  );
}

function ProductDetails() {
  const { productId } = useParams();
  const { products, status, error } = useProducts();
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error} />;

  const product = products.find((item) => String(item.id) === productId);
  if (!product) return <NotFound />;

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <section className="detail-page">
      <Link className="back-link" to="/products"><ArrowIcon /> Back to the collection</Link>
      <div className="detail-layout">
        <div className="detail-image-wrap">
          <span className="detail-image-label">A NOVA FIND</span>
          <img src={product.image} alt={product.title} />
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{formatCategory(product.category)}</span>
          <h1>{product.title}</h1>
          <div className="detail-rating">
            <span aria-label={`${product.rating.rate} out of 5 stars`}>★ {product.rating.rate.toFixed(1)}</span>
            <span>({product.rating.count} reviews)</span>
          </div>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-description">{product.description}</p>
          <button className="primary-button detail-add" type="button" onClick={handleAdd}>
            {added ? "Added to your bag" : "Add to your bag"}
            {added ? <CheckIcon /> : <ArrowIcon />}
          </button>
          <div className="detail-promises">
            <span><CheckIcon /> Thoughtfully picked</span>
            <span><CheckIcon /> Easy 30-day returns</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CartPage() {
  const { cart, cartTotal, removeFromCart } = useStore();
  return (
    <section className="cart-page">
      <div className="cart-heading">
        <div>
          <span className="eyebrow">YOUR LITTLE COLLECTION</span>
          <h1>Your bag<span className="heading-period">.</span></h1>
        </div>
        <Link className="back-link" to="/products"><ArrowIcon /> Keep browsing</Link>
      </div>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-bag-icon"><BagIcon /></div>
          <h2>Nothing in your bag. <em>Yet.</em></h2>
          <p>There are lovely things waiting to be found.</p>
          <Link className="primary-button" to="/products">Explore the collection <ArrowIcon /></Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-list-heading"><span>YOUR FINDS</span><span>{cart.length} {cart.length === 1 ? "ITEM" : "ITEMS"}</span></div>
            {cart.map(({ product, quantity }) => (
              <article className="cart-item" key={product.id}>
                <Link className="cart-item-image" to={`/products/${product.id}`}>
                  <img src={product.image} alt={product.title} />
                </Link>
                <div className="cart-item-info">
                  <span className="eyebrow">{formatCategory(product.category)}</span>
                  <Link to={`/products/${product.id}`} className="cart-item-title">{product.title}</Link>
                  <span className="cart-quantity">Qty {quantity}</span>
                </div>
                <div className="cart-item-end">
                  <strong>${(product.price * quantity).toFixed(2)}</strong>
                  <button type="button" className="remove-button" onClick={() => removeFromCart(product.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <span className="eyebrow">THE TOTAL</span>
            <div className="summary-line"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div className="summary-line"><span>Shipping</span><span className="free-shipping">On us</span></div>
            <div className="summary-total"><span>Total</span><strong>${cartTotal.toFixed(2)}</strong></div>
            <button className="primary-button checkout-button" type="button" onClick={() => window.alert("Thanks for shopping with Nova! Checkout is a demo.")}>
              Continue to checkout <ArrowIcon />
            </button>
            <p className="checkout-note">Shipping and taxes calculated at checkout.</p>
          </aside>
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <Link className="brand footer-brand" to="/products">
        <span className="brand-mark">n</span>
        <span>nova<span className="brand-light">market</span></span>
      </Link>
      <span>Good things for the everyday.</span>
      <span>© 2025 NOVA MARKET</span>
    </footer>
  );
}

function LoadingState() {
  return (
    <div className="state-message" role="status">
      <span className="loading-mark">n</span>
      <p>Finding the good things...</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="state-message error-state" role="alert">
      <h2>We couldn’t find the collection.</h2>
      <p>{message}</p>
      <button className="secondary-button" onClick={() => window.location.reload()} type="button">
        Try again
      </button>
    </div>
  );
}

function NotFound() {
  return (
    <section className="not-found">
      <span className="eyebrow">A LITTLE OFF THE MAP</span>
      <h1>This page took<br /><em>a wrong turn.</em></h1>
      <Link className="primary-button" to="/products">Back to the good stuff <ArrowIcon /></Link>
    </section>
  );
}

function formatCategory(category) {
  return category.replace(/(^| )\w/g, (part) => part.toUpperCase());
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function PlusIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}

function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="m4.5 10 3.7 3.7 7.3-7.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" strokeWidth="1.4" /><path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
}

function MoonIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16.6 12.4A7 7 0 0 1 7.5 3.3a7 7 0 1 0 9.1 9.1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SunIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3.3" stroke="currentColor" strokeWidth="1.4" /><path d="M10 1.8v2m0 12.4v2m8.2-8.2h-2M3.8 10h-2m14-5.8-1.4 1.4M5.6 14.4l-1.4 1.4m11.6 0-1.4-1.4M5.6 5.6 4.2 4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
}

function BagIcon() {
  return <svg aria-hidden="true" viewBox="0 0 32 32" fill="none"><path d="M6.5 11h19l1.7 17H4.8L6.5 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M11 12V8a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

export default function App() {
  return (
    <StoreProvider>
      <AppRoutes />
    </StoreProvider>
  );
}
