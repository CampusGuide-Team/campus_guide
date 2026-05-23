import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '../../utils/api';
import { toast } from 'sonner';

export function AdminClubsPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingClub, setEditingClub] = useState<any>(null);
  const [studentId, setStudentId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnailUrl: '',
    category: '',
    recruitStart: '',
    recruitEnd: '',
  });

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const data = await api.get('/clubs');
      setClubs(data);
    } catch (e) {
      toast.error('동아리 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingClub(null);
    setStudentId('');
    setFormData({
      name: '',
      description: '',
      thumbnailUrl: '',
      category: '',
      recruitStart: '',
      recruitEnd: '',
    });
    setShowDialog(true);
  };

  const handleEdit = (club: any) => {
    setEditingClub(club);
    setStudentId('');
    setFormData({
      name: club.name,
      description: club.description || '',
      thumbnailUrl: club.thumbnailUrl || '',
      category: club.category || '',
      recruitStart: club.recruitStart || '',
      recruitEnd: club.recruitEnd || '',
    });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    try {
      if (editingClub) {
        await api.patch(`/admin/clubs/${editingClub.id}`, formData);
        toast.success('동아리가 수정되었습니다');
      } else {
        const newClub = await api.post('/admin/clubs', formData);
        // 동아리장 지정
        if (studentId) {
          await api.post(`/admin/clubs/${newClub.id}/leader?studentId=${studentId}`);
        }
        toast.success('동아리가 추가되었습니다');
      }
      setShowDialog(false);
      fetchClubs();
    } catch (e) {
      toast.error('저장에 실패했습니다');
    }
  };

  if (loading) return <div className="text-center py-16">로딩 중...</div>;

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">동아리 관리</h1>
            <p className="text-gray-600">동아리를 추가, 수정할 수 있습니다</p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            동아리 추가
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>전체 동아리 ({clubs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>회원수</TableHead>
                  <TableHead>모집기간</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubs.map(club => (
                    <TableRow key={club.id}>
                      <TableCell className="font-medium">{club.name}</TableCell>
                      <TableCell>
                        {club.category && (
                            <Badge variant="secondary">{club.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{club.memberCount}명</TableCell>
                      <TableCell>
                        {club.recruitStart && club.recruitEnd
                            ? `${club.recruitStart} ~ ${club.recruitEnd}`
                            : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(club)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingClub ? '동아리 수정' : '동아리 추가'}</DialogTitle>
              <DialogDescription>동아리 정보를 입력해주세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>동아리 이름 *</Label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>설명 *</Label>
                <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>썸네일 URL</Label>
                <Input
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>카테고리</Label>
                <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACADEMIC">학술</SelectItem>
                    <SelectItem value="SPORTS">운동</SelectItem>
                    <SelectItem value="CULTURE">문화</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="VOLUNTEER">봉사</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>모집 시작일</Label>
                  <Input
                      type="date"
                      value={formData.recruitStart}
                      onChange={(e) => setFormData({ ...formData, recruitStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>모집 종료일</Label>
                  <Input
                      type="date"
                      value={formData.recruitEnd}
                      onChange={(e) => setFormData({ ...formData, recruitEnd: e.target.value })}
                  />
                </div>
              </div>

              {!editingClub && (
                  <div className="space-y-2">
                    <Label>동아리장 학번</Label>
                    <Input
                        placeholder="202012345"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>취소</Button>
              <Button onClick={handleSubmit}>{editingClub ? '수정' : '추가'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}