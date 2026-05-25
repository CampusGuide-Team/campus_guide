import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowRight } from 'lucide-react';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../../utils/auth';

export function PresidentDashboardPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/clubs').then((data: any) => {
      setClubs(data);
    }).catch(() => {
      console.error('동아리 조회 실패');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-16">로딩 중...</div>;

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">동아리 회장 대시보드</h1>
          <p className="text-gray-600">{currentUser?.name}님이 관리하는 동아리 목록입니다</p>
        </div>

        {clubs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">관리 중인 동아리가 없습니다.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.map(club => (
                  <Card key={club.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl mb-2">{club.name}</CardTitle>
                      {club.category && <Badge variant="secondary">{club.category}</Badge>}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">현재 회원</span>
                        <span className="font-semibold">{club.memberCount}명</span>
                      </div>
                      <Button className="w-full mt-4" onClick={() => navigate(`/president/clubs/${club.id}`)}>
                        명단 관리
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}
      </div>
  );
}