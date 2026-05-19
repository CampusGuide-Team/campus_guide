import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Building, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getClubs, getBuildings, getApplications } from '../../data/mockData';

export function AdminDashboardPage() {
  const clubs = getClubs();
  const buildings = getBuildings();
  const applications = getApplications();

  const stats = {
    totalClubs: clubs.length,
    activeClubs: clubs.filter(c => c.status === 'ACTIVE').length,
    totalBuildings: buildings.length,
    totalApplications: applications.length,
    submittedApplications: applications.filter(a => a.status === 'SUBMITTED').length,
    acceptedApplications: applications.filter(a => a.status === 'ACCEPTED').length,
    rejectedApplications: applications.filter(a => a.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
        <p className="text-gray-600">
          KU Navigator 전체 현황을 확인할 수 있습니다
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              전체 동아리
            </CardTitle>
            <Users className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClubs}</div>
            <p className="text-xs text-gray-500 mt-1">
              활성화: {stats.activeClubs}개
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              전체 건물
            </CardTitle>
            <Building className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBuildings}</div>
            <p className="text-xs text-gray-500 mt-1">
              캠퍼스 주요 건물
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              전체 신청
            </CardTitle>
            <FileText className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-gray-500 mt-1">
              모든 동아리 신청
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              대기 중 신청
            </CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.submittedApplications}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              처리 필요
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              검토 중
            </CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {stats.submittedApplications}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              승인됨
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.acceptedApplications}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              거절됨
            </CardTitle>
            <XCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {stats.rejectedApplications}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.slice(0, 5).map(app => {
              const club = clubs.find(c => c.id === app.clubId);
              return (
                <div key={app.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <p className="font-medium">{club?.name}</p>
                    <p className="text-sm text-gray-500">
                      신청일: {new Date(app.appliedAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-right">
                    {app.status === 'SUBMITTED' && (
                      <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        검토 중
                      </span>
                    )}
                    {app.status === 'ACCEPTED' && (
                      <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                        승인됨
                      </span>
                    )}
                    {app.status === 'REJECTED' && (
                      <span className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">
                        거절됨
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
