import { User, Building, Club, Application, Facility } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'student@a.ut.ac.kr',
    password: '1234',
    name: '김학생',
    role: 'user',
    studentId: '202012345',
    phone: '010-1234-5678',
    department: '컴퓨터공학과',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@a.ut.ac.kr',
    password: '1234',
    name: '관리자',
    role: 'admin',
    phone: '010-0000-0000',
    createdAt: '2023-01-01T09:00:00Z',
  },
  {
    id: 'user-2',
    email: 'president1@a.ut.ac.kr',
    password: '1234',
    name: '이회장',
    role: 'president',
    studentId: '202011111',
    phone: '010-1111-1111',
    department: '컴퓨터공학과',
    createdAt: '2023-03-01T09:00:00Z',
  },
  {
    id: 'user-3',
    email: 'student2@a.ut.ac.kr',
    password: '1234',
    name: '박학생',
    role: 'user',
    studentId: '202012346',
    phone: '010-2222-2222',
    department: '기계공학과',
    createdAt: '2024-01-20T09:00:00Z',
  },
  {
    id: 'user-4',
    email: 'student3@a.ut.ac.kr',
    password: '1234',
    name: '최학생',
    role: 'user',
    studentId: '202012347',
    phone: '010-3333-3333',
    department: '전자공학과',
    createdAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'user-5',
    email: 'president2@a.ut.ac.kr',
    password: '1234',
    name: '정회장',
    role: 'president',
    studentId: '202022222',
    phone: '010-4444-4444',
    department: '체육학과',
    createdAt: '2023-05-01T09:00:00Z',
  },
  {
    id: 'user-6',
    email: 'president3@a.ut.ac.kr',
    password: '1234',
    name: '강회장',
    role: 'president',
    studentId: '202033333',
    phone: '010-5555-5555',
    department: '음악학과',
    createdAt: '2023-06-01T09:00:00Z',
  },
];

export const mockBuildings: Building[] = [
  {
    id: 'building-1',
    name: '본관',
    location: '캠퍼스 중앙',
    description: '국립한국교통대학교 본관 건물입니다. 행정실과 주요 사무실이 위치해있습니다.',
    latitude: 37.5419,
    longitude: 127.0778,
  },
  {
    id: 'building-2',
    name: '학생회관',
    location: '본관 서쪽',
    description: '학생 동아리실과 식당이 위치한 건물입니다.',
    latitude: 37.5425,
    longitude: 127.0765,
  },
  {
    id: 'building-3',
    name: '신공학관',
    location: '본관 동쪽',
    description: '공학 관련 강의실과 실습실이 있는 건물입니다.',
    latitude: 37.5410,
    longitude: 127.0790,
  },
  {
    id: 'building-4',
    name: '상허연구관',
    location: '본관 북쪽',
    description: '연구실과 세미나실이 위치한 건물입니다.',
    latitude: 37.5430,
    longitude: 127.0785,
  },
  {
    id: 'building-5',
    name: '예술문화관',
    location: '본관 남서쪽',
    description: '예술 관련 동아리와 공연장이 있는 건물입니다.',
    latitude: 37.5415,
    longitude: 127.0770,
  },
];

