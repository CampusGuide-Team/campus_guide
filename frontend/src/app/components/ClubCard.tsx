import { Link } from 'react-router';
import { Club } from '../types';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Users } from 'lucide-react';
import { getBuildings } from '../data/mockData';

interface ClubCardProps {
  club: Club;
}

export function ClubCard({ club }: ClubCardProps) {
  const buildings = getBuildings();
  const building = buildings.find(b => b.id === club.buildingId);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-gray-200">
        <img
          src={club.thumbnailUrl}
          alt={club.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <h3 className="font-semibold text-lg">{club.name}</h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {club.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>
        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{building?.name || '위치 정보 없음'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{club.memberCount}명</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/clubs/${club.id}`} className="w-full">
          <Button className="w-full">자세히 보기</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
