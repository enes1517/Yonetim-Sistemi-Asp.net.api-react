import { useState } from 'react';

const ChangePassword = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('Yeni şifreler eşleşmiyor');
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Yeni şifre en az 6 karakter olmalıdır');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                // GÜNCELLENDİ: C# DTO'nuz (ChangePasswordDto.cs)
                // 3 alanı da beklediği için 'confirmNewPassword' alanı eklendi
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmNewPassword: formData.confirmNewPassword
                })
            });

            const data = await response.json();

            // GÜNCELLENDİ: Backend'den gelen 'errors' dizisini göster
            if (!response.ok) {
                const errorMessage = data.errors
                    ? data.errors.join(', ')
                    : (data.message || 'Şifre değiştirme başarısız');
                throw new Error(errorMessage);
            }

            setSuccess(true);
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Şifre Değiştirildi</h2>
                    <p className="text-gray-600">Şifreniz başarıyla değiştirildi.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Şifre Değiştir</h2>
                <p className="text-gray-600 mt-2">Güvenliğiniz için güçlü bir şifre seçin</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* GÜNCELLENDİ: handleSubmit'i butondan alıp forma taşıdık */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Mevcut Şifre
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="Mevcut şifreniz"
                    />
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Yeni Şifre
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="Yeni şifreniz"
                    />
                </div>

                <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Yeni Şifre Tekrar
                    </label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="Yeni şifrenizi tekrar girin"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit" // GÜNCELLENDİ
                        disabled={loading}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                            İptal
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>İpucu:</strong> Güçlü bir şifre için büyük/küçük harf, rakam ve özel karakter kullanın.
                </p>
            </div>
        </div>
    );
};

export default ChangePassword;