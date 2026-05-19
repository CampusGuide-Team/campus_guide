import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Search, MessageSquare, Building, Users, ArrowRight } from 'lucide-react';
import { ClubCard } from '../components/ClubCard';
import { getClubs } from '../data/mockData';

export function HomePage() {
  const clubs = getClubs().filter(c => c.status === 'ACTIVE').slice(0, 3);

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 px-2">
          국립한국교통대학교<br className="sm:hidden" /> 동아리를 한눈에
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-4">
          캠퍼스 지도부터 동아리 신청까지,<br className="sm:hidden" /> KU Navigator와 함께하세요
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Link to="/clubs" className="w-full sm:w-auto">
            <Button size="lg" className="gap-2 w-full sm:w-auto h-12">
              <Search className="w-5 h-5" />
              동아리 탐색하기
            </Button>
          </Link>
          <Link to="/chatbot" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto h-12">
              <MessageSquare className="w-5 h-5" />
              챗봇으로 질문하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Link to="/facilities">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">시설 찾기</h3>
                <p className="text-sm md:text-base text-gray-600">
                  학과, 행정실, 편의점 등 캠퍼스 시설 위치를 확인하세요
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/clubs">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">동아리 탐색</h3>
                <p className="text-sm md:text-base text-gray-600">
                  다양한 태그와 검색 기능으로 나에게 맞는 동아리를 찾아보세요
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/chatbot">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">AI 챗봇</h3>
                <p className="text-sm md:text-base text-gray-600">
                  학교 정보나 동아리 관련 질문을 챗봇에게 물어보세요
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Featured Clubs */}
      <section>
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">인기 동아리</h2>
          <Link to="/clubs">
            <Button variant="ghost" className="gap-2" size="sm">
              전체 보기
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {clubs.map(club => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </section>
    </div>
  );
}