export const mockFacilities: Facility[] = [
  // 행정부서
  {
    id: 'facility-1',
    name: '학생과',
    type: '행정부서',
    description: '학적 관리, 증명서 발급, 장학금 업무를 담당합니다.',
    buildingId: 'building-1',
    floor: '1층',
    roomNumber: '101호',
    phone: '043-841-5001',
    openingHours: '평일 09:00-18:00',
  },
  {
    id: 'facility-2',
    name: '학사관리과',
    type: '행정부서',
    description: '수강신청, 성적 관리, 학사 일정 관리를 담당합니다.',
    buildingId: 'building-1',
    floor: '1층',
    roomNumber: '105호',
    phone: '043-841-5002',
    openingHours: '평일 09:00-18:00',
  },
  {
    id: 'facility-3',
    name: '후생팀',
    type: '행정부서',
    description: '복지, 기숙사, 식당 운영 등을 담당합니다.',
    buildingId: 'building-2',
    floor: '2층',
    roomNumber: '201호',
    phone: '043-841-5003',
    openingHours: '평일 09:00-18:00',
  },
  // 학과
  {
    id: 'facility-4',
    name: '소프트웨어학과',
    type: '학과',
    description: '소프트웨어공학, 프로그래밍, 시스템 설계 등을 교육합니다.',
    buildingId: 'building-3',
    floor: '5층',
    roomNumber: '501호',
    phone: '043-841-5201',
  },
  {
    id: 'facility-5',
    name: '영어영문학과',
    type: '학과',
    description: '영어, 영문학, 언어학 관련 교육을 제공합니다.',
    buildingId: 'building-1',
    floor: '3층',
    roomNumber: '301호',
    phone: '043-841-5301',
  },
  {
    id: 'facility-6',
    name: '기계공학과',
    type: '학과',
    description: '기계설계, 열역학, 유체역학 등을 교육합니다.',
    buildingId: 'building-3',
    floor: '3층',
    roomNumber: '302호',
    phone: '043-841-5202',
  },
  {
    id: 'facility-7',
    name: '전자공학과',
    type: '학과',
    description: '전자회로, 디지털시스템, 통신공학 등을 교육합니다.',
    buildingId: 'building-3',
    floor: '4층',
    roomNumber: '401호',
    phone: '043-841-5203',
  },
  // 편의시설
  {
    id: 'facility-8',
    name: 'CU 편의점',
    type: '편의시설',
    description: '생활용품, 음료, 간식 등을 판매합니다.',
    buildingId: 'building-2',
    floor: '1층',
    openingHours: '평일 08:00-22:00, 주말 10:00-20:00',
  },
  {
    id: 'facility-9',
    name: 'GS25 편의점',
    type: '편의시설',
    description: '24시간 운영하는 편의점입니다.',
    buildingId: 'building-1',
    floor: '지하 1층',
    openingHours: '24시간',
  },
  {
    id: 'facility-10',
    name: '학생식당',
    type: '편의시설',
    description: '저렴한 가격의 학생 식사를 제공합니다.',
    buildingId: 'building-2',
    floor: '1층',
    openingHours: '평일 11:30-14:00, 17:00-19:00',
  },
  // 체육시설
  {
    id: 'facility-11',
    name: '헬스장',
    type: '체육시설',
    description: '러닝머신, 웨이트 기구 등 운동 시설을 갖추고 있습니다.',
    buildingId: 'building-2',
    floor: '지하 1층',
    openingHours: '평일 06:00-22:00, 주말 09:00-18:00',
  },
  {
    id: 'facility-12',
    name: '농구장',
    type: '체육시설',
    description: '실내 농구장으로 대관 가능합니다.',
    buildingId: 'building-2',
    floor: '3층',
    openingHours: '평일 09:00-21:00',
  },
  // 기타
  {
    id: 'facility-13',
    name: '중앙도서관',
    type: '기타',
    description: '열람실, 자료실, 스터디룸을 갖춘 도서관입니다.',
    buildingId: 'building-4',
    floor: '1-4층',
    openingHours: '평일 07:00-23:00, 주말 09:00-20:00',
  },
  {
    id: 'facility-14',
    name: '컴퓨터실습실',
    type: '기타',
    description: '고성능 PC를 갖춘 실습실입니다.',
    buildingId: 'building-3',
    floor: '2층',
    roomNumber: '201호',
    openingHours: '평일 09:00-21:00',
  },
];

