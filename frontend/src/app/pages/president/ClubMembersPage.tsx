import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Clock, CheckCircle, User, Settings } from 'lucide-react';
import { api } from '../../utils/api';
import { toast } from 'sonner';

export function ClubMembersPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [applicationStartDate, setApplicationStartDate] = useState('');
  const [applicationEndDate, setApplicationEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const fetchClubData = () => {
    if (!clubId) return;
    const cleanClubId = clubId.trim();

    api.get(`/clubs/${cleanClubId}`)
        .then((data: any) => {
          if (data) setClub(data);
        })
        .catch((err) => console.error('동아리 상세 조회 실패:', err));

    api.get(`/applications/club/${cleanClubId}`)
        .then((data: any) => {
          if (Array.isArray(data)) setApplications(data);
          else if (data && Array.isArray((data as any).data)) setApplications((data as any).data);
        })
        .catch((err) => console.error('신청서 목록 조회 실패:', err));

    api.get(`/clubs/${cleanClubId}/members`)
        .then((data: any) => {
          if (Array.isArray(data)) setMembers(data);
        })
        .catch((err) => console.error('회원 목록 조회 실패:', err));
  };

  useEffect(() => {
    fetchClubData();
  }, [clubId]);

  useEffect(() => {
    if (!club) return;
    setApplicationStartDate(club.recruitStart ? new Date(club.recruitStart).toISOString().slice(0, 16) : '');
    setApplicationEndDate(club.recruitEnd ? new Date(club.recruitEnd).toISOString().slice(0, 16) : '');
    setDescription(club.description || '');
    setThumbnailUrl(club.thumbnailUrl || '');
  }, [club]);

  const pendingApplications = useMemo(() => {
    return applications.filter(app => app.status === 'SUBMITTED' || app.status === 'PENDING');
  }, [applications]);

  const rejectedApplications = useMemo(() => {
    return applications.filter(app => app.status === 'REJECTED');
  }, [applications]);

  const handleApprove = (applicationId: number) => {
    api.patch(`/applications/${applicationId}/accept`)
        .then(() => {
          setSuccessMessage('신청을 승인했습니다.');
          fetchClubData();
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch((err) => {
          console.error(err);
          setSuccessMessage('승인 처리 중 오류가 발생했습니다.');
          setTimeout(() => setSuccessMessage(''), 3000);
        });
  };

  const handleReject = (applicationId: number) => {
    api.patch(`/applications/${applicationId}/reject`)
        .then(() => {
          setSuccessMessage('신청을 거절했습니다.');
          fetchClubData();
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch((err) => {
          console.error(err);
          setSuccessMessage('거절 처리 중 오류가 발생했습니다.');
          setTimeout(() => setSuccessMessage(''), 3000);
        });
  };

  const handleRemoveMember = (memberId: number) => {
    if (!confirm('정말 이 회원을 삭제하시겠습니까?')) return;
    api.delete(`/clubs/${clubId}/members/${memberId}`)
        .then(() => {
          setSuccessMessage('회원이 삭제되었습니다.');
          fetchClubData();
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch((err) => {
          console.error(err);
          setSuccessMessage('삭제 처리 중 오류가 발생했습니다.');
          setTimeout(() => setSuccessMessage(''), 3000);
        });
  };

  const handleUpdateApplicationPeriod = async () => {
    if (!applicationStartDate || !applicationEndDate) {
      toast.error('시작일과 종료일을 모두 입력해주세요.');
      return;
    }
    try {
      await api.patch(`/clubs/${clubId}`, {
        recruitStart: applicationStartDate.slice(0, 10),
        recruitEnd: applicationEndDate.slice(0, 10),
      });
      toast.success('신청 기간이 업데이트되었습니다.');
      fetchClubData();
    } catch (e) {
      toast.error('업데이트에 실패했습니다.');
    }
  };

  const handleUpdateInfo = async () => {
    try {
      await api.patch(`/clubs/${clubId}`, {
        description,
        thumbnailUrl,
      });
      toast.success('동아리 정보가 수정되었습니다.');
      fetchClubData();
    } catch (e) {
      toast.error('수정에 실패했습니다.');
    }
  };

  if (!club) {
    return (
        <div className="text-center py-12">
          <p className="text-gray-600">동아리 데이터를 불러오는 중이거나 찾을 수 없습니다.</p>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/president')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          동아리 목록으로
        </Button>

        {successMessage && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
            </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{club.name}</CardTitle>
                <CardDescription>{club.description}</CardDescription>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">{club.category}</Badge>
                  <Badge variant="outline">회원 수: {members.length}명</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{members.length}</div>
                <div className="text-sm text-gray-600">현재 회원</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</div>
                <div className="text-sm text-gray-600">대기중</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{rejectedApplications.length}</div>
                <div className="text-sm text-gray-600">거절됨</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>회원 및 신청자 명부</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">
                  <Clock className="w-4 h-4 mr-2" />
                  대기중 ({pendingApplications.length})
                </TabsTrigger>
                <TabsTrigger value="members">
                  <User className="w-4 h-4 mr-2" />
                  현재 회원 ({members.length})
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="w-4 h-4 mr-2" />
                  설정
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingApplications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">대기중인 신청자가 없습니다.</div>
                ) : (
                    <div className="space-y-3">
                      {pendingApplications.map(app => (
                          <Card key={app.id} className="border-l-4 border-l-yellow-400">
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold">{app.user?.name || '신청자'}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Badge variant="outline">{app.user?.department || '학과 정보 없음'}</Badge>
                                      <Badge variant="secondary">{app.user?.studentId || '학번 없음'}</Badge>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                                    대기중
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500">전화번호</span>
                                    <p className="font-medium">{app.user?.phone || '-'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">이메일</span>
                                    <p className="font-medium text-xs sm:text-sm break-all">{app.user?.email || '-'}</p>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <span className="text-gray-500">신청일</span>
                                    <p className="font-medium">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('ko-KR') : '-'}</p>
                                  </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <span className="text-xs text-gray-500 font-medium">자기소개</span>
                                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{app.introduction || '내용 없음'}</p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleApprove(app.id)}>
                                    승인
                                  </Button>
                                  <Button variant="outline" className="flex-1 text-red-600 border-red-300 hover:bg-red-50" onClick={() => handleReject(app.id)}>
                                    거절
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                      ))}
                    </div>
                )}
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                {members.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">현재 회원이 없습니다.</div>
                ) : (
                    <div className="space-y-3">
                      {members.map(member => (
                          <Card key={member.clubMemberId} className="border-l-4 border-l-green-400">
                            <CardContent className="pt-6">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold">{member.name || '회원'}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Badge variant="outline">{member.email || '-'}</Badge>
                                      <Badge variant={member.clubRole === 'LEADER' ? 'default' : 'secondary'}>
                                        {member.clubRole === 'LEADER' ? '임원' : '회원'}
                                      </Badge>
                                    </div>
                                  </div>
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-300 hover:bg-red-50"
                                      onClick={() => handleRemoveMember(member.clubMemberId)}
                                  >
                                    삭제
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                      ))}
                    </div>
                )}
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-8 p-4">

                  {/* 동아리 정보 수정 */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">동아리 정보 수정</h3>
                    <div className="space-y-2">
                      <Label htmlFor="description">동아리 소개</Label>
                      <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={6}
                          placeholder="동아리 소개를 입력하세요. URL을 입력하면 자동으로 링크가 됩니다."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thumbnailUrl">썸네일 URL</Label>
                      <Input
                          id="thumbnailUrl"
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                          placeholder="https://..."
                      />
                    </div>
                    <Button className="w-full" onClick={handleUpdateInfo}>
                      동아리 정보 저장
                    </Button>
                  </div>

                  <hr />

                  {/* 신청 기간 설정 */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">신청 기간 설정</h3>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">신청 시작일</Label>
                      <Input id="startDate" type="datetime-local" value={applicationStartDate} onChange={(e) => setApplicationStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">신청 종료일</Label>
                      <Input id="endDate" type="datetime-local" value={applicationEndDate} onChange={(e) => setApplicationEndDate(e.target.value)} />
                    </div>
                    {club.recruitStart && club.recruitEnd && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-sm font-medium text-blue-900 mb-2">현재 설정된 신청 기간</div>
                          <div className="text-xs text-blue-700">
                            {new Date(club.recruitStart).toLocaleString('ko-KR')} ~<br />
                            {new Date(club.recruitEnd).toLocaleString('ko-KR')}
                          </div>
                        </div>
                    )}
                    <Button className="w-full" onClick={handleUpdateApplicationPeriod}>
                      신청 기간 업데이트
                    </Button>
                  </div>

                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
  );
}