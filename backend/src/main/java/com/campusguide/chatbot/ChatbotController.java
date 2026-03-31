package com.campusguide.chatbot;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService){
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public String chat(@RequestBody ChatRequest request){

        return chatbotService.askChatGPT(request.getMessage());
    }
}