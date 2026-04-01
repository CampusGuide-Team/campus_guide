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
    public ChatResponse chat(@RequestBody ChatRequest request){

        String answer = chatbotService.askChatGPT(request.message());
        return new ChatResponse(answer);
    }
}