import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export function KakaoMap({ latitude, longitude, name }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

    // API 키가 없으면 플레이스홀더 표시
    if (!KAKAO_API_KEY || KAKAO_API_KEY === 'your_api_key_here') {
      setError(true);
      return;
    }

    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      initializeMap();
      return;
    }

    // Kakao Maps SDK 로드
    const script = document.createElement('script');

    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log('SDK loaded');

      window.kakao.maps.load(() => {
        console.log('kakao.maps.load success');
        initializeMap();
      });
    };

    script.onerror = (e) => {
      console.error('Kakao Maps SDK 로드 실패', e);
      setError(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup (스크립트는 한 번만 로드되도록 유지)
    };
  }, [latitude, longitude, name]);

  const initializeMap = () => {

    console.log('initializeMap 호출');

    if (!mapContainer.current) return;

    try {
      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);

      // 마커 추가
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);

      // 인포윈도우 추가
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:8px 12px;font-size:14px;font-weight:500;">${name}</div>`,
      });
      infowindow.open(map, marker);

      setMapLoaded(true);
    } catch (err) {
      console.error('지도 초기화 실패:', err);
      setError(true);
    }
  };

  // API 키가 없거나 에러가 발생한 경우 플레이스홀더 표시
  if (error || !import.meta.env.VITE_KAKAO_MAP_API_KEY) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="30" fill="currentColor" className="text-yellow-600" />
            <circle cx="50" cy="50" r="20" fill="white" />
            <circle cx="50" cy="50" r="10" fill="currentColor" className="text-yellow-600" />
          </svg>
        </div>
        <div className="text-center p-8 relative z-10">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <MapPin className="w-12 h-12 text-yellow-600" />
          </div>
          <p className="font-semibold text-lg text-gray-800 mb-2">{name}</p>
          <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm">
            <p className="text-xs text-gray-500 mb-1">좌표</p>
            <p className="text-xs font-mono text-gray-700">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            카카오맵 API 키를 설정하면 지도가 표시됩니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden border">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
