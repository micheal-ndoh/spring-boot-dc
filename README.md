# Flight Reservation API

## Overview
This is a Spring Boot REST API for managing flight reservations for micro-companies. It supports creating, retrieving, searching, updating, and deleting flight tickets, with data persisted in a PostgreSQL database.

---

## Annotations and Imports Used

### Entity and Validation (Ticket.java)
- `@Entity` (jakarta.persistence.Entity): Marks the class as a JPA entity for ORM mapping to a database table.
- `@Id` (jakarta.persistence.Id): Specifies the primary key field of the entity.
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` (jakarta.persistence.GeneratedValue): Auto-generates the primary key value using the database's identity column.
- `@NotBlank` (jakarta.validation.constraints.NotBlank): Ensures the annotated string field is not null and not empty (used for required text fields).
- `@NotNull` (jakarta.validation.constraints.NotNull): Ensures the annotated field is not null (used for required non-string fields).

**Imports:**
```java
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
```

### Controller and Logging (TicketController.java)
- `@RestController` (org.springframework.web.bind.annotation.RestController): Marks the class as a REST controller.
- `@RequestMapping` (org.springframework.web.bind.annotation.RequestMapping): Sets the base URL for all endpoints in the controller.
- `@Autowired` (org.springframework.beans.factory.annotation.Autowired): Injects the TicketRepository dependency.
- `@PostMapping`, `@GetMapping`, `@PutMapping`, `@DeleteMapping` (org.springframework.web.bind.annotation.*): Map HTTP methods to controller methods.
- `@RequestBody` (org.springframework.web.bind.annotation.RequestBody): Binds the HTTP request body to a method parameter.
- `@RequestParam` (org.springframework.web.bind.annotation.RequestParam): Binds HTTP query parameters to method parameters.
- `Logger`, `LoggerFactory` (org.slf4j): Used for logging events in the controller.

**Imports:**
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
```

---

## application.properties Fields

```
spring.application.name=FlightReservationAPI
spring.datasource.url=jdbc:postgresql://10.38.229.234:5432/flightdb
spring.datasource.username=mick
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

- `spring.application.name`: The name of the Spring Boot application.
- `spring.datasource.url`: JDBC URL for connecting to the PostgreSQL database (update IP/port as needed).
- `spring.datasource.username`: Database username.
- `spring.datasource.password`: Database password.
- `spring.jpa.hibernate.ddl-auto`: Schema management strategy (`update` keeps schema in sync with entities).
- `spring.jpa.show-sql`: If true, logs SQL statements to the console.
- `spring.jpa.properties.hibernate.dialect`: Specifies the SQL dialect for Hibernate (PostgreSQL).

---

## Example API Usage

### Add a Ticket (Create)
**cURL:**
```sh
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "passengerName": "John Doe",
    "address": "123 Main St",
    "destinationAddress": "456 Elm St",
    "kickoffAddress": "789 Oak St",
    "flightDate": "2024-07-10"
  }'
```
**Browser URL:** N/A (POST request)

### Get All Tickets (Read)
**cURL:**
```sh
curl http://localhost:8080/api/tickets
```
**Browser URL:**
```
http://localhost:8080/api/tickets
```

### Search Tickets
**cURL:**
```sh
curl "http://localhost:8080/api/tickets/search?address=Main"
curl "http://localhost:8080/api/tickets/search?destinationAddress=Elm"
curl "http://localhost:8080/api/tickets/search?kickoffAddress=Oak"
```
**Browser URL:**
```
http://localhost:8080/api/tickets/search?address=Main
http://localhost:8080/api/tickets/search?destinationAddress=Elm
http://localhost:8080/api/tickets/search?kickoffAddress=Oak
```

### Update a Ticket
**cURL:**
```sh
curl -X PUT http://localhost:8080/api/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{
    "passengerName": "Jane Doe",
    "address": "321 Main St",
    "destinationAddress": "654 Elm St",
    "kickoffAddress": "987 Oak St",
    "flightDate": "2024-07-11"
  }'
```
**Browser URL:** N/A (PUT request)

### Delete a Ticket
**cURL:**
```sh
curl -X DELETE http://localhost:8080/api/tickets/1
```
**Browser URL:** N/A (DELETE request)

---

## Notes
- Replace `localhost` with your server's IP if running remotely.
- Update the ticket ID in the URL for update/delete as needed.
- All endpoints return JSON.
- Validation errors will return a 400 Bad Request with details.
