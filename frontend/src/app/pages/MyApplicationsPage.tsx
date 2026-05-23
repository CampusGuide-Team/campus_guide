import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { FileText, Calendar, MessageSquare } from 'lucide-react';
import { api } from '../utils/api';

export function MyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await api.get('/applications');
        setApplications(data);
      } catch (e) {
        console.error('신청 목록 조회 실패', e);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Badge variant="secondary">검토 중</Badge>;
      case 'ACCEPTED':
        return <Badge variant="default" className="bg-green-600">승인됨</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">거절됨</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <div className="text-center py-16">로딩 중...</div>;

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">내 신청 현황</h1>
          <p className="text-gray-600">신청한 동아리의 현황을 확인할 수 있습니다</p>
        </div>

        {applications.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">신청 내역이 없습니다</h3>
                <p className="text-gray-600 mb-6">관심있는 동아리에 지원해보세요</p>
                <Link to="/clubs">
                  <Button>동아리 둘러보기</Button>
                </Link>
              </CardContent>
            </Card>
        ) : (
            <div className="space-y-4">
              {applications.map(application => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {application.clubName}
                          </CardTitle>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-500">신청일</div>
                          <div className="font-medium">{formatDate(application.appliedAt)}</div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link to={`/clubs/${application.clubId}`}>
                          <Button variant="outline" size="sm">동아리 상세 보기</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}
      </div>
  );
}