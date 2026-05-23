import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { api } from '../utils/api';
import { toast } from 'sonner';

export function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        studentId: '',
        phone: '',
        department: '',
    });
    const [error, setError] = useState('');

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
            await api.patch('/users/me', form);
            toast.success('정보가 저장되었습니다');
            navigate('/');
        } catch (e) {
            setError('저장에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>추가 정보 입력</CardTitle>
                    <CardDescription>
                        서비스 이용을 위해 추가 정보를 입력해주세요
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

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