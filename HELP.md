# Learning what the helly just happen here

## Assignment Goals

1. Build a REST API server that manages flight reservations for micro-companies.
2. Be able to create and retrieve reservations.
3. Tickets should be searchable by address, destination address, and kickoff address.
4. Tickets should be saved in a PostgreSQL database.
5. Use an ORM (Spring Data JPA).

---

## How Each Goal is Achieved

### 1. REST API Server for Flight Reservations

- The project uses **Spring Boot** to create a RESTful API server.
- The main entry point is `FlightReservationApiApplication.java`.
- The `TicketController.java` class exposes REST endpoints for managing tickets:
  - `POST /api/tickets` to create a ticket
  - `GET /api/tickets` to retrieve all tickets
  - `GET /api/tickets/search` to search tickets
  - `PUT /api/tickets/{id}` to update a ticket
  - `DELETE /api/tickets/{id}` to delete a ticket

### 2. Create and Retrieve Reservations

- **Create:**
  - The `createTicket` method in `TicketController` handles POST requests to add new tickets.
- **Retrieve:**
  - The `getAllTickets` method in `TicketController` handles GET requests to fetch all tickets.

### 3. Searchable Tickets

- The `searchTickets` method in `TicketController` allows searching tickets by `address`, `destinationAddress`, or `kickoffAddress` using query parameters.
- The `TicketRepository` interface defines custom finder methods:
  - `findByAddressContainingIgnoreCase`
  - `findByDestinationAddressContainingIgnoreCase`
  - `findByKickoffAddressContainingIgnoreCase`

### 4. PostgreSQL Database Persistence

- The project is configured to use PostgreSQL via `application.properties`:
  - `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password` specify the database connection.
- The `Ticket` entity is mapped to a database table using JPA annotations.
- All ticket data is persisted in the PostgreSQL database.

### 5. ORM (Spring Data JPA)

- The project uses **Spring Data JPA** as the ORM layer.
- The `Ticket` class is annotated with `@Entity`, and fields are mapped to table columns.
- The `TicketRepository` interface extends `JpaRepository`, providing CRUD and custom search operations without writing SQL.

---

## Additional Features

- **Validation:**
  - The `Ticket` entity uses validation annotations (`@NotBlank`, `@NotNull`) to ensure required fields are provided.
- **Logging:**
  - The `TicketController` uses SLF4J logging to record all major events (create, retrieve, search, update, delete).
- **Testing:**
  - The `TicketControllerTest` class uses Spring Boot's MockMvc to test the API endpoints for create, retrieve, update, and delete operations.
- **Documentation:**
  - The `README.md` provides detailed usage instructions, example API calls, and explanations of all configuration and annotations.

---