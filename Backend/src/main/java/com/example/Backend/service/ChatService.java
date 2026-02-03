package com.example.Backend.service;

import com.example.Backend.model.ChatMessage;
import com.example.Backend.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.*;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final RestTemplate restTemplate;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    public ChatService(ChatRepository chatRepository, RestTemplate restTemplate) {
        this.chatRepository = chatRepository;
        this.restTemplate = restTemplate;
    }

    public ChatMessage saveMessage(String userMessage) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "user", "content", userMessage));

        body.put("messages", messages);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                apiUrl,
                request,
                Map.class
        );

        List<Map<String, Object>> choices =
                (List<Map<String, Object>>) response.getBody().get("choices");

        Map<String, Object> message =
                (Map<String, Object>) choices.get(0).get("message");

        String aiReply = message.get("content").toString();

        ChatMessage chat = new ChatMessage();
        chat.setUserMessage(userMessage);
        chat.setAiReply(aiReply);

        return chatRepository.save(chat);
    }
    public List<ChatMessage> getChatHistory() {
        return chatRepository.findAll();
    }

    public Page<ChatMessage> getChatHistoryPaginated(
            int page,
            int size,
            String sortDirection
    ) {

        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by("id").descending()
                : Sort.by("id").ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return chatRepository.findAll(pageable);
    }
}
