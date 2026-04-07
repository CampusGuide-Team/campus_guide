package com.campusguide.chatbot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class ChatbotService {

    @Value("${openai.api.key}")
    private String apiKey;

    public String askChatGPT(String message){

        String url = "https://api.openai.com/v1/chat/completions";

        RestTemplate restTemplate = new RestTemplate();

        Map<String,Object> body = new HashMap<>();
        body.put("model","gpt-4o-mini");

        List<Map<String,String>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role","user",
                "content",message
        ));

        body.put("messages",messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String,Object>> entity =
                new HttpEntity<>(body,headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(url,entity,Map.class);

        Map result = response.getBody();

        List choices = (List) result.get("choices");
        Map first = (Map) choices.get(0);
        Map msg = (Map) first.get("message");

        return msg.get("content").toString();
    }
}