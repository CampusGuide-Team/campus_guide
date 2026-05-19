import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { FileText, Calendar, MessageSquare } from 'lucide-react';
import { getApplications, getClubs } from '../data/mockData';
import { getCurrentUser } from '../utils/auth';

export function MyApplicationsPage() {
  const user = getCurrentUser();
  const applications = getApplications().filter(app => app.userId === user?.id);
  const clubs = getClubs();

  const formatDate = (dateString: string) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">내 신청 현황</h1>
        <p className="text-gray-600">
          신청한 동아리의 현황을 확인할 수 있습니다
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">신청 내역이 없습니다</h3>
            <p className="text-gray-600 mb-6">
              관심있는 동아리에 지원해보세요
            </p>
            <Link to="/clubs">
              <Button>동아리 둘러보기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map(application => {
            const club = clubs.find(c => c.id === application.clubId);
            if (!club) return null;

            return (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{club.name}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {club.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
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

                  {application.reviewedAt && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">처리일</div>
                        <div className="font-medium">{formatDate(application.reviewedAt)}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">자기소개</div>
                      <div className="text-sm bg-gray-50 rounded-lg p-3 border">
                        {application.introduction}
                      </div>
                    </div>
                  </div>

                  {application.reviewNote && (
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">관리자 메모</div>
                        <div className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-200">
                          {application.reviewNote}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Link to={`/clubs/${club.id}`}>
                      <Button variant="outline" size="sm">동아리 상세 보기</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
