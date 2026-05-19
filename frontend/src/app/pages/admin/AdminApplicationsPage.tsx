import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { getApplications, getClubs, getUsers } from '../../data/mockData';
import { Application, ApplicationStatus } from '../../types';
import { toast } from 'sonner';

export function AdminApplicationsPage() {
  const [applications, setApplications] = useState(getApplications());
  const clubs = getClubs();
  const users = getUsers();
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  const filteredApplications = applications.filter(app => 
    filterStatus === 'ALL' ? true : app.status === filterStatus
  );

  const handleView = (application: Application) => {
    setSelectedApplication(application);
    setReviewNote(application.reviewNote || '');
    setShowDetailDialog(true);
  };

  const handleAccept = () => {
    if (!selectedApplication) return;

    const updatedApp: Application = {
      ...selectedApplication,
      status: 'ACCEPTED',
      reviewedAt: new Date().toISOString(),
      reviewNote: reviewNote.trim() || '신청이 승인되었습니다.',
    };

    const updatedApplications = applications.map(app =>
      app.id === selectedApplication.id ? updatedApp : app
    );

    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    toast.success('신청이 승인되었습니다');
    setShowDetailDialog(false);
  };

  const handleReject = () => {
    if (!selectedApplication) return;

    if (!reviewNote.trim()) {
      toast.error('거절 사유를 입력해주세요');
      return;
    }

    const updatedApp: Application = {
      ...selectedApplication,
      status: 'REJECTED',
      reviewedAt: new Date().toISOString(),
      reviewNote: reviewNote.trim(),
    };

    const updatedApplications = applications.map(app =>
      app.id === selectedApplication.id ? updatedApp : app
    );

    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    toast.success('신청이 거절되었습니다');
    setShowDetailDialog(false);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return <Badge variant="secondary">검토 중</Badge>;
      case 'ACCEPTED':
        return <Badge className="bg-green-600">승인됨</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">거절됨</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">신청 관리</h1>
        <p className="text-gray-600">
          동아리 신청을 검토하고 승인/거절할 수 있습니다
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-sm text-gray-600">전체 신청</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(a => a.status === 'SUBMITTED').length}
            </div>
            <p className="text-sm text-gray-600">검토 중</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(a => a.status === 'ACCEPTED').length}
            </div>
            <p className="text-sm text-gray-600">승인됨</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {applications.filter(a => a.status === 'REJECTED').length}
            </div>
            <p className="text-sm text-gray-600">거절됨</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>신청 목록 ({filteredApplications.length})</CardTitle>
            <Select
              value={filterStatus}
              onValueChange={(value: ApplicationStatus | 'ALL') => setFilterStatus(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value="SUBMITTED">검토 중</SelectItem>
                <SelectItem value="ACCEPTED">승인됨</SelectItem>
                <SelectItem value="REJECTED">거절됨</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>동아리</TableHead>
                <TableHead>신청자</TableHead>
                <TableHead>신청일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    신청 내역이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map(application => {
                  const club = clubs.find(c => c.id === application.clubId);
                  const user = users.find(u => u.id === application.userId);
                  return (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{club?.name}</TableCell>
                      <TableCell>
                        <div>
                          <div>{user?.name}</div>
                          <div className="text-xs text-gray-500">{user?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(application.appliedAt)}</TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(application)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          상세
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>신청 상세 정보</DialogTitle>
            <DialogDescription>
              신청 내용을 검토하고 승인/거절을 결정할 수 있습니다
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">동아리</p>
                  <p className="font-medium">
                    {clubs.find(c => c.id === selectedApplication.clubId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">신청자</p>
                  <p className="font-medium">
                    {users.find(u => u.id === selectedApplication.userId)?.name}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">신청일</p>
                <p className="font-medium">{formatDate(selectedApplication.appliedAt)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">현재 상태</p>
                {getStatusBadge(selectedApplication.status)}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">자기소개</p>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="whitespace-pre-line">{selectedApplication.introduction}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">관리자 메모</p>
                <Textarea
                  placeholder="승인/거절 사유를 입력하세요..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              닫기
            </Button>
            {selectedApplication?.status === 'SUBMITTED' && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  className="gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  거절
                </Button>
                <Button
                  onClick={handleAccept}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  승인
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
