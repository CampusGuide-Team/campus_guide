package com.campusguide.chatbot.controller;

import com.campusguide.chatbot.dto.ChatRequest;
import com.campusguide.chatbot.dto.ChatResponse;
import com.campusguide.chatbot.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return chatbotService.ask(request.getMessage());
    }

    @GetMapping("/test")
    public ChatResponse test(@RequestParam String message) {
        return chatbotService.ask(message);
    }
}