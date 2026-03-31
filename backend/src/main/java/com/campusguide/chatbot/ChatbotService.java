package com.campusguide.chatbot;

import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    public String getAnswer(String message) {

        if(message.contains("도서관")){
            return "도서관은 W20에 있습니다!";
        }

        if(message.contains("학생회관")){
            return "한국교통대학교 E6에 있습니다";
        }

        return "죄송합니다. 이해하지 못했습니다.";
    }
}