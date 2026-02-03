package com.example.Backend.controller;



import com.example.Backend.model.ChatMessage;
import com.example.Backend.service.ChatService;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.*;
@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatMessage sendMessage(@RequestBody String message) {
        return chatService.saveMessage(message);
    }

    @GetMapping("/history")
    public List<ChatMessage> getChatHistory() {
        return chatService.getChatHistory();
    }

    @GetMapping("/history/paged")
    public Page<ChatMessage> getChatHistoryPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "desc") String sort
    ) {
        return chatService.getChatHistoryPaginated(page, size, sort);
    }
}

