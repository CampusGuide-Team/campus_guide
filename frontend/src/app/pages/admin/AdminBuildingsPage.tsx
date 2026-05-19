import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { getBuildings, getClubs } from '../../data/mockData';
import { Building } from '../../types';
import { toast } from 'sonner';

export function AdminBuildingsPage() {
  const [buildings, setBuildings] = useState(getBuildings());
  const clubs = getClubs();
  const [showDialog, setShowDialog] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: 37.5419,
    longitude: 127.0778,
  });

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setFormData({
      name: building.name,
      description: building.description,
      latitude: building.latitude,
      longitude: building.longitude,
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingBuilding(null);
    setFormData({
      name: '',
      description: '',
      latitude: 37.5419,
      longitude: 127.0778,
    });
    setShowDialog(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    if (editingBuilding) {
      // Update existing building
      const updatedBuilding: Building = {
        ...editingBuilding,
        name: formData.name,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      const updatedBuildings = buildings.map(b => 
        b.id === editingBuilding.id ? updatedBuilding : b
      );
      setBuildings(updatedBuildings);
      localStorage.setItem('buildings', JSON.stringify(updatedBuildings));
      toast.success('건물 정보가 수정되었습니다');
    } else {
      // Create new building
      const newBuilding: Building = {
        id: `building-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      const updatedBuildings = [...buildings, newBuilding];
      setBuildings(updatedBuildings);
      localStorage.setItem('buildings', JSON.stringify(updatedBuildings));
      toast.success('건물이 추가되었습니다');
    }

    setShowDialog(false);
  };

  const handleDelete = (building: Building) => {
    // Check if any clubs are using this building
    const clubsInBuilding = clubs.filter(c => c.buildingId === building.id);
    if (clubsInBuilding.length > 0) {
      toast.error(`이 건물을 사용하는 동아리가 ${clubsInBuilding.length}개 있습니다`);
      return;
    }

    if (confirm(`정말 "${building.name}" 건물을 삭제하시겠습니까?`)) {
      const updatedBuildings = buildings.filter(b => b.id !== building.id);
      setBuildings(updatedBuildings);
      localStorage.setItem('buildings', JSON.stringify(updatedBuildings));
      toast.success('건물이 삭제되었습니다');
    }
  };

  const getClubCount = (buildingId: string) => {
    return clubs.filter(c => c.buildingId === buildingId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">건물 관리</h1>
          <p className="text-gray-600">
            캠퍼스 건물을 추가, 수정, 삭제할 수 있습니다
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          건물 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>전체 건물 ({buildings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>건물명</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>좌표</TableHead>
                <TableHead>동아리 수</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildings.map(building => (
                <TableRow key={building.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {building.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-gray-600 truncate">
                      {building.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {building.latitude.toFixed(4)}, {building.longitude.toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {getClubCount(building.id)}개
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(building)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(building)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingBuilding ? '건물 수정' : '건물 추가'}
            </DialogTitle>
            <DialogDescription>
              건물 정보를 입력해주세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">건물명 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 본관"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="건물에 대한 설명을 입력하세요"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">위도 (Latitude)</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">경도 (Longitude)</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="text-blue-900 font-medium mb-1">💡 좌표 정보</p>
              <p className="text-blue-700 text-xs">
                건국대학교 서울캠퍼스의 대략적인 좌표: 위도 37.54, 경도 127.07
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {editingBuilding ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
