import logo from "./logo.svg";
import "./App.css";
import "./i18n"; // Import i18n configuration

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TicketControllerApi, Configuration } from "./react-api-client";

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
  const [currentLanguage, setCurrentLanguage] = useState("en");
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

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
        <div className="header-content">
          <h1 className="title">✈️ Flight Ticket Manager</h1>
          <div className="header-controls">
            {/* Language Selector - always visible */}
            <div className="language-selector">
              <button
                className={`lang-btn ${
                  currentLanguage === "en" ? "active" : ""
                }`}
                onClick={() => changeLanguage("en")}
              >
                🇺🇸 EN
              </button>
              <button
                className={`lang-btn ${
                  currentLanguage === "fr" ? "active" : ""
                }`}
                onClick={() => changeLanguage("fr")}
              >
                🇫🇷 FR
              </button>
              <button
                className={`lang-btn ${
                  currentLanguage === "es" ? "active" : ""
                }`}
                onClick={() => changeLanguage("es")}
              >
                🇪🇸 ES
              </button>
            </div>
            {/* Dark Mode Toggle */}
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
              <div className="toggle-slider">
                <div className="toggle-icon">🌙</div>
                <div className="toggle-icon">☀️</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search Section */}
        <div className="search-section">
          <h2>{t("search.title", "Search Tickets")}</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <input
                type="text"
                name="address"
                placeholder={t("label.address", "Address")}
                value={searchForm.address}
                onChange={handleSearchChange}
                className="form-input"
              />
              <input
                type="text"
                name="destinationAddress"
                placeholder={t(
                  "label.destination.address",
                  "Destination Address"
                )}
                value={searchForm.destinationAddress}
                onChange={handleSearchChange}
                className="form-input"
              />
              <input
                type="text"
                name="kickoffAddress"
                placeholder={t("label.kickoff.address", "Kickoff Address")}
                value={searchForm.kickoffAddress}
                onChange={handleSearchChange}
                className="form-input"
              />
            </div>
            <button type="submit" className="search-btn">
              🔍 {t("search.button", "Search")}
            </button>
          </form>
        </div>

        {/* Create Ticket Section */}
        <div className="create-section">
          <h2>{t("create.title", "Create New Ticket")}</h2>
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-row">
              <input
                type="text"
                name="passengerName"
                placeholder={t("label.passenger.name", "Passenger Name")}
                value={form.passengerName}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                type="text"
                name="address"
                placeholder={t("label.address", "Address")}
                value={form.address}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="destinationAddress"
                placeholder={t(
                  "label.destination.address",
                  "Destination Address"
                )}
                value={form.destinationAddress}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                type="text"
                name="kickoffAddress"
                placeholder={t("label.kickoff.address", "Kickoff Address")}
                value={form.kickoffAddress}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-row">
              <input
                type="date"
                name="flightDate"
                value={form.flightDate}
                onChange={handleChange}
                className="form-input"
                required
              />
              <button type="submit" className="create-btn">
                ✈️ {t("create.button", "Create Ticket")}
              </button>
            </div>
          </form>
        </div>

        {/* Tickets List */}
        <div className="tickets-section">
          <h2>{t("tickets.title", "All Tickets")}</h2>
          {loading ? (
            <div className="loading">🔄 {t("loading", "Loading...")}</div>
          ) : (
            <div className="tickets-grid">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <h3>{ticket.passengerName}</h3>
                    <div className="ticket-actions">
                      <button
                        onClick={() => startEdit(ticket)}
                        className="edit-btn"
                      >
                        ✏️ {t("edit", "Edit")}
                      </button>
                      <button
                        onClick={() => confirmDelete(ticket.id)}
                        className="delete-btn"
                      >
                        🗑️ {t("delete", "Delete")}
                      </button>
                    </div>
                  </div>
                  <div className="ticket-details">
                    <p>
                      <strong>{t("label.address", "Address")}:</strong>{" "}
                      {ticket.address}
                    </p>
                    <p>
                      <strong>
                        {t("label.destination.address", "Destination")}:
                      </strong>{" "}
                      {ticket.destinationAddress}
                    </p>
                    <p>
                      <strong>{t("label.kickoff.address", "Kickoff")}:</strong>{" "}
                      {ticket.kickoffAddress}
                    </p>
                    <p>
                      <strong>{t("label.flight.date", "Flight Date")}:</strong>{" "}
                      {formatDate(ticket.flightDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTicket && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("edit.title", "Edit Ticket")}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <div className="form-row">
                <input
                  type="text"
                  name="passengerName"
                  placeholder={t("label.passenger.name", "Passenger Name")}
                  value={editingTicket.passengerName}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder={t("label.address", "Address")}
                  value={editingTicket.address}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="destinationAddress"
                  placeholder={t(
                    "label.destination.address",
                    "Destination Address"
                  )}
                  value={editingTicket.destinationAddress}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="kickoffAddress"
                  placeholder={t("label.kickoff.address", "Kickoff Address")}
                  value={editingTicket.kickoffAddress}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="date"
                  name="flightDate"
                  value={editingTicket.flightDate}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="update-btn">
                  ✅ {t("update", "Update")}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="cancel-btn"
                >
                  ❌ {t("cancel", "Cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("delete.confirm.title", "Confirm Delete")}</h3>
            <p>
              {t(
                "delete.confirm.message",
                "Are you sure you want to delete this ticket?"
              )}
            </p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="delete-btn">
                🗑️ {t("delete.confirm.yes", "Yes, Delete")}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="cancel-btn"
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
