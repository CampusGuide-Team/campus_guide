import { Link } from 'react-router';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users } from 'lucide-react';

interface ClubCardProps {
  club: any;
}

export function ClubCard({ club }: ClubCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-gray-200">
        <img
          src={club.thumbnailUrl || '/placeholder.png'}
          alt={club.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <h3 className="font-semibold text-lg">{club.name}</h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {club.category && (
            <Badge variant="secondary" className="text-xs">
              {club.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>
        <div className="mt-4 text-sm text-gray-500">
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