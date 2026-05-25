import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Building, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { api } from '../../utils/api';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalBuildings: 0,
    totalApplications: 0,
    submittedApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubs, buildings, applications] = await Promise.all([
          api.get('/clubs'),
          api.get('/buildings'),
          api.get('/applications'),
        ]);
        setStats({
          totalClubs: clubs.length,
          totalBuildings: buildings.length,
          totalApplications: applications.length,
          submittedApplications: applications.filter((a: any) => a.status === 'SUBMITTED').length,
          acceptedApplications: applications.filter((a: any) => a.status === 'ACCEPTED').length,
          rejectedApplications: applications.filter((a: any) => a.status === 'REJECTED').length,
        });
        setRecentApplications(applications.slice(0, 5));
      } catch (e) {
        console.error('데이터 조회 실패', e);
      }
    };
    fetchData();
  }, []);

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
          <p className="text-gray-600">KU Navigator 전체 현황을 확인할 수 있습니다</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">전체 동아리</CardTitle>
              <Users className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClubs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">전체 건물</CardTitle>
              <Building className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBuildings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">전체 신청</CardTitle>
              <FileText className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">대기 중 신청</CardTitle>
              <Clock className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.submittedApplications}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">검토 중</CardTitle>
              <Clock className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.submittedApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">승인됨</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.acceptedApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">거절됨</CardTitle>
              <XCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.rejectedApplications}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <p className="font-medium">{app.clubName}</p>
                      <p className="text-sm text-gray-500">
                        신청일: {new Date(app.appliedAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div>
                      {app.status === 'SUBMITTED' && <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">검토 중</span>}
                      {app.status === 'ACCEPTED' && <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">승인됨</span>}
                      {app.status === 'REJECTED' && <span className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">거절됨</span>}
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}