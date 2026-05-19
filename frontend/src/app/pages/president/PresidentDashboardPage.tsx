import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Users, ArrowRight } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import { getClubs, getApplications } from '../../data/mockData';
import { useNavigate } from 'react-router';

export function PresidentDashboardPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const clubs = getClubs();
  const allApplications = getApplications();

  // 현재 로그인한 회장이 관리하는 동아리들
  const myClubs = useMemo(() => {
    return clubs.filter(club => club.presidentId === currentUser?.id);
  }, [clubs, currentUser]);

  // 각 동아리별 대기중인 신청 수
  const pendingCountByClub = useMemo(() => {
    const counts: Record<string, number> = {};
    myClubs.forEach(club => {
      counts[club.id] = allApplications.filter(
        app => app.clubId === club.id && app.status === 'SUBMITTED'
      ).length;
    });
    return counts;
  }, [myClubs, allApplications]);

  if (!currentUser || currentUser.role !== 'president') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">동아리 회장 권한이 필요합니다.</p>
      </div>
    );
  }

  if (myClubs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">관리 중인 동아리가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">동아리 회장 대시보드</h1>
        <p className="text-gray-600">
          {currentUser.name}님이 관리하는 동아리 목록입니다
        </p>
      </div>

      {/* 내 동아리 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClubs.map(club => (
          <Card key={club.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{club.name}</CardTitle>
                  <Badge variant="secondary" className="mb-2">{club.category}</Badge>
                  <p className="text-sm text-gray-600 mt-2">{club.activityLocation}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">현재 회원</span>
                <span className="font-semibold">{club.memberCount}명</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">대기중인 신청</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                  {pendingCountByClub[club.id]}건
                </Badge>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={() => navigate(`/president/clubs/${club.id}`)}
              >
                명단 관리
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}