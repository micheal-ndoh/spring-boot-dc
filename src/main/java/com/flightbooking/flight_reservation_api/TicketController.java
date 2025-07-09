package com.flightbooking.flight_reservation_api;

import java.util.List;

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

    @Autowired
    private TicketRepository ticketRepository;

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @GetMapping("/search")
    public List<Ticket> searchTickets(
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String destinationAddress,
            @RequestParam(required = false) String kickoffAddress) {
        if (address != null) {
            return ticketRepository.findByAddressContainingIgnoreCase(address);
        } else if (destinationAddress != null) {
            return ticketRepository.findByDestinationAddressContainingIgnoreCase(destinationAddress);
        } else if (kickoffAddress != null) {
            return ticketRepository.findByKickoffAddressContainingIgnoreCase(kickoffAddress);
        } else {
            return ticketRepository.findAll();
        }
    }
}