export const mockClubs: Club[] = [
  {
    id: 'club-1',
    name: 'KUICS',
    category: '학술/공학',
    description: '국립한국교통대학교 컴퓨터공학과 학술 동아리입니다. 알고리즘, 웹 개발, 모바일 앱 개발 등 다양한 IT 분야를 함께 공부하고 프로젝트를 진행합니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    tags: ['개발', '학술', '프로젝트'],
    buildingId: 'building-3',
    recruitmentStart: '2026-03-01T00:00:00Z',
    recruitmentEnd: '2026-04-30T23:59:59Z',
    status: 'ACTIVE',
    presidentId: 'user-2',
    activityLocation: '신공학관 512호',
    memberCount: 45,
    applicationStartDate: '2026-03-01T00:00:00Z',
    applicationEndDate: '2026-04-30T23:59:59Z',
    createdAt: '2020-03-01T09:00:00Z',
  },
  {
    id: 'club-2',
    name: '농구 동아리 SLAM',
    category: '체육',
    description: '농구를 사랑하는 사람들의 모임입니다. 초보자부터 경험자까지 모두 환영합니다. 주 2회 정기 연습과 타 대학 친선 경기를 진행합니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    tags: ['운동', '농구', '친선경기'],
    buildingId: 'building-2',
    recruitmentStart: '2026-03-01T00:00:00Z',
    recruitmentEnd: '2026-04-15T23:59:59Z',
    status: 'ACTIVE',
    presidentId: 'user-2',
    activityLocation: '체육관',
    memberCount: 32,
    applicationStartDate: '2026-03-01T00:00:00Z',
    applicationEndDate: '2026-03-20T23:59:59Z',
    createdAt: '2019-03-01T09:00:00Z',
  },
  {
    id: 'club-3',
    name: '어쿠스틱 기타 동아리',
    category: '문화/예술',
    description: '어쿠스틱 기타 연주를 배우고 함께 합주하는 동아리입니다. 정기 공연과 버스킹 활동을 진행합니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
    tags: ['음악', '공연', '취미'],
    buildingId: 'building-5',
    recruitmentStart: '2026-03-01T00:00:00Z',
    recruitmentEnd: '2026-04-30T23:59:59Z',
    status: 'ACTIVE',
    presidentId: 'user-2',
    activityLocation: '예술문화관 302호',
    memberCount: 28,
    applicationStartDate: '2026-03-01T00:00:00Z',
    applicationEndDate: '2026-04-30T23:59:59Z',
    createdAt: '2018-03-01T09:00:00Z',
  },
  {
    id: 'club-4',
    name: '영화 감상 동아리 CINE',
    category: '문화/예술',
    description: '매주 영화를 함께 보고 토론하는 동아리입니다. 다양한 장르의 영화를 감상하고 영화제 관람도 함께 합니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    tags: ['문화', '영화', '토론'],
    buildingId: 'building-5',
    recruitmentStart: '2026-03-01T00:00:00Z',
    recruitmentEnd: '2026-04-30T23:59:59Z',
    status: 'ACTIVE',
    presidentId: 'user-2',
    activityLocation: '예술문화관 201호',
    memberCount: 35,
    applicationStartDate: '2026-03-01T00:00:00Z',
    applicationEndDate: '2026-04-30T23:59:59Z',
    createdAt: '2019-09-01T09:00:00Z',
  },
  {
    id: 'club-5',
    name: '로봇공학 동아리',
    category: '학술/공학',
    description: '로봇 제작과 인공지능을 연구하는 학술 동아리입니다. 로봇 경진대회 출전과 프로젝트 진행을 목표로 합니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    tags: ['개발', '로봇', '학술', 'AI'],
    buildingId: 'building-3',
    recruitmentStart: '2026-03-01T00:00:00Z',
    recruitmentEnd: '2026-04-20T23:59:59Z',
    status: 'ACTIVE',
    presidentId: 'user-2',
    activityLocation: '신공학관 601호',
    memberCount: 22,
    applicationStartDate: '2026-03-01T00:00:00Z',
    applicationEndDate: '2026-04-20T23:59:59Z',
    createdAt: '2021-03-01T09:00:00Z',
  },
  {
    id: 'club-6',
    name: '사진 동아리 FOCUS',
    category: '문화/예술',
    description: '사진 촬영 기술을 배우고 출사를 다니는 동아리입니다. 정기 전시회를 개최합니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
    tags: ['사진', '예술', '전시회'],
    buildingId: 'building-5',
    recruitmentStart: '2026-03-01T00:00:00Z',
    recruitmentEnd: '2026-04-30T23:59:59Z',
    status: 'ACTIVE',
    presidentId: 'user-2',
    activityLocation: '예술문화관 105호',
    memberCount: 18,
    applicationStartDate: '2026-03-01T00:00:00Z',
    applicationEndDate: '2026-04-30T23:59:59Z',
    createdAt: '2021-03-01T09:00:00Z',
  },
  {
    id: 'club-7',
    name: '축구 동아리 FC KU',
    category: '체육',
    description: '축구를 좋아하는 학우들의 모임입니다. 주말 친선경기와 대회 참가를 진행합니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    tags: ['운동', '축구', '친선경기'],
    buildingId: 'building-2',
    recruitmentStart: '2026-03-01T00:00:00Z',
    recruitmentEnd: '2026-04-10T23:59:59Z',
    status: 'ACTIVE',
    presidentId: 'user-2',
    activityLocation: '운동장',
    memberCount: 40,
    applicationStartDate: '2026-03-01T00:00:00Z',
    applicationEndDate: '2026-04-10T23:59:59Z',
    createdAt: '2018-09-01T09:00:00Z',
  },
  {
    id: 'club-8',
    name: '댄스 동아리 BEAT',
    category: '문화/예술',
    description: 'K-POP 댄스를 배우고 공연하는 동아리입니다. 커버 댄스와 창작 안무를 함께 만듭니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400',
    tags: ['댄스', '공연', 'K-POP'],
    buildingId: 'building-5',
    recruitmentStart: '2026-03-01T00:00:00Z',
    recruitmentEnd: '2026-04-25T23:59:59Z',
    status: 'ACTIVE',
    presidentId: 'user-2',
    activityLocation: '예술문화관 B101호',
    memberCount: 30,
    applicationStartDate: '2026-03-01T00:00:00Z',
    applicationEndDate: '2026-04-25T23:59:59Z',
    createdAt: '2019-03-01T09:00:00Z',
  },
];

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    clubId: 'club-1',
    userId: 'user-1',
    status: 'SUBMITTED',
    introduction: '안녕하세요! 컴퓨터공학과 3학년입니다. 웹 개발에 관심이 많아 지원하게 되었습니다. React와 Node.js를 공부하고 있으며, 팀 프로젝트 경험을 ���고 싶습니다.',
    appliedAt: '2026-03-20T14:30:00Z',
  },
  {
    id: 'app-2',
    clubId: 'club-2',
    userId: 'user-1',
    status: 'ACCEPTED',
    introduction: '농구를 정말 좋아합니다. 고등학교 때 선수 활동을 했으며, 대학에서도 계속하고 싶어서 지원합니다.',
    appliedAt: '2026-03-15T10:00:00Z',
    reviewedAt: '2026-03-16T15:00:00Z',
    reviewNote: '환영합니다! 다음 주 화요일 첫 연습에 참여해주세요.',
  },
  {
    id: 'app-3',
    clubId: 'club-1',
    userId: 'user-3',
    status: 'SUBMITTED',
    introduction: '안녕하세요! 기계공학과 2학년 박학생입니다. 프로그래밍을 배우고 싶어서 지원합니다. Python 기초를 공부 중이며, 동아리에서 많이 배우고 싶습니다.',
    appliedAt: '2026-03-21T10:00:00Z',
  },
  {
    id: 'app-4',
    clubId: 'club-1',
    userId: 'user-4',
    status: 'ACCEPTED',
    introduction: '안녕하세요! 전자공학과 2학년 최학생입니다. IoT와 임베디드 시스템에 관심이 많아 지원합니다. C/C++ 경험이 있고, 하드웨어와 소프트웨어를 결합한 프로젝트를 해보고 싶습니다.',
    appliedAt: '2026-03-19T16:00:00Z',
    reviewedAt: '2026-03-20T10:00:00Z',
    reviewNote: '합격을 축하합니다! 다음 주 월요일 오리엔테이션에 참석해주세요.',
  },
  {
    id: 'app-5',
    clubId: 'club-2',
    userId: 'user-3',
    status: 'SUBMITTED',
    introduction: '농구 동아리에 지원합니다. 고등학교 때부터 농구를 좋아했고, 대학에서도 계속 운동하고 싶어서 지원했습니다.',
    appliedAt: '2026-03-22T14:00:00Z',
  },
];

