import logo from "./logo.svg";
import "./App.css";

import React, { useEffect, useState } from "react";
import { TicketControllerApi, Configuration } from "./react-api-client";

const api = new TicketControllerApi(
  new Configuration({ basePath: "http://localhost:8080" })
);

function App() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchForm, setSearchForm] = useState({
    address: '',
    destinationAddress: '',
    kickoffAddress: '',
  });
  const [form, setForm] = useState({
    passengerName: '',
    address: '',
    destinationAddress: '',
    kickoffAddress: '',
    flightDate: '',
  });

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const ticketsData = await api.getAllTickets();
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error loading tickets:', error);
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
      if (searchForm.destinationAddress) searchParams.destinationAddress = searchForm.destinationAddress;
      if (searchForm.kickoffAddress) searchParams.kickoffAddress = searchForm.kickoffAddress;
      
      const ticketsData = await api.searchTickets(searchParams);
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error searching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Do not send id field
      const { passengerName, address, destinationAddress, kickoffAddress, flightDate } = form;
      await api.createTicket({
        ticket: {
          passengerName,
          address,
          destinationAddress,
          kickoffAddress,
          flightDate: new Date(flightDate),
        },
      });
      setForm({ passengerName: '', address: '', destinationAddress: '', kickoffAddress: '', flightDate: '' });
      await loadTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const startEdit = (ticket: any) => {
    setEditingTicket({
      ...ticket,
      flightDate: new Date(ticket.flightDate).toISOString().split('T')[0]
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
      console.error('Error updating ticket:', error);
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
      console.error('Error deleting ticket:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      {/* Animated Airplanes */}
      <div className="airplane">✈️</div>
      <div className="airplane">🛩️</div>
      <div className="airplane">🚁</div>
      <div className="airplane">🛫</div>
      <div className="airplane">🛬</div>
      <div className="airplane">✈️</div>

      {/* Header with 3D Animation and Dark Mode Toggle */}
      <div className="header">
        <h1>✈️ Flight Ticket Manager</h1>
        <button 
          className={`dark-mode-toggle ${darkMode ? 'active' : ''}`}
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div className="toggle-icon">
            <div className="sun-icon">☀️</div>
            <div className="moon-icon">🌙</div>
          </div>
          <div className="toggle-slider"></div>
          <div className="toggle-glow"></div>
        </button>
      </div>

      {/* Search Form */}
      <div className="form-container">
        <h2>🔍 Search Tickets</h2>
        <form onSubmit={handleSearch}>
          <div className="form-grid">
            <div className="form-input">
              <input
                name="address"
                placeholder="Search by Address"
                value={searchForm.address}
                onChange={handleSearchChange}
              />
            </div>
            <div className="form-input">
              <input
                name="destinationAddress"
                placeholder="Search by Destination"
                value={searchForm.destinationAddress}
                onChange={handleSearchChange}
              />
            </div>
            <div className="form-input">
              <input
                name="kickoffAddress"
                placeholder="Search by Kickoff"
                value={searchForm.kickoffAddress}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="submit-btn">
              🔍 Search
            </button>
            <button 
              type="button" 
              className="submit-btn"
              onClick={loadTickets}
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)' }}
            >
              🔄 Reset
            </button>
          </div>
        </form>
      </div>

      {/* Ticket Creation Form */}
      <div className="form-container">
        <h2>🎫 Create New Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-input">
              <input
                name="passengerName"
                placeholder="Passenger Name"
                value={form.passengerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-input">
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-input">
              <input
                name="destinationAddress"
                placeholder="Destination Address"
                value={form.destinationAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-input">
              <input
                name="kickoffAddress"
                placeholder="Kickoff Address"
                value={form.kickoffAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-input">
              <input
                name="flightDate"
                type="date"
                placeholder="Flight Date"
                value={form.flightDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Create Ticket
          </button>
        </form>
      </div>

      {/* Tickets Display */}
      <div className="tickets-container">
        <h2>📋 All Tickets</h2>
        {loading ? (
          <div className="loading">🔄 Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            🎫 No tickets found. Create your first ticket above!
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
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
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
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)'
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
                      <span className="ticket-label">Passenger:</span>
                      <span className="ticket-value">{ticket.passengerName}</span>
                    </div>
                    <div className="ticket-field">
                      <span className="ticket-label">Address:</span>
                      <span className="ticket-value">{ticket.address}</span>
                    </div>
                    <div className="ticket-field">
                      <span className="ticket-label">Destination:</span>
                      <span className="ticket-value">{ticket.destinationAddress}</span>
                    </div>
                    <div className="ticket-field">
                      <span className="ticket-label">Kickoff:</span>
                      <span className="ticket-value">{ticket.kickoffAddress}</span>
                    </div>
                    <div className="ticket-field">
                      <span className="ticket-label">Flight Date:</span>
                      <span className="ticket-value">{formatDate(ticket.flightDate)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button 
                        type="button" 
                        className="submit-btn"
                        onClick={() => startEdit(ticket)}
                        style={{ flex: 1, fontSize: '14px' }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        type="button" 
                        className="submit-btn"
                        onClick={() => confirmDelete(ticket.id)}
                        style={{ 
                          flex: 1, 
                          fontSize: '14px',
                          background: 'linear-gradient(135deg, rgba(255,100,100,0.3) 0%, rgba(255,100,100,0.2) 100%)'
                        }}
                      >
                        🗑️ Delete
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
            <h3>Confirm Update</h3>
            <p>Are you sure you want to update this ticket?</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                className="submit-btn"
                onClick={handleUpdate}
                style={{ flex: 1 }}
              >
                ✅ Confirm Update
              </button>
              <button 
                className="submit-btn"
                onClick={() => setShowUpdateConfirm(null)}
                style={{ 
                  flex: 1,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this ticket? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                className="submit-btn"
                onClick={handleDelete}
                style={{ 
                  flex: 1,
                  background: 'linear-gradient(135deg, rgba(255,100,100,0.3) 0%, rgba(255,100,100,0.2) 100%)'
                }}
              >
                🗑️ Confirm Delete
              </button>
              <button 
                className="submit-btn"
                onClick={() => setShowDeleteConfirm(null)}
                style={{ 
                  flex: 1,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
