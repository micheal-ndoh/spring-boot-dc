import logo from "./logo.svg";
import "./App.css";
import "./i18n";

import React, { useEffect, useState, useRef } from "react";
import { TicketControllerApi, Configuration } from "./react-api-client";
import { useTranslation } from "react-i18next";

// Get API URL from runtime config or fallback
const API_BASE_URL =
  (window as any).REACT_APP_API_URL || "http://10.38.229.234:30080";

const api = new TicketControllerApi(
  new Configuration({ basePath: API_BASE_URL })
);

function App() {
  const { t, i18n } = useTranslation();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );
  const [showUpdateConfirm, setShowUpdateConfirm] = useState<number | null>(
    null
  );
  const [darkMode, setDarkMode] = useState(false);
  const [searchForm, setSearchForm] = useState({
    address: "",
    destinationAddress: "",
    kickoffAddress: "",
  });
  const [form, setForm] = useState({
    passengerName: "",
    address: "",
    destinationAddress: "",
    kickoffAddress: "",
    flightDate: "",
  });
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node) &&
        langBtnRef.current &&
        !langBtnRef.current.contains(event.target as Node)
      ) {
        setShowLangDropdown(false);
      }
    }
    if (showLangDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLangDropdown]);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLangDropdown(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const ticketsData = await api.getAllTickets();
      setTickets(ticketsData);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const searchParams: any = {};
      if (searchForm.address) searchParams.address = searchForm.address;
      if (searchForm.destinationAddress)
        searchParams.destinationAddress = searchForm.destinationAddress;
      if (searchForm.kickoffAddress)
        searchParams.kickoffAddress = searchForm.kickoffAddress;

      const ticketsData = await api.searchTickets(searchParams);
      setTickets(ticketsData);
    } catch (error) {
      console.error("Error searching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Do not send id field
      const {
        passengerName,
        address,
        destinationAddress,
        kickoffAddress,
        flightDate,
      } = form;
      await api.createTicket({
        ticket: {
          passengerName,
          address,
          destinationAddress,
          kickoffAddress,
          flightDate: new Date(flightDate),
        },
      });
      setForm({
        passengerName: "",
        address: "",
        destinationAddress: "",
        kickoffAddress: "",
        flightDate: "",
      });
      await loadTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const startEdit = (ticket: any) => {
    setEditingTicket({
      ...ticket,
      flightDate: new Date(ticket.flightDate).toISOString().split("T")[0],
    });
  };

  const cancelEdit = () => {
    setEditingTicket(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTicket({ ...editingTicket, [e.target.name]: e.target.value });
  };

  const confirmUpdate = (ticketId: number) => {
    setShowUpdateConfirm(ticketId);
  };

  const handleUpdate = async () => {
    if (!editingTicket) return;

    try {
      await api.updateTicket({
        id: editingTicket.id,
        ticket: {
          passengerName: editingTicket.passengerName,
          address: editingTicket.address,
          destinationAddress: editingTicket.destinationAddress,
          kickoffAddress: editingTicket.kickoffAddress,
          flightDate: new Date(editingTicket.flightDate),
        },
      });
      setEditingTicket(null);
      setShowUpdateConfirm(null);
      await loadTickets();
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const confirmDelete = (ticketId: number) => {
    setShowDeleteConfirm(ticketId);
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;

    try {
      await api.deleteTicket({ id: showDeleteConfirm });
      setShowDeleteConfirm(null);
      await loadTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      {/* Animated Airplanes */}
      <div className="airplane">✈️</div>
      <div className="airplane">🛩️</div>
      <div className="airplane">🚁</div>
      <div className="airplane">🛫</div>
      <div className="airplane">🛬</div>
      <div className="airplane">✈️</div>

      {/* Header with 3D Animation and Dark Mode Toggle */}
      <div className="header">
        <h1>✈️ {t("app.title", "Flight Ticket Manager")}</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "relative",
          }}
        >
          <button
            className={`dark-mode-toggle ${darkMode ? "active" : ""}`}
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="toggle-icon">
              <div className="sun-icon">☀️</div>
              <div className="moon-icon">🌙</div>
            </div>
            <div className="toggle-slider"></div>
            <div className="toggle-glow"></div>
          </button>
          {/* Language Selector Globe Button */}
          <button
            ref={langBtnRef}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              padding: 4,
              marginLeft: 4,
              position: "relative",
            }}
            title="Change Language"
            onClick={() => setShowLangDropdown((v) => !v)}
            aria-label="Change Language"
          >
            🌐
          </button>
          {showLangDropdown && (
            <div
              ref={langDropdownRef}
              style={{
                position: "absolute",
                top: 38,
                right: 0,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: 6,
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                zIndex: 1000,
                minWidth: 120,
                padding: 6,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button
                  style={{
                    background: i18n.language === "en" ? "#f0f0f0" : "none",
                    border: "none",
                    textAlign: "left",
                    padding: "6px 12px",
                    cursor: "pointer",
                    borderRadius: 4,
                  }}
                  onClick={() => handleLanguageChange("en")}
                >
                  🇺🇸 English
                </button>
                <button
                  style={{
                    background: i18n.language === "fr" ? "#f0f0f0" : "none",
                    border: "none",
                    textAlign: "left",
                    padding: "6px 12px",
                    cursor: "pointer",
                    borderRadius: 4,
                  }}
                  onClick={() => handleLanguageChange("fr")}
                >
                  🇫🇷 Français
                </button>
                <button
                  style={{
                    background: i18n.language === "es" ? "#f0f0f0" : "none",
                    border: "none",
                    textAlign: "left",
                    padding: "6px 12px",
                    cursor: "pointer",
                    borderRadius: 4,
                  }}
                  onClick={() => handleLanguageChange("es")}
                >
                  🇪🇸 Español
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Form */}
      <div className="form-container">
        <h2>{t("search.title", "Search Tickets")}</h2>
        <form onSubmit={handleSearch}>
          <div className="form-grid">
            <div className="form-input">
              <input
                name="address"
                placeholder={t("label.address", "Search by Address")}
                value={searchForm.address}
                onChange={handleSearchChange}
              />
            </div>
            <div className="form-input">
              <input
                name="destinationAddress"
                placeholder={t(
                  "label.destination.address",
                  "Search by Destination"
                )}
                value={searchForm.destinationAddress}
                onChange={handleSearchChange}
              />
            </div>
            <div className="form-input">
              <input
                name="kickoffAddress"
                placeholder={t("label.kickoff.address", "Search by Kickoff")}
                value={searchForm.kickoffAddress}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="submit-btn">
              🔍 {t("search.button", "Search")}
            </button>
            <button
              type="button"
              className="submit-btn"
              onClick={loadTickets}
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)",
              }}
            >
              🔄 {t("search.reset", "Reset")}
            </button>
          </div>
        </form>
      </div>

      {/* Ticket Creation Form */}
      <div className="form-container">
        <h2>{t("create.title", "Create New Ticket")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-input">
              <input
                name="passengerName"
                placeholder={t("label.passenger.name", "Passenger Name")}
                value={form.passengerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-input">
              <input
                name="address"
                placeholder={t("label.address", "Address")}
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-input">
              <input
                name="destinationAddress"
                placeholder={t(
                  "label.destination.address",
                  "Destination Address"
                )}
                value={form.destinationAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-input">
              <input
                name="kickoffAddress"
                placeholder={t("label.kickoff.address", "Kickoff Address")}
                value={form.kickoffAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-input">
              <input
                name="flightDate"
                type="date"
                placeholder={t("label.flight.date", "Flight Date")}
                value={form.flightDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">
            {t("create.button", "Create Ticket")}
          </button>
        </form>
      </div>

      {/* Tickets Display */}
      <div className="tickets-container">
        <h2>{t("tickets.title", "All Tickets")}</h2>
        {loading ? (
          <div className="loading">🔄 {t("loading", "Loading tickets...")}</div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            🎫{" "}
            {t(
              "tickets.empty",
              "No tickets found. Create your first ticket above!"
            )}
          </div>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                {editingTicket?.id === ticket.id ? (
                  // Edit Mode
                  <div className="ticket-info">
                    <div className="form-input">
                      <input
                        name="passengerName"
                        placeholder="Passenger Name"
                        value={editingTicket.passengerName}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-input">
                      <input
                        name="address"
                        placeholder="Address"
                        value={editingTicket.address}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-input">
                      <input
                        name="destinationAddress"
                        placeholder="Destination Address"
                        value={editingTicket.destinationAddress}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-input">
                      <input
                        name="kickoffAddress"
                        placeholder="Kickoff Address"
                        value={editingTicket.kickoffAddress}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-input">
                      <input
                        name="flightDate"
                        type="date"
                        value={editingTicket.flightDate}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "15px",
                      }}
                    >
                      <button
                        type="button"
                        className="submit-btn"
                        onClick={() => confirmUpdate(ticket.id)}
                        style={{ flex: 1 }}
                      >
                        ✅ Save
                      </button>
                      <button
                        type="button"
                        className="submit-btn"
                        onClick={cancelEdit}
                        style={{
                          flex: 1,
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)",
                        }}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="ticket-info">
                    <div className="ticket-field">
                      <span className="ticket-label">
                        {t("label.passenger.name", "Passenger:")}
                      </span>
                      <span className="ticket-value">
                        {ticket.passengerName}
                      </span>
                    </div>
                    <div className="ticket-field">
                      <span className="ticket-label">
                        {t("label.address", "Address:")}
                      </span>
                      <span className="ticket-value">{ticket.address}</span>
                    </div>
                    <div className="ticket-field">
                      <span className="ticket-label">
                        {t("label.destination.address", "Destination:")}
                      </span>
                      <span className="ticket-value">
                        {ticket.destinationAddress}
                      </span>
                    </div>
                    <div className="ticket-field">
                      <span className="ticket-label">
                        {t("label.kickoff.address", "Kickoff:")}
                      </span>
                      <span className="ticket-value">
                        {ticket.kickoffAddress}
                      </span>
                    </div>
                    <div className="ticket-field">
                      <span className="ticket-label">
                        {t("label.flight.date", "Flight Date:")}
                      </span>
                      <span className="ticket-value">
                        {formatDate(ticket.flightDate)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "15px",
                      }}
                    >
                      <button
                        type="button"
                        className="submit-btn"
                        onClick={() => startEdit(ticket)}
                        style={{ flex: 1, fontSize: "14px" }}
                      >
                        ✏️ {t("edit", "Edit")}
                      </button>
                      <button
                        type="button"
                        className="submit-btn"
                        onClick={() => confirmDelete(ticket.id)}
                        style={{
                          flex: 1,
                          fontSize: "14px",
                          background:
                            "linear-gradient(135deg, rgba(255,100,100,0.3) 0%, rgba(255,100,100,0.2) 100%)",
                        }}
                      >
                        🗑️ {t("delete", "Delete")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      {showUpdateConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("edit.confirm.title", "Confirm Update")}</h3>
            <p>
              {t(
                "edit.confirm.message",
                "Are you sure you want to update this ticket?"
              )}
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                className="submit-btn"
                onClick={handleUpdate}
                style={{ flex: 1 }}
              >
                ✅ {t("update", "Update")}
              </button>
              <button
                className="submit-btn"
                onClick={() => setShowUpdateConfirm(null)}
                style={{
                  flex: 1,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)",
                }}
              >
                ❌ {t("cancel", "Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("delete.confirm.title", "Confirm Delete")}</h3>
            <p>
              {t(
                "delete.confirm.message",
                "Are you sure you want to delete this ticket? This action cannot be undone."
              )}
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                className="submit-btn"
                onClick={handleDelete}
                style={{
                  flex: 1,
                  background:
                    "linear-gradient(135deg, rgba(255,100,100,0.3) 0%, rgba(255,100,100,0.2) 100%)",
                }}
              >
                🗑️ {t("delete.confirm.yes", "Confirm Delete")}
              </button>
              <button
                className="submit-btn"
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  flex: 1,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)",
                }}
              >
                ❌ {t("delete.confirm.no", "Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
