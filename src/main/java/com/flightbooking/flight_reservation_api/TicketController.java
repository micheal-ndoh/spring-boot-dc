package com.flightbooking.flight_reservation_api;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        logger.info("Creating ticket for passenger: {}", ticket.getPassengerName());
        Ticket saved = ticketRepository.save(ticket);
        logger.info("Ticket created with ID: {}", saved.getId());
        return saved;
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
}
