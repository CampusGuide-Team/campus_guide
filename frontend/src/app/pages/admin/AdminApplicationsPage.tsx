import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { api } from '../../utils/api';
import { toast } from 'sonner';

export function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

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

  const filteredApplications = applications.filter(app =>
      filterStatus === 'ALL' ? true : app.status === filterStatus
  );

  const handleView = (application: any) => {
    setSelectedApplication(application);
    setShowDetailDialog(true);
  };

  const handleAccept = async () => {
    if (!selectedApplication) return;
    try {
      await api.patch(`/applications/${selectedApplication.id}/accept`);
      toast.success('신청이 승인되었습니다');
      setShowDetailDialog(false);
      fetchApplications();
    } catch (e) {
      toast.error('승인에 실패했습니다');
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    try {
      await api.patch(`/applications/${selectedApplication.id}/reject`);
      toast.success('신청이 거절되었습니다');
      setShowDetailDialog(false);
      fetchApplications();
    } catch (e) {
      toast.error('거절에 실패했습니다');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return <Badge variant="secondary">검토 중</Badge>;
      case 'ACCEPTED': return <Badge className="bg-green-600">승인됨</Badge>;
      case 'REJECTED': return <Badge variant="destructive">거절됨</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return <div className="text-center py-16">로딩 중...</div>;

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">신청 관리</h1>
          <p className="text-gray-600">동아리 신청을 검토하고 승인/거절할 수 있습니다</p>
        </div>

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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
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
                  <TableHead>신청일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        신청 내역이 없습니다
                      </TableCell>
                    </TableRow>
                ) : (
                    filteredApplications.map(application => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.clubName}</TableCell>
                          <TableCell>{formatDate(application.appliedAt)}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleView(application)}>
                              <Eye className="w-4 h-4 mr-2" />
                              상세
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>신청 상세 정보</DialogTitle>
              <DialogDescription>신청 내용을 검토하고 승인/거절을 결정할 수 있습니다</DialogDescription>
            </DialogHeader>
            {selectedApplication && (
                <div className="space-y-4 py-4">
                  <div>
                    <p className="text-sm text-gray-500">동아리</p>
                    <p className="font-medium">{selectedApplication.clubName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">신청일</p>
                    <p className="font-medium">{formatDate(selectedApplication.appliedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">현재 상태</p>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>닫기</Button>
              {selectedApplication?.status === 'SUBMITTED' && (
                  <>
                    <Button variant="destructive" onClick={handleReject} className="gap-2">
                      <XCircle className="w-4 h-4" />
                      거절
                    </Button>
                    <Button onClick={handleAccept} className="gap-2 bg-green-600 hover:bg-green-700">
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