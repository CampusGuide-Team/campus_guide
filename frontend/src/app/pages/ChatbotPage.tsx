import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { KakaoMap } from '../components/KakaoMap';
import { api } from '../utils/api';

type ChatApiResponse = {
    answer: string;
    place: string | null;
    buildingName: string | null;
    floor: string | null;
    latitude: number | null;
    longitude: number | null;
    category: string | null;
    tags: string | null;
};

export function ChatbotPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'initial',
            role: 'assistant',
            content:
                '안녕하세요! KU Navigator 챗봇입니다. 학교 정보, 건물 위치, 동아리 정보 등 무엇이든 물어보세요!',
            timestamp: new Date().toISOString(),
        },
    ]);

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const recommendQuestions = [
        '학생식당 어디야?',
        '헬스장 어디야?',
        '컴공 어디야?',
        '학생회관에 뭐 있어?',
        '미래융합정보관에 뭐 있어?',
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userInput = text.trim();

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: userInput,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        try {
            const response = await fetch('http://localhost:8080/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userInput,
                }),
            });

            if (!response.ok) {
                throw new Error('챗봇 API 요청 실패');
            }

            const data: ChatApiResponse = await api.post('/chat', { message: userInput });

            const botResponse: ChatMessage = {
                id: `msg-${Date.now()}-bot`,
                role: 'assistant',
                content: data.answer,
                timestamp: new Date().toISOString(),
                latitude: data.latitude,
                longitude: data.longitude,
                placeName: data.place || data.buildingName || null,
            };

            setMessages((prev) => [...prev, botResponse]);
            console.log('챗봇 응답:', data);
        } catch (error) {
            console.error(error);

            const errorMessage: ChatMessage = {
                id: `msg-${Date.now()}-error`,
                role: 'assistant',
                content: '서버와 연결할 수 없습니다. 잠시후에 시도해주세요.',
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    const handleSend = async () => {
        await sendMessage(input);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">AI 챗봇</h1>
                <p className="text-gray-600">
                    학교 정보나 동아리에 대해 궁금한 것을 물어보세요
                </p>
            </div>

            <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        KU Navigator 챗봇
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${
                                message.role === 'user'
                                    ? 'flex-row-reverse'
                                    : 'flex-row'
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                {message.role === 'user' ? (
                                    <User className="w-4 h-4" />
                                ) : (
                                    <Bot className="w-4 h-4" />
                                )}
                            </div>

                            <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                }`}
                            >
                                <p className="text-sm whitespace-pre-line">
                                    {message.content}
                                </p>

                                {message.role === 'assistant' &&
                                    message.latitude != null &&
                                    message.longitude != null &&
                                    message.placeName && (
                                        <div className="mt-3">
                                            <KakaoMap
                                                latitude={message.latitude}
                                                longitude={message.longitude}
                                                name={message.placeName}
                                            />
                                        </div>
                                    )}

                                <p
                                    className={`text-xs mt-1 ${
                                        message.role === 'user'
                                            ? 'text-blue-200'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    <div ref={messagesEndRef} />
                </CardContent>

                <div className="border-t p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {recommendQuestions.map((question) => (
                            <Button
                                key={question}
                                variant="outline"
                                size="sm"
                                onClick={() => sendMessage(question)}
                            >
                                {question}
                            </Button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="메시지를 입력하세요..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />

                        <Button onClick={handleSend} disabled={!input.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}