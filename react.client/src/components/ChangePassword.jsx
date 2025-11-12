import { useState } from 'react';

const LockIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

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
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            setError('Yeni şifre en az 6 karakter olmalı');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) {
                const msg = data.errors ? data.errors.join(', ') : (data.message || 'İşlem başarısız');
                throw new Error(msg);
            }

            setSuccess(true);
            setTimeout(() => onSuccess?.(), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon />
                </div>
                <h2 className="text-2xl font-bold text-emerald-300 mb-2">Şifre Değiştirildi</h2>
                <p className="text-gray-400">Şifreniz başarıyla güncellendi.</p>
            </div>
        );
    }

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <LockIcon /> Şifre Değiştir
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Güvenliğiniz için güçlü şifre kullanın</p>
                </div>
                {onCancel && (
                    <button onClick={onCancel} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-300 font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mevcut Şifre</label>
                    <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-emerald-500" placeholder="Mevcut şifreniz" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Yeni Şifre</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-emerald-500" placeholder="Yeni şifreniz" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Yeni Şifre Tekrar</label>
                    <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-emerald-500" placeholder="Tekrar girin" />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                    </button>
                    {onCancel && (
                        <button type="button" onClick={onCancel} className="flex-1 py-3.5 bg-white/10 text-gray-300 rounded-xl font-bold hover:bg-white/20 transition">
                            İptal
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <p className="text-sm text-emerald-300">
                    <strong>İpucu:</strong> Büyük/küçük harf, rakam ve özel karakter kullanın.
                </p>
            </div>
        </div>
    );
};

export default ChangePassword;