import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { getClubs, getBuildings, getUsers } from '../../data/mockData';
import { Club } from '../../types';
import { toast } from 'sonner';

export function AdminClubsPage() {
  const [clubs, setClubs] = useState(getClubs());
  const buildings = getBuildings();
  const users = getUsers();
  const [showDialog, setShowDialog] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnailUrl: '',
    tags: '',
    category: '',
    buildingId: '',
    recruitmentStart: '',
    recruitmentEnd: '',
    status: 'ACTIVE' as const,
    presidentId: '',
    activityLocation: '',
    memberCount: 0,
  });

  // president 역할을 가진 사용자만 필터링
  const presidents = users.filter(u => u.role === 'president');

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    setFormData({
      name: club.name,
      description: club.description,
      thumbnailUrl: club.thumbnailUrl,
      tags: club.tags.join(', '),
      category: club.category,
      buildingId: club.buildingId,
      recruitmentStart: club.recruitmentStart.split('T')[0],
      recruitmentEnd: club.recruitmentEnd.split('T')[0],
      status: club.status,
      presidentId: club.presidentId,
      activityLocation: club.activityLocation,
      memberCount: club.memberCount,
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingClub(null);
    setFormData({
      name: '',
      description: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
      tags: '',
      category: '',
      buildingId: buildings[0]?.id || '',
      recruitmentStart: '',
      recruitmentEnd: '',
      status: 'ACTIVE',
      presidentId: presidents[0]?.id || '',
      activityLocation: '',
      memberCount: 0,
    });
    setShowDialog(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.buildingId || !formData.presidentId) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);

    if (editingClub) {
      // Update existing club
      const updatedClub: Club = {
        ...editingClub,
        name: formData.name,
        description: formData.description,
        thumbnailUrl: formData.thumbnailUrl,
        tags: tagsArray,
        category: formData.category,
        buildingId: formData.buildingId,
        recruitmentStart: new Date(formData.recruitmentStart).toISOString(),
        recruitmentEnd: new Date(formData.recruitmentEnd).toISOString(),
        status: formData.status,
        presidentId: formData.presidentId,
        activityLocation: formData.activityLocation,
        memberCount: formData.memberCount,
      };

      const updatedClubs = clubs.map(c => c.id === editingClub.id ? updatedClub : c);
      setClubs(updatedClubs);
      localStorage.setItem('clubs', JSON.stringify(updatedClubs));
      toast.success('동아리가 수정되었습니다');
    } else {
      // Create new club
      const newClub: Club = {
        id: `club-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        thumbnailUrl: formData.thumbnailUrl,
        tags: tagsArray,
        category: formData.category,
        buildingId: formData.buildingId,
        recruitmentStart: new Date(formData.recruitmentStart).toISOString(),
        recruitmentEnd: new Date(formData.recruitmentEnd).toISOString(),
        status: formData.status,
        presidentId: formData.presidentId,
        activityLocation: formData.activityLocation,
        memberCount: formData.memberCount,
        createdAt: new Date().toISOString(),
      };

      const updatedClubs = [...clubs, newClub];
      setClubs(updatedClubs);
      localStorage.setItem('clubs', JSON.stringify(updatedClubs));
      toast.success('동아리가 추가되었습니다');
    }

    setShowDialog(false);
  };

  const handleDelete = (club: Club) => {
    if (confirm(`정말 "${club.name}" 동아리를 삭제하시겠습니까?`)) {
      const updatedClubs = clubs.filter(c => c.id !== club.id);
      setClubs(updatedClubs);
      localStorage.setItem('clubs', JSON.stringify(updatedClubs));
      toast.success('동아리가 삭제되었습니다');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">동아리 관리</h1>
          <p className="text-gray-600">
            동아리를 추가, 수정, 삭제할 수 있습니다
          </p>
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
                <TableHead>회장</TableHead>
                <TableHead>태그</TableHead>
                <TableHead>건물</TableHead>
                <TableHead>회원수</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs.map(club => {
                const building = buildings.find(b => b.id === club.buildingId);
                const president = users.find(u => u.id === club.presidentId);
                return (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">{club.name}</TableCell>
                    <TableCell>
                      {president ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{president.name}</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">미지정</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {club.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {club.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{club.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell>{club.memberCount}명</TableCell>
                    <TableCell>
                      <Badge variant={club.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {club.status === 'ACTIVE' ? '활성' : '비활성'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(club)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(club)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClub ? '동아리 수정' : '동아리 추가'}
            </DialogTitle>
            <DialogDescription>
              동아리 정보를 입력해주세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">동아리 이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">썸네일 URL</Label>
              <Input
                id="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
              <Input
                id="tags"
                placeholder="개발, 학술, 프로젝트"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buildingId">건물 *</Label>
                <Select
                  value={formData.buildingId}
                  onValueChange={(value) => setFormData({ ...formData, buildingId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="건물 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map(building => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityLocation">활동 장소</Label>
                <Input
                  id="activityLocation"
                  value={formData.activityLocation}
                  onChange={(e) => setFormData({ ...formData, activityLocation: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recruitmentStart">모집 시작일</Label>
                <Input
                  id="recruitmentStart"
                  type="date"
                  value={formData.recruitmentStart}
                  onChange={(e) => setFormData({ ...formData, recruitmentStart: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recruitmentEnd">모집 종료일</Label>
                <Input
                  id="recruitmentEnd"
                  type="date"
                  value={formData.recruitmentEnd}
                  onChange={(e) => setFormData({ ...formData, recruitmentEnd: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="memberCount">회원 수</Label>
                <Input
                  id="memberCount"
                  type="number"
                  value={formData.memberCount}
                  onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'ACTIVE' | 'INACTIVE') => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">활성</SelectItem>
                    <SelectItem value="INACTIVE">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="presidentId">회장 *</Label>
              <Select
                value={formData.presidentId}
                onValueChange={(value) => setFormData({ ...formData, presidentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="회장 선택" />
                </SelectTrigger>
                <SelectContent>
                  {presidents.map(president => (
                    <SelectItem key={president.id} value={president.id}>
                      <User className="w-4 h-4 mr-2" />
                      {president.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {editingClub ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}