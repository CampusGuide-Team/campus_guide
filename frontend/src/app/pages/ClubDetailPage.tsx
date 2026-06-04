import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Users, Calendar, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

export function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [introduction, setIntroduction] = useState('');
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [isMember, setIsMember] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubData = await api.get(`/clubs/${id}`);
        setClub(clubData);

        try {
          const apps = await api.get('/applications');
          const found = apps.find((a: any) => a.clubId === Number(id));
          setExistingApplication(found || null);

          // 내가 이미 회원인지 확인
          const members = await api.get(`/clubs/${id}/members`);
          const userId = JSON.parse(localStorage.getItem('user_info') || '{}').id;
          const found2 = members.find((m: any) => m.userId === Number(userId));
          setIsMember(!!found2);
        } catch {
          // 비로그인 상태
        }
      } catch (e) {
        console.error('동아리 조회 실패', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const isRecruitmentActive = () => {
    if (!club?.recruitStart || !club?.recruitEnd) return true;
    const now = new Date();
    const start = new Date(club.recruitStart);
    const end = new Date(club.recruitEnd);
    return now >= start && now <= end;
  };

  const handleApply = () => {
    if (!localStorage.getItem('token')) {
      toast.error('로그인이 필요합니다');
      navigate('/login');
      return;
    }
    setShowApplicationDialog(true);
  };

  const submitApplication = async () => {
    if (introduction.trim().length < 10) {
      toast.error('자기소개를 10자 이상 입력해주세요');
      return;
    }
    try {
      const result = await api.post(`/applications?clubId=${id}`, { introduction });
      toast.success('동아리 신청이 완료되었습니다!');
      setShowApplicationDialog(false);
      setIntroduction('');
      setExistingApplication(result);
    } catch (e) {
      toast.error('신청에 실패했습니다');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderDescription = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (/https?:\/\/[^\s]+/.test(part)) {
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-pink-500 underline hover:text-pink-600 break-all">{part.includes('instagram') ? '📸 인스타그램 바로가기' : part}</a>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderApplicationStatus = () => {
    if (!existingApplication) {
      if (!isRecruitmentActive()) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-900">모집 기간이 아닙니다</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(club.recruitStart)} ~ {formatDate(club.recruitEnd)}
              </div>
            </div>
        );
      }
      return (
          <Button className="w-full" onClick={handleApply}>
            동아리 신청하기
          </Button>
      );
    }

    if (existingApplication.status === 'ACCEPTED') {
      return (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm font-medium text-green-900 mb-1">신청 상태</div>
            <Badge variant="default" className="bg-green-600">✅ 승인됨 (회원)</Badge>
          </div>
      );
    }

    if (existingApplication.status === 'SUBMITTED') {
      return (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-1">신청 상태</div>
              <Badge variant="secondary">검토 중</Badge>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate('/my-applications')}>
              내 신청 보기
            </Button>
          </div>
      );
    }

    if (existingApplication.status === 'REJECTED') {
      return (
          <div className="space-y-3">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm font-medium text-red-900 mb-1">신청 상태</div>
              <Badge variant="destructive">거절됨</Badge>
            </div>
            {isRecruitmentActive() && (
                <Button className="w-full" onClick={handleApply}>
                  다시 신청하기
                </Button>
            )}
          </div>
      );
    }

    return null;
  };

  if (loading) return <div className="text-center py-16">로딩 중...</div>;

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

  return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/clubs')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Button>

        <div className="aspect-[21/9] w-full overflow-hidden rounded-lg bg-gray-200">
          <img
              src={club.thumbnailUrl || '/placeholder.png'}
              alt={club.name}
              className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{club.name}</h1>
              {club.category && (
                  <Badge variant="secondary">{club.category}</Badge>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>동아리 소개</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {renderDescription(club.description)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>활동 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                      {formatDate(club.recruitStart)} ~ {formatDate(club.recruitEnd)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>신청하기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderApplicationStatus()}
              </CardContent>
            </Card>
          </div>
        </div>

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