export const updateApplication = (id: string, updates: Partial<Application>) => {
  const applications = getApplications();
  const index = applications.findIndex(app => app.id === id);
  if (index !== -1) {
    applications[index] = { ...applications[index], ...updates };
    localStorage.setItem('applications', JSON.stringify(applications));
  }
};

export const updateClub = (id: string, updates: Partial<Club>) => {
  const clubs = getClubs();
  const index = clubs.findIndex(club => club.id === id);
  if (index !== -1) {
    clubs[index] = { ...clubs[index], ...updates };
    localStorage.setItem('clubs', JSON.stringify(clubs));
  }
};

export const deleteApplication = (id: string) => {
  const applications = getApplications();
  const filtered = applications.filter(app => app.id !== id);
  localStorage.setItem('applications', JSON.stringify(filtered));
};

// Mock 데이터 저장용 (LocalStorage 활용)
export const initializeMockData = () => {
  // 버전 체크를 통해 데이터 구조가 변경되었는지 확인
  const DATA_VERSION = '5.0'; // Google 로그인 전용 (@a.ut.ac.kr) 버전
  const currentVersion = localStorage.getItem('data_version');
  
  if (currentVersion !== DATA_VERSION) {
    // 버전이 다르면 모든 데이터 초기화
    localStorage.clear();
    localStorage.setItem('data_version', DATA_VERSION);
  }
  
  if (!localStorage.getItem('clubs')) {
    localStorage.setItem('clubs', JSON.stringify(mockClubs));
  }
  if (!localStorage.getItem('buildings')) {
    localStorage.setItem('buildings', JSON.stringify(mockBuildings));
  }
  if (!localStorage.getItem('facilities')) {
    localStorage.setItem('facilities', JSON.stringify(mockFacilities));
  }
  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify(mockApplications));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
};

export const getClubs = (): Club[] => {
  const data = localStorage.getItem('clubs');
  return data ? JSON.parse(data) : mockClubs;
};

export const getBuildings = (): Building[] => {
  const data = localStorage.getItem('buildings');
  return data ? JSON.parse(data) : mockBuildings;
};

export const getApplications = (): Application[] => {
  const data = localStorage.getItem('applications');
  return data ? JSON.parse(data) : mockApplications;
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem('users');
  return data ? JSON.parse(data) : mockUsers;
};

export const getFacilities = (): Facility[] => {
  const data = localStorage.getItem('facilities');
  return data ? JSON.parse(data) : mockFacilities;
};