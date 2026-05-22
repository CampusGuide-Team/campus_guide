import { useState, useMemo, useEffect } from 'react';
import { ClubCard } from '../components/ClubCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, X } from 'lucide-react';
import { api } from '../utils/api';

const ALL_TAGS = ['개발', '운동', '음악', '문화', '학술', '프로젝트', '친선경기', '공연', '취미', '영화', '토론', '로봇', 'AI', '사진', '예술', '전시회', '축구', '농구', '댄스', 'K-POP'];

export function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        if (searchQuery) {
          const data = await api.get(`/clubs/search?keyword=${searchQuery}`);
          setClubs(data);
        } else {
          const data = await api.get('/clubs');
          setClubs(data);
        }
      } catch (e) {
        console.error('동아리 목록 조회 실패', e);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, [searchQuery]);

  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => club.tags?.includes(tag));
      return matchesTags;
    });
  }, [clubs, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">동아리 탐색</h1>
        <p className="text-gray-600">
          국립한국교통대학교의 다양한 동아리를 검색하고 필터링해보세요
        </p>
      </div>

      <div className="bg-white rounded-lg border p-4 md:p-6 space-y-4">
        <div className="flex gap-2 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {(searchQuery || selectedTags.length > 0) && (
            <Button variant="ghost" onClick={clearFilters} size="sm">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-3 text-sm md:text-base">태그로 필터링</h3>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer text-sm"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {loading ? '로딩 중...' : `${filteredClubs.length}개의 동아리`}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map(club => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
            <p className="text-gray-400 text-sm mt-2">
              다른 검색어나 필터를 시도해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}