import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { getClubs, getBuildings } from '../data/mockData';

export function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: '안녕하세요! KU Navigator 챗봇입니다. 학교 정보, 건물 위치, 동아리 정보 등 무엇이든 물어보세요!',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const clubs = getClubs();
    const buildings = getBuildings();

    // 건물 관련 질문
    if (lowerMessage.includes('건물') || lowerMessage.includes('어디') || lowerMessage.includes('위치')) {
      const buildingNames = buildings.map(b => b.name).join(', ');
      return `캠퍼스 주요 건물 정보입니다:\n\n${buildings.map(b => 
        `📍 ${b.name}\n${b.description}`
      ).join('\n\n')}\n\n더 자세한 정보가 필요하시면 구체적인 건물명을 말씀해주세요!`;
    }

    // 본관 관련
    if (lowerMessage.includes('본관')) {
      const building = buildings.find(b => b.name.includes('본관'));
      return building 
        ? `📍 ${building.name}\n${building.description}` 
        : '본관 정보를 찾을 수 없습니다.';
    }

    // 동아리 관련 질문
    if (lowerMessage.includes('동아리')) {
      if (lowerMessage.includes('개발') || lowerMessage.includes('코딩') || lowerMessage.includes('프로그래밍')) {
        const devClubs = clubs.filter(c => 
          c.tags.some(tag => ['개발', '프로젝트', '학술', '로봇', 'AI'].includes(tag))
        );
        return `개발 관련 동아리 목록입니다:\n\n${devClubs.map(c => 
          `🎯 ${c.name}\n${c.description.substring(0, 100)}...`
        ).join('\n\n')}\n\n더 자세한 정보는 동아리 탐색 페이지에서 확인하세요!`;
      }

      if (lowerMessage.includes('운동') || lowerMessage.includes('스포츠') || lowerMessage.includes('농구') || lowerMessage.includes('축구')) {
        const sportsClubs = clubs.filter(c => 
          c.tags.some(tag => ['운동', '농구', '축구', '친선경기'].includes(tag))
        );
        return `운동 관련 동아리 목록입니다:\n\n${sportsClubs.map(c => 
          `⚽ ${c.name}\n${c.description.substring(0, 100)}...`
        ).join('\n\n')}\n\n더 자세한 정보는 동아리 탐색 페이지에서 확인하세요!`;
      }

      if (lowerMessage.includes('음악') || lowerMessage.includes('공연') || lowerMessage.includes('기타')) {
        const musicClubs = clubs.filter(c => 
          c.tags.some(tag => ['음악', '공연', '댄스', 'K-POP'].includes(tag))
        );
        return `음악/공연 관련 동아리 목록입니다:\n\n${musicClubs.map(c => 
          `🎵 ${c.name}\n${c.description.substring(0, 100)}...`
        ).join('\n\n')}\n\n더 자세한 정보는 동아리 탐색 페이지에서 확인하세요!`;
      }

      // 일반 동아리 질문
      return `국립한국교통대학교에는 다양한 동아리가 있습니다!\n\n주요 카테고리:\n- 개발/학술: KUICS, 로봇공학 동아리\n- 운동: 농구 SLAM, FC KU\n- 음악/공연: 어쿠스틱 기타, 댄스 BEAT\n- 문화/예술: 영화 CINE, 사진 FOCUS\n\n동아리 탐색 페이지에서 더 많은 정보를 확인하세요!`;
    }

    // 신청 관련 질문
    if (lowerMessage.includes('신청') || lowerMessage.includes('지원') || lowerMessage.includes('가입')) {
      return `동아리 신청 방법:\n\n1. 동아리 탐색 페이지에서 관심있는 동아리를 찾습니다\n2. 동아리 상세 페이지에서 "신청하기" 버튼을 클릭합니다\n3. 자기소개를 작성합니다 (10자 이상, 1000자 이하)\n4. 신청을 완료하면 "내 신청" 페이지에서 상태를 확인할 수 있습니다\n\n※ 로그인이 필요하며, 동일 동아리에 중복 신청은 불가능합니다.`;
    }

    // 모집 기간 관련
    if (lowerMessage.includes('모집') || lowerMessage.includes('기간')) {
      return `대부분의 동아리는 3월부터 4월 말까지 신입 회원을 모집합니다.\n\n각 동아리별 구체적인 모집 기간은 동아리 상세 페이지에서 확인하실 수 있습니다.\n\n현재 모집 중인 동아리를 확인하려면 동아리 탐색 페이지를 방문해주세요!`;
    }

    // 기본 응답
    const responses = [
      '죄송합니다. 질문을 이해하지 못했습니다. 다시 한번 질문해주시겠어요?',
      '학교 건물, 동아리 정보, 신청 방법 등에 대해 물어보세요!',
      '좀 더 구체적으로 질문해주시면 더 정확한 답변을 드릴 수 있습니다.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: 'assistant',
        content: generateResponse(input.trim()),
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
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
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
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
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
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