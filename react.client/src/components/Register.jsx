import { useState } from 'react';

const Register = ({ onSuccess, onBackToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        studentNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        technologies: ''
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

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Ad alanı zorunludur');
            return false;
        }
        if (!formData.surname.trim()) {
            setError('Soyad alanı zorunludur');
            return false;
        }
        if (!formData.studentNumber.trim()) {
            setError('Öğrenci numarası zorunludur');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email alanı zorunludur');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Geçerli bir email adresi girin');
            return false;
        }
        if (!formData.technologies.trim()) {
            setError('Teknolojiler alanı zorunludur');
            return false;
        }
        if (!formData.password) {
            setError('Şifre alanı zorunludur');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const techArray = formData.technologies
                .split(',')
                .map(t => t.trim())
                .filter(t => t);

            if (techArray.length === 0) {
                setError('En az bir teknoloji girmelisiniz');
                setLoading(false);
                return;
            }

            const registerData = {
                name: formData.name.trim(),
                surname: formData.surname.trim(),
                studentNumber: formData.studentNumber.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                technologies: techArray
            };

            console.log('Gönderilen veri:', registerData);

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();
            console.log('Backend yanıtı:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Kayıt başarısız');
            }

            setSuccess(true);
            if (onSuccess) {
                setTimeout(() => onSuccess(), 2000);
            }
        } catch (err) {
            console.error('Kayıt hatası:', err);
            setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Kayıt Başarılı!</h2>
                    <p className="text-gray-600 mb-4">
                        Kaydınız alındı. Admin onayından sonra giriş yapabileceksiniz.
                    </p>
                    <button
                        onClick={onSuccess}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Giriş Sayfasına Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4 py-12">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Kayıt Ol</h2>
                    <p className="text-gray-600 mt-2">Yeni hesap oluşturun</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Ad <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="Adınız"
                            />
                        </div>

                        <div>
                            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
                                Soyad <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="Soyadınız"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Öğrenci Numarası <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="studentNumber"
                            name="studentNumber"
                            value={formData.studentNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            placeholder="123456789"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            placeholder="ornek@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-2">
                            Teknolojiler <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="technologies"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            placeholder="React, Node.js, Python"
                        />
                        <p className="text-xs text-gray-500 mt-1">Teknolojileri virgülle ayırın</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1">En az 6 karakter</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre Tekrar <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Kayıt Yapılıyor...
                            </span>
                        ) : (
                            'Kayıt Ol'
                        )}
                    </button>
                </form>

                {onBackToLogin && (
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Zaten hesabınız var mı?{' '}
                            <button
                                onClick={onBackToLogin}
                                className="text-purple-600 hover:text-purple-800 font-semibold hover:underline"
                            >
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