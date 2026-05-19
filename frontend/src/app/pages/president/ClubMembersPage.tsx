import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, Users, Clock, CheckCircle, XCircle, User, Calendar, Settings } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import { getClubs, getApplications, getUsers, updateApplication, updateClub } from '../../data/mockData';
import { Application, User as UserType } from '../../types';

export function ClubMembersPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [clubs, setClubs] = useState(getClubs());
  const allUsers = getUsers();
  const [applications, setApplications] = useState(getApplications());
  const [successMessage, setSuccessMessage] = useState('');
  
  // 신청 기간 상태
  const [applicationStartDate, setApplicationStartDate] = useState('');
  const [applicationEndDate, setApplicationEndDate] = useState('');

  const club = useMemo(() => {
    return clubs.find(c => c.id === clubId);
  }, [clubs, clubId]);

  // 초기값 설정
  useMemo(() => {
    if (club) {
      setApplicationStartDate(
        club.applicationStartDate 
          ? new Date(club.applicationStartDate).toISOString().slice(0, 16)
          : ''
      );
      setApplicationEndDate(
        club.applicationEndDate 
          ? new Date(club.applicationEndDate).toISOString().slice(0, 16)
          : ''
      );
    }
  }, [club]);

  // 해당 동아리의 신청서들
  const clubApplications = useMemo(() => {
    return applications.filter(app => app.clubId === clubId);
  }, [applications, clubId]);

  // 대기중인 신청자들
  const pendingApplications = useMemo(() => {
    return clubApplications
      .filter(app => app.status === 'SUBMITTED')
      .map(app => {
        const user = allUsers.find(u => u.id === app.userId);
        return { ...app, user };
      });
  }, [clubApplications, allUsers]);

  // 승인된 회원들 (기존 회원)
  const acceptedMembers = useMemo(() => {
    return clubApplications
      .filter(app => app.status === 'ACCEPTED')
      .map(app => {
        const user = allUsers.find(u => u.id === app.userId);
        return { ...app, user };
      });
  }, [clubApplications, allUsers]);

  // 거절된 신청자들
  const rejectedApplications = useMemo(() => {
    return clubApplications
      .filter(app => app.status === 'REJECTED')
      .map(app => {
        const user = allUsers.find(u => u.id === app.userId);
        return { ...app, user };
      });
  }, [clubApplications, allUsers]);

  const handleApprove = (applicationId: string) => {
    const updatedApp: Partial<Application> = {
      status: 'ACCEPTED',
      reviewedAt: new Date().toISOString(),
      reviewNote: '승인되었습니다.',
    };
    updateApplication(applicationId, updatedApp);
    setApplications(getApplications());
    setSuccessMessage('신청을 승인했습니다.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleReject = (applicationId: string) => {
    const updatedApp: Partial<Application> = {
      status: 'REJECTED',
      reviewedAt: new Date().toISOString(),
      reviewNote: '거절되었습니다.',
    };
    updateApplication(applicationId, updatedApp);
    setApplications(getApplications());
    setSuccessMessage('신청을 거절했습니다.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUpdateApplicationPeriod = () => {
    if (!applicationStartDate || !applicationEndDate) {
      setSuccessMessage('시작일과 종료일을 모두 입력해주세요.');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    const startDate = new Date(applicationStartDate);
    const endDate = new Date(applicationEndDate);

    if (startDate >= endDate) {
      setSuccessMessage('종료일은 시작일보다 이후여야 합니다.');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    updateClub(clubId!, {
      applicationStartDate: startDate.toISOString(),
      applicationEndDate: endDate.toISOString(),
    });
    
    setClubs(getClubs());
    setSuccessMessage('신청 기간이 업데이트되었습니다.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (!currentUser || currentUser.role !== 'president') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">동아리 회장 권한이 필요합니다.</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">동아리를 찾을 수 없습니다.</p>
      </div>
    );
  }

  if (club.presidentId !== currentUser.id) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">이 동아리를 관리할 권한이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 뒤로가기 버튼 */}
      <Button variant="ghost" onClick={() => navigate('/president')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        동아리 목록으로
      </Button>

      {/* 성공 메시지 */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* 동아리 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{club.name}</CardTitle>
              <CardDescription>{club.description}</CardDescription>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">{club.category}</Badge>
                <Badge variant="outline">{club.activityLocation}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{acceptedMembers.length}</div>
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

      {/* 회원 및 신청자 명부 */}
      <Card>
        <CardHeader>
          <CardTitle>회원 및 신청자 명부</CardTitle>
          <CardDescription>
            동아리 회원과 신청자를 관리하세요
          </CardDescription>
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
                현재 회원 ({acceptedMembers.length})
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                신청 기간 설정
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingApplications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  대기중인 신청자가 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApplications.map(app => (
                    <Card key={app.id} className="border-l-4 border-l-yellow-400">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* 기본 정보 */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{app.user?.name}</h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline">{app.user?.department}</Badge>
                                <Badge variant="secondary">{app.user?.studentId}</Badge>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                              대기중
                            </Badge>
                          </div>

                          {/* 연락처 정보 */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">전화번호</span>
                              <p className="font-medium">{app.user?.phone || '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">이메일</span>
                              <p className="font-medium text-xs sm:text-sm break-all">{app.user?.email}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-gray-500">신청일</span>
                              <p className="font-medium">{new Date(app.appliedAt).toLocaleDateString('ko-KR')}</p>
                            </div>
                          </div>

                          {/* 자기소개 */}
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-500 font-medium">자기소개</span>
                            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                              {app.introduction}
                            </p>
                          </div>

                          {/* 액션 버튼 */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(app.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              승인
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleReject(app.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
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
              {acceptedMembers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  현재 회원이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {acceptedMembers.map(app => (
                    <Card key={app.id} className="border-l-4 border-l-green-400">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          {/* 기본 정보 */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{app.user?.name}</h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline">{app.user?.department}</Badge>
                                <Badge variant="secondary">{app.user?.studentId}</Badge>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              활동중
                            </Badge>
                          </div>

                          {/* 연락처 정보 */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">전화번호</span>
                              <p className="font-medium">{app.user?.phone || '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">이메일</span>
                              <p className="font-medium text-xs sm:text-sm break-all">{app.user?.email}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-gray-500">가입일</span>
                              <p className="font-medium">
                                {app.reviewedAt
                                  ? new Date(app.reviewedAt).toLocaleDateString('ko-KR')
                                  : new Date(app.appliedAt).toLocaleDateString('ko-KR')
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6 p-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">신청 시작일</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={applicationStartDate}
                    onChange={(e) => setApplicationStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">신청 종료일</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={applicationEndDate}
                    onChange={(e) => setApplicationEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                {club.applicationStartDate && club.applicationEndDate && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-900 mb-2">현재 설정된 신청 기간</div>
                    <div className="text-xs text-blue-700">
                      {new Date(club.applicationStartDate).toLocaleString('ko-KR')} ~<br />
                      {new Date(club.applicationEndDate).toLocaleString('ko-KR')}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleUpdateApplicationPeriod}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  신청 기간 업데이트
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}