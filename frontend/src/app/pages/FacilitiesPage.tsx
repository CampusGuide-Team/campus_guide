import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { MapPin, Search, X, Building as BuildingIcon } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { KakaoMap } from '../components/KakaoMap';
import { api } from '../utils/api';

const CATEGORY_COLORS: Record<string, string> = {
  '학과': 'bg-purple-100 text-purple-700',
  '편의시설': 'bg-green-100 text-green-700',
  '체육시설': 'bg-orange-100 text-orange-700',
  '행정시설': 'bg-blue-100 text-blue-700',
  '학생자치': 'bg-yellow-100 text-yellow-700',
  '기숙사': 'bg-pink-100 text-pink-700',
  '문화시설': 'bg-indigo-100 text-indigo-700',
  '학습시설': 'bg-teal-100 text-teal-700',
  '실습시설': 'bg-red-100 text-red-700',
};

export function FacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'places' | 'buildings'>('places');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuildings();
    fetchCategories();
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (viewMode === 'places') {
      fetchPlaces();
    }
  }, [viewMode, searchQuery, selectedCategory]);

  const fetchBuildings = async () => {
    try {
      const data = await api.get('/buildings');
      setBuildings(data);
    } catch (e) {
      console.error('건물 조회 실패', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get('/places/categories');
      setCategories(data);
    } catch (e) {
      console.error('카테고리 조회 실패', e);
    }
  };

  const fetchPlaces = async () => {
    try {
      let data;
      if (searchQuery) {
        data = await api.get(`/places/search?keyword=${searchQuery}`);
      } else if (selectedCategory) {
        data = await api.get(`/places/category?category=${encodeURIComponent(selectedCategory)}`);
      } else {
        data = await api.get('/places/search?keyword=');
      }
      setPlaces(data);
    } catch (e) {
      console.error('시설 조회 실패', e);
    }
  };

  const filteredBuildings = buildings.filter(b =>
      searchQuery === '' || b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  if (loading) return <div className="text-center py-16">로딩 중...</div>;

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">캠퍼스 시설 찾기</h1>
          <p className="text-sm md:text-base text-gray-600">
            국립한국교통대학교 시설 위치를 확인하세요
          </p>
        </div>

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
            {(searchQuery || selectedCategory) && (
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  <X className="w-4 h-4" />
                </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
                variant={viewMode === 'places' ? 'default' : 'outline'}
                onClick={() => setViewMode('places')}
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

          {viewMode === 'places' && (
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <Badge
                        key={cat}
                        variant={selectedCategory === cat ? 'default' : 'outline'}
                        className="cursor-pointer text-sm"
                        onClick={() => setSelectedCategory(prev => prev === cat ? '' : cat)}
                    >
                      {cat}
                    </Badge>
                ))}
              </div>
          )}
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-lg md:text-xl font-semibold">
              {viewMode === 'buildings'
                  ? `${filteredBuildings.length}개의 건물`
                  : `${places.length}개의 시설`}
            </h2>
          </div>

          {viewMode === 'buildings' ? (
              filteredBuildings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredBuildings.map(building => (
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
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{building.code}</span>
                            </div>
                            {building.category && (
                                <Badge variant="secondary">{building.category}</Badge>
                            )}
                            <Button className="w-full mt-2" size="sm">위치 보기</Button>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-16 bg-white rounded-lg border">
                    <p className="text-gray-500">검색 결과가 없습니다</p>
                  </div>
              )
          ) : (
              places.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {places.map(place => (
                        <Card
                            key={place.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedPlace(place)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-lg">{place.place}</CardTitle>
                              {place.category && (
                                  <Badge
                                      variant="secondary"
                                      className={CATEGORY_COLORS[place.category] || 'bg-gray-100 text-gray-700'}
                                  >
                                    {place.category}
                                  </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <BuildingIcon className="w-4 h-4" />
                              <span>{place.buildingName} {place.floor}층</span>
                            </div>
                            <Button className="w-full mt-2" size="sm">위치 보기</Button>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-16 bg-white rounded-lg border">
                    <p className="text-gray-500">검색 결과가 없습니다</p>
                  </div>
              )
          )}
        </div>

        {/* 건물 상세 다이얼로그 */}
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
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">건물 코드</p>
                      <p className="text-sm text-gray-600">{selectedBuilding.code}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">건물 위치</h3>
                    <KakaoMap
                        latitude={selectedBuilding.latitude}
                        longitude={selectedBuilding.longitude}
                        name={selectedBuilding.name}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedBuilding(null)}>
                      닫기
                    </Button>
                    <Button
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={() => window.open(
                            `https://map.kakao.com/link/to/${encodeURIComponent(selectedBuilding.name)},${selectedBuilding.latitude},${selectedBuilding.longitude}`,
                            '_blank'
                        )}
                    >
                      카카오맵에서 보기
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
        )}

        {/* 시설 상세 다이얼로그 */}
        {selectedPlace && (
            <Dialog open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedPlace.place}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {selectedPlace.category && (
                      <Badge
                          variant="secondary"
                          className={CATEGORY_COLORS[selectedPlace.category] || 'bg-gray-100 text-gray-700'}
                      >
                        {selectedPlace.category}
                      </Badge>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <BuildingIcon className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">{selectedPlace.buildingName} {selectedPlace.floor}층</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">건물 위치</h3>
                    <KakaoMap
                        latitude={selectedPlace.latitude}
                        longitude={selectedPlace.longitude}
                        name={selectedPlace.buildingName}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedPlace(null)}>
                      닫기
                    </Button>
                    <Button
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={() => window.open(
                            `https://map.kakao.com/link/to/${encodeURIComponent(selectedPlace.buildingName)},${selectedPlace.latitude},${selectedPlace.longitude}`,
                            '_blank'
                        )}
                    >
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
