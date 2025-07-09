package com.flightbooking.flight_reservation_api;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
public class TicketControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Ticket ticket;

    @BeforeEach
    void setUp() {
        ticket = new Ticket();
        ticket.setPassengerName("Test User");
        ticket.setAddress("Test Address");
        ticket.setDestinationAddress("Test Destination");
        ticket.setKickoffAddress("Test Kickoff");
        ticket.setFlightDate(LocalDate.now());
    }

    @Test
    void testCreateAndGetAllTickets() throws Exception {
        // Create ticket
        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ticket)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists());

        // Get all tickets
        mockMvc.perform(get("/api/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].passengerName").value("Test User"));
    }

    @Test
    void testUpdateTicket() throws Exception {
        // Create ticket
        String response = mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ticket)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        Ticket created = objectMapper.readValue(response, Ticket.class);

        // Update ticket
        created.setPassengerName("Updated User");
        mockMvc.perform(put("/api/tickets/" + created.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.passengerName").value("Updated User"));
    }

    @Test
    void testDeleteTicket() throws Exception {
        // Create ticket
        String response = mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ticket)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        Ticket created = objectMapper.readValue(response, Ticket.class);

        // Delete ticket
        mockMvc.perform(delete("/api/tickets/" + created.getId()))
                .andExpect(status().isOk());
    }
} 