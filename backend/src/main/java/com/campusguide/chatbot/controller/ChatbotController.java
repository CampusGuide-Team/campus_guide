package com.campusguide.chatbot.controller;

import com.campusguide.chatbot.dto.ChatRequest;
import com.campusguide.chatbot.dto.ChatResponse;
import com.campusguide.chatbot.service.ChatbotService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService){
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request){

        String answer = chatbotService.askChatGPT(request.message());
        return new ChatResponse(answer);
    }
}