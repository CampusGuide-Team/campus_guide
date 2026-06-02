export type UserRole = 'user' | 'admin' | 'president';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string; // For mock authentication
  studentId?: string;
  phone?: string; // 전화번호
  department?: string; // 학과
  createdAt: string;
}

export interface Building {
  id: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}

export type FacilityType =
  | '행정부서'
  | '학과'
  | '편의시설'
  | '체육시설'
  | '기타';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  description: string;
  buildingId: string;
  floor: string; // "1층", "2층", "지하 1층" 등
  roomNumber?: string; // 호실 번호 (선택)
  phone?: string; // 전화번호 (선택)
  openingHours?: string; // 운영시간 (선택)
}

export interface Club {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  buildingId: string;
  recruitmentStart: string;
  recruitmentEnd: string;
  status: 'ACTIVE' | 'INACTIVE';
  presidentId: string;
  activityLocation: string;
  memberCount: number;
  category: string;
  applicationStartDate?: string; // 신청 시작일
  applicationEndDate?: string;   // 신청 마감일
  createdAt: string;
}

export type ApplicationStatus = 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  id: string;
  clubId: string;
  userId: string;
  status: ApplicationStatus;
  introduction: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;

    latitude?: number | null;
    longitude?: number | null;
    placeName?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}