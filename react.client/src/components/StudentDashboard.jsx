import { useState, useEffect } from 'react';
import ChangePassword from './ChangePassword';

// --- İKONLAR (Admin ile aynı) ---
const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);
const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ErrorIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const LockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

// --- YARDIMCI FONKSİYON ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
};

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [appliedProjectIds, setAppliedProjectIds] = useState(new Set());
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        date: ''
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        if (activeTab === 'projects') {
            loadProjects();
            loadMyProjects();
        } else if (activeTab === 'myprojects') {
            loadMyProjects();
        } else if (activeTab === 'profile') {
            loadProfile();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'projects') loadProjects();
    }, [filters]);

    const showMessage = (setter, message) => {
        setter(message);
        setTimeout(() => setter(''), 4000);
    };

    const loadProjects = async () => {
        setLoading(true);
        setError('');
        try {
            const queryParams = new URLSearchParams();
            if (filters.search) queryParams.append('Search', filters.search);
            if (filters.date) queryParams.append('date', filters.date);

            const response = await fetch(`/api/student/GetProjects?${queryParams}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setProjects(data.data);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            showMessage(setError, err.message || "Projeler yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    const loadMyProjects = async () => {
        setError('');
        try {
            const response = await fetch('/api/student/MyProjects', {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setMyProjects(data.data);
                setAppliedProjectIds(new Set(data.data.map(p => p.id)));
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            showMessage(setError, err.message || "Başvurular yüklenemedi.");
        }
    };

    const loadProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/student/Profile', {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setProfile(data);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            showMessage(setError, err.message || "Profil yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    const applyToProject = async (projectId) => {
        try {
            const response = await fetch('/api/student/ApplyProject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ projectId })
            });

            const data = await response.json();

            if (data.success) {
                showMessage(setSuccess, 'Projeye başarıyla başvurdunuz!');
                setAppliedProjectIds(prev => new Set(prev).add(projectId));
                const project = projects.find(p => p.id === projectId);
                if (project) {
                    setMyProjects(prev => [...prev, project]);
                }
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            showMessage(setError, err.message || "Başvuru başarısız.");
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            window.location.href = '/';
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* NAVBAR */}
            <nav className="backdrop-blur-2xl bg-white/10 border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                            S
                        </div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Öğrenci Paneli
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        <LogoutIcon />
                        Çıkış Yap
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* MESAJLAR */}
                {(error || success) && (
                    <div className={`mb-8 p-5 rounded-2xl backdrop-blur-xl border ${error ? 'bg-red-500/20 border-red-400' : 'bg-emerald-500/20 border-emerald-400'} flex items-center gap-3 animate-fadeIn`}>
                        {error ? <ErrorIcon /> : <CheckIcon />}
                        <span className="font-medium">{error || success}</span>
                    </div>
                )}

                {/* TABLAR */}
                <div className="mb-10 flex gap-2 p-1 bg-white/10 backdrop-blur-xl rounded-2xl shadow-inner border border-white/20">
                    {['projects', 'myprojects', 'profile'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all ${activeTab === tab
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg'
                                : 'hover:bg-white/10'
                                }`}
                        >
                            {tab === 'projects' && 'Tüm Projeler'}
                            {tab === 'myprojects' && 'Başvurularım'}
                            {tab === 'profile' && 'Profilim'}
                        </button>
                    ))}
                </div>

                {/* TÜM PROJELER */}
                {activeTab === 'projects' && (
                    <div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                <input
                                    type="text"
                                    placeholder="Proje ara..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-emerald-500 placeholder-gray-400"
                                />
                                <input
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                    className="px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-emerald-500"
                                />
                            </div>
                            <button
                                onClick={loadProjects}
                                className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Filtrele
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                                <p className="text-xl text-gray-300">Proje bulunamadı.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => {
                                    const isApplied = appliedProjectIds.has(project.id);
                                    return (
                                        <div key={project.id} className="group bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                                            <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                                            <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                                            <p className="text-sm text-gray-400 mb-5 flex items-center gap-2">
                                                <CalendarIcon />
                                                {formatDate(project.deadline)}
                                            </p>
                                            <button
                                                onClick={() => !isApplied && applyToProject(project.id)}
                                                disabled={isApplied}
                                                className={`w-full py-3.5 rounded-xl font-semibold transition-all ${isApplied
                                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:scale-105'
                                                    }`}
                                            >
                                                {isApplied ? 'Başvuruldu' : 'Hemen Başvur'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* BAŞVURULARIM */}
                {activeTab === 'myprojects' && (
                    <div>
                        {myProjects.length === 0 ? (
                            <div className="text-center py-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                                <p className="text-xl text-gray-300">Henüz projeye başvurmadınız.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myProjects.map((project) => (
                                    <div key={project.id} className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-3xl p-6 border border-emerald-500/30">
                                        <h3 className="text-xl font-bold text-emerald-300 mb-2">{project.name}</h3>
                                        <p className="text-gray-300 mb-3">{project.description}</p>
                                        <p className="text-sm text-emerald-400 flex items-center gap-2">
                                            <CalendarIcon />
                                            {formatDate(project.deadline)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PROFİL */}
                {activeTab === 'profile' && profile && (
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-8">Profil Bilgilerim</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            {[
                                { label: 'Ad Soyad', value: `${profile.student.name} ${profile.student.surname}` },
                                { label: 'Öğrenci No', value: profile.student.studentNumber },
                                { label: 'Email', value: profile.student.email },
                                { label: 'Durum', value: profile.student.status, badge: true }
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <p className="text-sm text-gray-400 font-medium">{item.label}</p>
                                    {item.badge ? (
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${profile.student.status === 'Approved' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'}`}>
                                            {item.value}
                                        </span>
                                    ) : (
                                        <p className="text-lg font-bold text-white">{item.value}</p>
                                    )}
                                </div>
                            ))}
                            <div className="md:col-span-2 space-y-2">
                                <p className="text-sm text-gray-400 font-medium">Teknolojiler</p>
                                <div className="flex flex-wrap gap-2">
                                    {(Array.isArray(profile.student.technologies) ? profile.student.technologies : [profile.student.technologies]).map((tech, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-emerald-500/30 text-emerald-300 rounded-full text-sm font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <LockIcon /> Şifre Değiştir
                        </button>

                        <div className="mt-12 pt-8 border-t border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6">
                                Başvurduğum Projeler ({profile.applicationCount}/3)
                            </h3>
                            {profile.projects.length === 0 ? (
                                <p className="text-gray-400">Henüz başvuru yapmadınız.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {profile.projects.map((project) => (
                                        <div key={project.id} className="p-5 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-2xl border border-emerald-500/30">
                                            <h4 className="font-bold text-emerald-300">{project.name}</h4>
                                            <p className="text-sm text-gray-300 mt-1">{project.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ŞİFRE MODALI */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Şifre Değiştir</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
                                <CloseIcon />
                            </button>
                        </div>
                        <ChangePassword
                            onSuccess={() => setShowPasswordModal(false)}
                            onCancel={() => setShowPasswordModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;