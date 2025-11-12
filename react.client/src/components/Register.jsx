import { useState } from 'react';

const RegisterIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const Register = ({ onSuccess, onBackToLogin }) => {
    const [formData, setFormData] = useState({
        name: '', surname: '', studentNumber: '', email: '', password: '', confirmPassword: '', technologies: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Ad zorunludur';
        if (!formData.surname.trim()) return 'Soyad zorunludur';
        if (!formData.studentNumber.trim()) return 'Öğrenci numarası zorunludur';
        if (!formData.email.includes('@')) return 'Geçerli email girin';
        if (!formData.technologies.trim()) return 'Teknolojiler zorunludur';
        if (formData.password.length < 6) return 'Şifre en az 6 karakter olmalı';
        if (formData.password !== formData.confirmPassword) return 'Şifreler eşleşmiyor';
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const validation = validateForm();
        if (validation !== true) {
            setError(validation);
            return;
        }

        setLoading(true);
        const techArray = formData.technologies.split(',').map(t => t.trim()).filter(t => t);
        if (techArray.length === 0) {
            setError('En az bir teknoloji girin');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    technologies: techArray,
                    email: formData.email.toLowerCase().trim()
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Kayıt başarısız');

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6">
                <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-300 mb-2">Kayıt Başarılı!</h2>
                    <p className="text-gray-400 mb-6">
                        Kaydınız alındı. Admin onayından sonra giriş yapabilirsiniz.
                    </p>
                    <button
                        onClick={onSuccess}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                    >
                        Girişe Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-12">
            <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <RegisterIcon />
                    </div>
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Kayıt Ol
                    </h2>
                    <p className="text-gray-400 mt-2">Yeni hesap oluşturun</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Ad *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-purple-500" placeholder="Adınız" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Soyad *</label>
                            <input type="text" name="surname" value={formData.surname} onChange={handleChange} required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-purple-500" placeholder="Soyadınız" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Öğrenci Numarası *</label>
                        <input type="text" name="studentNumber" value={formData.studentNumber} onChange={handleChange} required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-purple-500" placeholder="123456789" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-purple-500" placeholder="ornek@email.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Teknolojiler *</label>
                        <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-purple-500" placeholder="React, Node.js, Python" />
                        <p className="text-xs text-gray-500 mt-1">Virgülle ayırın</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Şifre *</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-purple-500" placeholder="••••••••" />
                            <p className="text-xs text-gray-500 mt-1">En az 6 karakter</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Şifre Tekrar *</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={6} className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-purple-500" placeholder="••••••••" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Kayıt Yapılıyor...
                            </>
                        ) : (
                            <>
                                <RegisterIcon />
                                Kayıt Ol
                            </>
                        )}
                    </button>
                </form>

                {onBackToLogin && (
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Zaten hesabınız var mı?{' '}
                            <button onClick={onBackToLogin} className="text-purple-400 hover:text-purple-300 font-semibold hover:underline">
                                Giriş Yap
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;