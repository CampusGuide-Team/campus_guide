import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [form, setForm] = useState({
        studentId: '',
        phone: '',
        department: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/users/me/profile').then((data: any) => {
            setUser(data);
            setForm({
                studentId: data.studentId || '',
                phone: data.phone || '',
                department: data.department || '',
            });
        }).catch(() => {
            setError('유저 정보를 불러오지 못했습니다');
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setError('');
        if (!form.studentId || !form.phone || !form.department) {
            setError('모든 필드를 입력해주세요');
            return;
        }
        try {
            const updated = await api.patch('/users/me', form);
            localStorage.setItem('user_info', JSON.stringify(updated));
            toast.success('정보가 저장되었습니다');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (e) {
            setError('저장에 실패했습니다');
        }
    };

    if (loading) return <div className="text-center py-16">로딩 중...</div>;

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <h1 className="text-3xl font-bold">내 정보</h1>

            <Card>
                <CardHeader>
                    <CardTitle>기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label>이름</Label>
                        <Input value={user?.name || ''} disabled className="bg-gray-50" />
                    </div>

                    <div className="space-y-2">
                        <Label>이메일</Label>
                        <Input value={user?.email || ''} disabled className="bg-gray-50" />
                    </div>

                    <div className="space-y-2">
                        <Label>학번 *</Label>
                        <Input
                            placeholder="202012345"
                            value={form.studentId}
                            onChange={(e) => handleChange('studentId', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>전화번호 *</Label>
                        <Input
                            placeholder="010-1234-5678"
                            value={form.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>학과 *</Label>
                        <Input
                            placeholder="컴퓨터공학과"
                            value={form.department}
                            onChange={(e) => handleChange('department', e.target.value)}
                        />
                    </div>

                    <Button className="w-full" onClick={handleSubmit}>
                        저장하기
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}