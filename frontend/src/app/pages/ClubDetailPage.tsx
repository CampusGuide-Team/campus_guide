import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { MapPin, Users, Calendar, Building as BuildingIcon, ArrowLeft } from 'lucide-react';
import { getClubs, getBuildings, getApplications } from '../data/mockData';
import { getCurrentUser } from '../utils/auth';
import { Application } from '../types';
import { toast } from 'sonner';

export function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [introduction, setIntroduction] = useState('');

  const clubs = getClubs();
  const buildings = getBuildings();
  const applications = getApplications();

  const club = clubs.find(c => c.id === id);
  const building = buildings.find(b => b.id === club?.buildingId);

  // Check if user already applied
  const existingApplication = applications.find(
    app => app.clubId === id && app.userId === user?.id
  );

  // 신청 가능 여부 체크
  const isApplicationPeriodActive = () => {
    if (!club.applicationStartDate || !club.applicationEndDate) {
      return true; // 신청 기간이 설정되지 않으면 항상 신청 가능
    }
    const now = new Date();
    const start = new Date(club.applicationStartDate);
    const end = new Date(club.applicationEndDate);
    return now >= start && now <= end;
  };

  const getApplicationPeriodMessage = () => {
    if (!club.applicationStartDate || !club.applicationEndDate) {
      return '신청 기간이 설정되지 않았습니다';
    }
    
    const now = new Date();
    const start = new Date(club.applicationStartDate);
    const end = new Date(club.applicationEndDate);
    
    if (now < start) {
      return `신청 시작 전입니다 (시작: ${formatDate(club.applicationStartDate)})`;
    }
    if (now > end) {
      return '신청 기간이 종료되었습니다';
    }
    return '신청 가능';
  };

  if (!club) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">동아리를 찾을 수 없습니다</h2>
        <Button onClick={() => navigate('/clubs')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const handleApply = () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    if (existingApplication) {
      toast.error('이미 신청한 동아리입니다');
      return;
    }

    setShowApplicationDialog(true);
  };

  const submitApplication = () => {
    if (introduction.trim().length < 10) {
      toast.error('자기소개를 10자 이상 입력해주세요');
      return;
    }

    if (introduction.length > 1000) {
      toast.error('자기소개는 1000자 이하로 입력해주세요');
      return;
    }

    const newApplication: Application = {
      id: `app-${Date.now()}`,
      clubId: club.id,
      userId: user!.id,
      status: 'SUBMITTED',
      introduction: introduction.trim(),
      appliedAt: new Date().toISOString(),
    };

    const apps = getApplications();
    apps.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(apps));

    toast.success('동아리 신청이 완료되었습니다!');
    setShowApplicationDialog(false);
    setIntroduction('');
    
    // Refresh page to show updated application status
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isRecruitmentActive = () => {
    const now = new Date();
    const start = new Date(club.recruitmentStart);
    const end = new Date(club.recruitmentEnd);
    return now >= start && now <= end;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/clubs')} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Button>

      {/* Hero Image */}
      <div className="aspect-[21/9] w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={club.thumbnailUrl}
          alt={club.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{club.name}</h1>
            <div className="flex flex-wrap gap-2">
              {club.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>동아리 소개</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {club.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>활동 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <BuildingIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">활동 건물</div>
                  <div className="font-medium">{building?.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">활동 장소</div>
                  <div className="font-medium">{club.activityLocation}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">동아리원</div>
                  <div className="font-medium">{club.memberCount}명</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">모집 기간</div>
                  <div className="font-medium">
                    {formatDate(club.recruitmentStart)} ~ {formatDate(club.recruitmentEnd)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>신청하기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingApplication ? (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-900 mb-1">
                      신청 상태
                    </div>
                    <Badge
                      variant={
                        existingApplication.status === 'ACCEPTED'
                          ? 'default'
                          : existingApplication.status === 'REJECTED'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {existingApplication.status === 'SUBMITTED' && '검토 중'}
                      {existingApplication.status === 'ACCEPTED' && '승인됨'}
                      {existingApplication.status === 'REJECTED' && '거절됨'}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/my-applications')}
                  >
                    내 신청 보기
                  </Button>
                </div>
              ) : (
                <>
                  {/* 신청 기간 정보 */}
                  {club.applicationStartDate && club.applicationEndDate && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">신청 기간</div>
                      <div className="text-sm font-medium text-gray-700">
                        {formatDate(club.applicationStartDate)} ~ {formatDate(club.applicationEndDate)}
                      </div>
                    </div>
                  )}
                  
                  {isApplicationPeriodActive() && isRecruitmentActive() ? (
                    <>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm font-medium text-green-900">
                          모집 중
                        </div>
                        <div className="text-xs text-green-700 mt-1">
                          {formatDate(club.applicationEndDate || club.recruitmentEnd)}까지
                        </div>
                      </div>
                      <Button className="w-full" onClick={handleApply}>
                        동아리 신청하기
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-900">
                          {!isApplicationPeriodActive() ? '신청 기간이 아닙니다' : '모집 기간이 아닙니다'}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {getApplicationPeriodMessage()}
                        </div>
                      </div>
                      <Button className="w-full" disabled>
                        신청 불가
                      </Button>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{club.name} 신청</DialogTitle>
            <DialogDescription>
              자기소개를 작성해주세요 (10자 이상, 1000자 이하)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="동아리에 지원하는 이유와 자기소개를 작성해주세요..."
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={8}
              maxLength={1000}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {introduction.length} / 1000
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>
              취소
            </Button>
            <Button onClick={submitApplication}>신청하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}