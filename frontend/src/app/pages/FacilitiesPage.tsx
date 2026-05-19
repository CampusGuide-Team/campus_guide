import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { MapPin, Search, X, Phone, Clock, Building as BuildingIcon, Users } from 'lucide-react';
import { getFacilities, getBuildings } from '../data/mockData';
import { Facility, FacilityType } from '../types';
import { Badge } from '../components/ui/badge';
import { KakaoMap } from '../components/KakaoMap';

const FACILITY_TYPES: FacilityType[] = ['행정부서', '학과', '편의시설', '체육시설', '기타'];

const FACILITY_TYPE_COLORS: Record<FacilityType, string> = {
  '행정부서': 'bg-blue-100 text-blue-700',
  '학과': 'bg-purple-100 text-purple-700',
  '편의시설': 'bg-green-100 text-green-700',
  '체육시설': 'bg-orange-100 text-orange-700',
  '기타': 'bg-gray-100 text-gray-700',
};

const FACILITY_TYPE_ICONS: Record<FacilityType, string> = {
  '행정부서': '🏛️',
  '학과': '📚',
  '편의시설': '🏪',
  '체육시설': '⚽',
  '기타': '📍',
};

export function FacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'facilities' | 'buildings'>('facilities');
  const facilities = getFacilities();
  const buildings = getBuildings();

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = searchQuery === '' ||
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedTypes.length === 0 ||
      selectedTypes.includes(facility.type);

    return matchesSearch && matchesType;
  });

  const filteredBuildings = buildings.filter(building => {
    const matchesSearch = searchQuery === '' ||
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const toggleType = (type: FacilityType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
  };

  const getFacilityCount = (buildingId: string) => {
    return facilities.filter(f => f.buildingId === buildingId).length;
  };

  const getBuilding = (buildingId: string) => {
    return buildings.find(b => b.id === buildingId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">캠퍼스 시설 찾기</h1>
        <p className="text-sm md:text-base text-gray-600">
          국립한국교통대학교 시설 위치를 확인하세요
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border p-4 md:p-6 space-y-4">
        <div className="flex gap-2 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="시설 또는 건물 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {(searchQuery || selectedTypes.length > 0) && (
            <Button variant="ghost" onClick={clearFilters} size="sm">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'facilities' ? 'default' : 'outline'}
            onClick={() => setViewMode('facilities')}
            className="flex-1 sm:flex-initial"
          >
            시설
          </Button>
          <Button
            variant={viewMode === 'buildings' ? 'default' : 'outline'}
            onClick={() => setViewMode('buildings')}
            className="flex-1 sm:flex-initial"
          >
            건물
          </Button>
        </div>

        {/* Type Filters - Only show for facilities */}
        {viewMode === 'facilities' && (
          <div className="flex flex-wrap gap-2">
            {FACILITY_TYPES.map(type => (
              <Badge
                key={type}
                variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                className="cursor-pointer text-sm"
                onClick={() => toggleType(type)}
              >
                <span className="mr-1">{FACILITY_TYPE_ICONS[type]}</span>
                {type}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-semibold">
            {viewMode === 'facilities'
              ? `${filteredFacilities.length}개의 시설`
              : `${filteredBuildings.length}개의 건물`
            }
          </h2>
        </div>

        {viewMode === 'facilities' ? (
          // Facilities View
          filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredFacilities.map(facility => {
                const building = getBuilding(facility.buildingId);
                return (
                  <Card
                    key={facility.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedFacility(facility)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="text-2xl">{FACILITY_TYPE_ICONS[facility.type]}</span>
                          <span>{facility.name}</span>
                        </CardTitle>
                        <Badge className={FACILITY_TYPE_COLORS[facility.type]} variant="secondary">
                          {facility.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {facility.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <BuildingIcon className="w-4 h-4 shrink-0" />
                          <span className="font-medium">{building?.name} {facility.floor}</span>
                        </div>
                        {facility.roomNumber && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span>{facility.roomNumber}</span>
                          </div>
                        )}
                        {facility.openingHours && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 shrink-0" />
                            <span className="text-xs">{facility.openingHours}</span>
                          </div>
                        )}
                      </div>
                      <Button className="w-full mt-2" size="sm">
                        위치 보기
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
              <p className="text-gray-400 text-sm mt-2">
                다른 검색어를 시도해보세요
              </p>
            </div>
          )
        ) : (
          // Buildings View
          filteredBuildings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredBuildings.map(building => {
                const facilityCount = getFacilityCount(building.id);
                return (
                  <Card
                    key={building.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedBuilding(building)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BuildingIcon className="w-6 h-6 text-blue-600" />
                        <span>{building.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {building.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>{building.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4 shrink-0" />
                          <span>{facilityCount}개 시설</span>
                        </div>
                      </div>
                      <Button className="w-full mt-2" size="sm">
                        위치 보기
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border">
              <BuildingIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
              <p className="text-gray-400 text-sm mt-2">
                다른 검색어를 시도해보세요
              </p>
            </div>
          )
        )}
      </div>

      {/* Building Detail Dialog with Map */}
      {selectedBuilding && (
        <Dialog open={!!selectedBuilding} onOpenChange={() => setSelectedBuilding(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <BuildingIcon className="w-6 h-6 text-blue-600" />
                {selectedBuilding.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Building Info */}
              <div className="space-y-3">
                <p className="text-gray-700">{selectedBuilding.description}</p>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">위치</p>
                    <p className="text-sm text-gray-600">{selectedBuilding.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-gray-600 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">입주 시설</p>
                    <p className="font-medium">{getFacilityCount(selectedBuilding.id)}개</p>
                  </div>
                </div>
              </div>

              {/* Kakao Map */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  건물 위치
                </h3>
                <KakaoMap
                  latitude={selectedBuilding.latitude}
                  longitude={selectedBuilding.longitude}
                  name={selectedBuilding.name}
                />
              </div>

              {/* Facilities in this Building */}
              {getFacilityCount(selectedBuilding.id) > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    이 건물의 시설 ({getFacilityCount(selectedBuilding.id)}개)
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {facilities
                      .filter(f => f.buildingId === selectedBuilding.id)
                      .map(facility => (
                        <div
                          key={facility.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedBuilding(null);
                            setSelectedFacility(facility);
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2">
                              <span className="text-xl">{FACILITY_TYPE_ICONS[facility.type]}</span>
                              <div>
                                <h4 className="font-medium">{facility.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {facility.floor} {facility.roomNumber && `• ${facility.roomNumber}`}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className={`${FACILITY_TYPE_COLORS[facility.type]} text-xs`}>
                              {facility.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedBuilding(null)}
                >
                  닫기
                </Button>
                <Button
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => {
                    window.open(
                      `https://map.kakao.com/link/map/${encodeURIComponent(selectedBuilding.name)},${selectedBuilding.latitude},${selectedBuilding.longitude}`,
                      '_blank'
                    );
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.477 3 2 6.477 2 10.5C2 13.815 4.661 16.575 8.217 17.478L9.5 21.5L13.783 17.478C17.339 16.575 20 13.815 20 10.5C20 6.477 15.523 3 12 3Z" />
                  </svg>
                  카카오맵에서 보기
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Facility Detail Dialog with Map */}
      {selectedFacility && (
        <Dialog open={!!selectedFacility} onOpenChange={() => setSelectedFacility(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <span className="text-3xl">{FACILITY_TYPE_ICONS[selectedFacility.type]}</span>
                {selectedFacility.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Facility Info */}
              <div className="space-y-3">
                <Badge className={FACILITY_TYPE_COLORS[selectedFacility.type]} variant="secondary">
                  {selectedFacility.type}
                </Badge>
                <p className="text-gray-700">{selectedFacility.description}</p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <BuildingIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getBuilding(selectedFacility.buildingId)?.name} {selectedFacility.floor}
                      </p>
                      {selectedFacility.roomNumber && (
                        <p className="text-sm text-gray-600">{selectedFacility.roomNumber}</p>
                      )}
                    </div>
                  </div>

                  {selectedFacility.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">전화번호</p>
                        <p className="font-medium">{selectedFacility.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedFacility.openingHours && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">운영시간</p>
                        <p className="font-medium">{selectedFacility.openingHours}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Building Location Map */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  건물 위치
                </h3>
                <KakaoMap
                  latitude={getBuilding(selectedFacility.buildingId)?.latitude || 0}
                  longitude={getBuilding(selectedFacility.buildingId)?.longitude || 0}
                  name={getBuilding(selectedFacility.buildingId)?.name || ''}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedFacility(null)}
                >
                  닫기
                </Button>
                <Button
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => {
                    const building = getBuilding(selectedFacility.buildingId);
                    if (building) {
                      window.open(
                        `https://map.kakao.com/link/map/${encodeURIComponent(building.name)},${building.latitude},${building.longitude}`,
                        '_blank'
                      );
                    }
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.477 3 2 6.477 2 10.5C2 13.815 4.661 16.575 8.217 17.478L9.5 21.5L13.783 17.478C17.339 16.575 20 13.815 20 10.5C20 6.477 15.523 3 12 3Z" />
                  </svg>
                  카카오맵에서 보기
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
