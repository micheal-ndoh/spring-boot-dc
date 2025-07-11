package com.flightbooking.flight_reservation_api;

import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private static final Logger logger = LoggerFactory.getLogger(TicketController.class);

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private MessageSource messageSource;

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Ticket ticket, Locale locale) {
        logger.info("Creating ticket for passenger: {}", ticket.getPassengerName());
        try {
            Ticket saved = ticketRepository.save(ticket);
            logger.info("Ticket created with ID: {}", saved.getId());
            String message = messageSource.getMessage("ticket.created", null, locale);
            return ResponseEntity.ok().body(new ApiResponse(true, message, saved));
        } catch (Exception e) {
            logger.error("Error creating ticket", e);
            String message = messageSource.getMessage("ticket.error", null, locale);
            return ResponseEntity.badRequest().body(new ApiResponse(false, message, null));
        }
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        logger.info("Retrieving all tickets");
        List<Ticket> tickets = ticketRepository.findAll();
        logger.info("Found {} tickets", tickets.size());
        return tickets;
    }

    @GetMapping("/search")
    public List<Ticket> searchTickets(
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String destinationAddress,
            @RequestParam(required = false) String kickoffAddress) {
        logger.info("Searching tickets with address: {}, destinationAddress: {}, kickoffAddress: {}", address, destinationAddress, kickoffAddress);
        List<Ticket> result;
        if (address != null) {
            result = ticketRepository.findByAddressContainingIgnoreCase(address);
        } else if (destinationAddress != null) {
            result = ticketRepository.findByDestinationAddressContainingIgnoreCase(destinationAddress);
        } else if (kickoffAddress != null) {
            result = ticketRepository.findByKickoffAddressContainingIgnoreCase(kickoffAddress);
        } else {
            result = ticketRepository.findAll();
        }
        logger.info("Found {} tickets for search", result.size());
        return result;
    }

    @PutMapping("/{id}")
    public Ticket updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        logger.info("Updating ticket with ID: {}", id);
        return ticketRepository.findById(id)
                .map(existing -> {
                    existing.setPassengerName(ticket.getPassengerName());
                    existing.setAddress(ticket.getAddress());
                    existing.setDestinationAddress(ticket.getDestinationAddress());
                    existing.setKickoffAddress(ticket.getKickoffAddress());
                    existing.setFlightDate(ticket.getFlightDate());
                    Ticket updated = ticketRepository.save(existing);
                    logger.info("Ticket updated with ID: {}", updated.getId());
                    return updated;
                })
                .orElseThrow(() -> {
                    logger.warn("Ticket with ID {} not found for update", id);
                    return new RuntimeException("Ticket not found");
                });
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Long id) {
        logger.info("Deleting ticket with ID: {}", id);
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            logger.info("Ticket deleted with ID: {}", id);
        } else {
            logger.warn("Ticket with ID {} not found for deletion", id);
            throw new RuntimeException("Ticket not found");
        }
    }
}
