package com.flightbooking.flight_reservation_api;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByAddressContainingIgnoreCase(String address);

    List<Ticket> findByDestinationAddressContainingIgnoreCase(String destinationAddress);

    List<Ticket> findByKickoffAddressContainingIgnoreCase(String kickoffAddress);
}
