// YENİ: ChangePassword bileşeni import edildi
import { useState, useEffect } from 'react';
import ChangePassword from './ChangePassword'; // Bileşenin yolunu kontrol edin

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
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMyProjects = async () => {
        if (activeTab === 'myprojects') {
            setLoading(true);
        }
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
            setError(err.message);
        } finally {
            if (activeTab === 'myprojects') {
                setLoading(false);
            }
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
            setError(err.message);
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
                setSuccess('Projeye başarıyla başvurdunuz!');
                setTimeout(() => setSuccess(''), 3000);

                setAppliedProjectIds(prevIds => new Set(prevIds).add(projectId));

                const newProject = projects.find(p => p.id === projectId);
                if (newProject) {
                    setMyProjects(prevMyProjects => [...prevMyProjects, newProject]);
                }
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
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
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-indigo-600">Öğrenci Paneli</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Çıkış Yap
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {(error || success) && (
                    <div className={`mb-6 p-4 rounded-lg ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                        {error || success}
                    </div>
                )}

                <div className="mb-6 border-b border-gray-200">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`px-6 py-3 font-semibold border-b-2 transition ${activeTab === 'projects'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Tüm Projeler
                        </button>
                        <button
                            onClick={() => setActiveTab('myprojects')}
                            className={`px-6 py-3 font-semibold border-b-2 transition ${activeTab === 'myprojects'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Başvurularım
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-3 font-semibold border-b-2 transition ${activeTab === 'profile'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Profilim
                        </button>
                    </div>
                </div>

                {activeTab === 'projects' && (
                    <div>
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Proje ara..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                                <input
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <button
                                onClick={loadProjects}
                                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Filtrele
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => {
                                    const isApplied = appliedProjectIds.has(project.id);

                                    return (
                                        <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
                                            <p className="text-gray-600 mb-4">{project.description}</p>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Son Tarih: {new Date(project.deadline).toLocaleDateString('tr-TR')}
                                            </p>

                                            {isApplied ? (
                                                <button
                                                    disabled
                                                    className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                                                >
                                                    Başvuruldu
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => applyToProject(project.id)}
                                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                >
                                                    Başvur
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'myprojects' && (
                    <div>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : myProjects.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <p className="text-gray-600">Henüz hiçbir projeye başvurmadınız.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myProjects.map((project) => (
                                    <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
                                        <p className="text-gray-600 mb-4">{project.description}</p>
                                        <p className="text-sm text-gray-500">
                                            Son Tarih: {new Date(project.deadline).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && profile && (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profil Bilgilerim</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Ad Soyad</p>
                                <p className="text-lg font-semibold">{profile.student.name} {profile.student.surname}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Öğrenci No</p>
                                <p className="text-lg font-semibold">{profile.student.studentNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                <p className="text-lg font-semibold">{profile.student.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Durum</p>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${profile.student.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {profile.student.status}
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-600 mb-1">Teknolojiler</p>
                                <p className="text-lg font-semibold">
                                    {Array.isArray(profile.student.technologies)
                                        ? profile.student.technologies.join(', ')
                                        : profile.student.technologies
                                    }
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Şifre Değiştir
                        </button>

                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                Başvurduğum Projeler ({profile.applicationCount}/3)
                            </h3>
                            {profile.projects.length === 0 ? (
                                <p className="text-gray-600">Henüz hiçbir projeye başvurmadınız.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profile.projects.map((project) => (
                                        <div key={project.id} className="p-4 border rounded-lg">
                                            <h4 className="font-semibold text-gray-800">{project.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* GÜNCELLENDİ: Şifre Değiştirme Modalı */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    {/* Dışarıya tıklandığında kapatmak için (isteğe bağlı):
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
                           onClick={() => setShowPasswordModal(false)}>
                      
                      Forma tıklandığında modalın kapanmasını engellemek için (isteğe bağlı):
                      <div onClick={(e) => e.stopPropagation()}>
                    */}

                    <ChangePassword
                        onSuccess={() => {
                            // ChangePassword bileşeni zaten kendi başarı mesajını gösteriyor.
                            // Başarılı olunca modal'ı kapatıyoruz.
                            setShowPasswordModal(false);
                        }}
                        onCancel={() => {
                            // İptal edilince modal'ı kapatıyoruz.
                            setShowPasswordModal(false);
                        }}
                    />

                    {/* (isteğe bağlı) Kapatma div'lerini eklediyseniz:
                      </div>
                      </div>
                    */}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;