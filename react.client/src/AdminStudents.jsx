// GÜNCELLENDİ: Tüm sorunlar giderildi
import { useState, useEffect } from 'react';

// --- İKONLAR ---
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
const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);
const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);
const EditIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);
const DeleteIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// --- YARDIMCI FONKSİYONLAR ---
const getInitials = (name = '', surname = '') => {
    return `${name[0] || ''}${surname[0] || ''}`.toUpperCase();
};

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

const getStatusColor = (status) => {
    switch (status) {
        case 'Approved': return 'bg-emerald-500/30 text-emerald-300';
        case 'Rejected': return 'bg-red-500/30 text-red-300';
        case 'Pending': return 'bg-amber-500/30 text-amber-300';
        default: return 'bg-gray-500/30 text-gray-300';
    }
};

const AdminStudents = ({ onLogout }) => {
    const [view, setView] = useState('students');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [students, setStudents] = useState([]);
    const [studentFilters, setStudentFilters] = useState({ search: '', tech: '', status: '' });
    const [projects, setProjects] = useState([]);
    const [projectFilters, setProjectFilters] = useState({ search: '', date: '' });
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectFormData, setProjectFormData] = useState({ name: '', description: '', deadline: '' });
    const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [applicantsLoading, setApplicantsLoading] = useState(false);
    const [currentProjectName, setCurrentProjectName] = useState('');

    // Her sekme değiştiğinde yükleme yap
    useEffect(() => {
        if (view === 'students') loadStudents();
        if (view === 'projects') loadProjects();
    }, [view]);

    // Filtre değiştiğinde de yeniden yükle
    useEffect(() => {
        if (view === 'students') loadStudents();
        if (view === 'projects') loadProjects();
    }, [studentFilters, projectFilters]);

    const showMessage = (setter, message) => {
        setter(message);
        setTimeout(() => setter(''), 4000);
    };

    // Öğrencileri yükle
    const loadStudents = async () => {
        setLoading(true);
        setError('');
        try {
            const queryParams = new URLSearchParams();
            if (studentFilters.search) queryParams.append('Search', studentFilters.search);
            if (studentFilters.tech) queryParams.append('Tech', studentFilters.tech);
            if (studentFilters.status) queryParams.append('Status', studentFilters.status); // Boş olsa da gönderilir

            const response = await fetch(`/api/admin/GetStudents?${queryParams}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setStudents(data.data);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            showMessage(setError, err.message || "Öğrenciler yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    const approveStudent = async (id) => {
        try {
            const response = await fetch(`/api/admin/Students/${id}/Approve`, {
                method: 'PATCH',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                showMessage(setSuccess, 'Öğrenci onaylandı!');
                loadStudents();
            } else throw new Error(data.message);
        } catch (err) {
            showMessage(setError, err.message || "Onaylama başarısız.");
        }
    };

    const rejectStudent = async (id) => {
        if (!confirm('Bu öğrenciyi reddetmek istediğinize emin misiniz?')) return;
        try {
            const response = await fetch(`/api/admin/Students/${id}/Reject`, {
                method: 'PATCH',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                showMessage(setSuccess, 'Öğrenci reddedildi.');
                loadStudents();
            } else throw new Error(data.message);
        } catch (err) {
            showMessage(setError, err.message || "Reddetme başarısız.");
        }
    };

    const loadProjects = async () => {
        setLoading(true);
        setError('');
        try {
            const queryParams = new URLSearchParams();
            if (projectFilters.search) queryParams.append('Search', projectFilters.search);
            if (projectFilters.date) queryParams.append('date', projectFilters.date);

            const response = await fetch(`/api/admin/GetProjects?${queryParams}`, {
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

    const openProjectModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setProjectFormData({
                name: project.name,
                description: project.description,
                deadline: project.deadline ? project.deadline.split('T')[0] : ''
            });
        } else {
            setEditingProject(null);
            setProjectFormData({ name: '', description: '', deadline: '' });
        }
        setIsProjectModalOpen(true);
    };

    const closeProjectModal = () => {
        setIsProjectModalOpen(false);
        setEditingProject(null);
        setProjectFormData({ name: '', description: '', deadline: '' });
    };

    const handleProjectFormChange = (e) => {
        const { name, value } = e.target;
        setProjectFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitProject = async (e) => {
        e.preventDefault();
        const url = editingProject ? `/api/admin/Projects/${editingProject.id}` : '/api/admin/CreateProject';
        const method = editingProject ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(projectFormData)
            });
            const data = await response.json();

            if (data.success) {
                showMessage(setSuccess, editingProject ? 'Proje güncellendi!' : 'Proje oluşturuldu!');
                closeProjectModal();
                loadProjects();
            } else {
                const errorMessage = data.errors ? data.errors.join(', ') : data.message;
                throw new Error(errorMessage);
            }
        } catch (err) {
            showMessage(setError, err.message || "İşlem başarısız.");
        }
    };

    const handleDeleteProject = async (id) => {
        if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
        try {
            const response = await fetch(`/api/admin/Projects/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                showMessage(setSuccess, 'Proje silindi.');
                loadProjects();
            } else throw new Error(data.message);
        } catch (err) {
            showMessage(setError, err.message || "Silme başarısız.");
        }
    };

    const openApplicantsModal = async (projectId, projectName) => {
        setIsApplicantsModalOpen(true);
        setApplicantsLoading(true);
        setCurrentProjectName(projectName);
        setApplicants([]);
        try {
            const response = await fetch(`/api/admin/Projects/${projectId}/Applicants`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setApplicants(data.data);
            } else throw new Error(data.message);
        } catch (err) {
            showMessage(setError, err.message || "Başvuranlar yüklenemedi.");
            setIsApplicantsModalOpen(false);
        } finally {
            setApplicantsLoading(false);
        }
    };

    const closeApplicantsModal = () => {
        setIsApplicantsModalOpen(false);
        setApplicants([]);
        setCurrentProjectName('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* NAVBAR */}
            <nav className="backdrop-blur-2xl bg-white/10 border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                            A
                        </div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Admin Paneli
                        </h1>
                    </div>
                    <button
                        onClick={onLogout}
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
                    <button
                        onClick={() => setView('students')}
                        className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all ${view === 'students' ? 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg' : 'hover:bg-white/10'}`}
                    >
                        Öğrenci Yönetimi
                    </button>
                    <button
                        onClick={() => setView('projects')}
                        className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all ${view === 'projects' ? 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg' : 'hover:bg-white/10'}`}
                    >
                        Proje Yönetimi
                    </button>
                </div>

                {/* ÖĞRENCİ YÖNETİMİ */}
                {view === 'students' && (
                    <div className="space-y-8">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                            <h2 className="text-2xl font-bold mb-6">Öğrenci Filtreleri</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <input
                                    type="text"
                                    placeholder="Ad, soyad, email..."
                                    value={studentFilters.search}
                                    onChange={(e) => setStudentFilters({ ...studentFilters, search: e.target.value })}
                                    className="px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition placeholder-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Teknoloji..."
                                    value={studentFilters.tech}
                                    onChange={(e) => setStudentFilters({ ...studentFilters, tech: e.target.value })}
                                    className="px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition placeholder-gray-400"
                                />
                                <select
                                    value={studentFilters.status}
                                    onChange={(e) => setStudentFilters({ ...studentFilters, status: e.target.value })}
                                    className="px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition"
                                >
                                    <option value="">Tüm Durumlar</option>
                                    <option value="Pending">Beklemede</option>
                                    <option value="Approved">Onaylandı</option>
                                    <option value="Rejected">Reddedildi</option>
                                </select>
                            </div>
                            <button
                                onClick={loadStudents}
                                className="mt-6 px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Filtrele
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="text-center py-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                                <p className="text-xl text-gray-300">Öğrenci bulunamadı.</p>
                            </div>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-8 py-5 text-left font-bold">Öğrenci</th>
                                            <th className="px-8 py-5 text-left font-bold">Teknolojiler</th>
                                            <th className="px-8 py-5 text-left font-bold">Durum</th>
                                            <th className="px-8 py-5 text-left font-bold">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => (
                                            <tr key={student.id} className="border-t border-white/10 hover:bg-white/5 transition">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                                                            {getInitials(student.name, student.surname)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{student.name} {student.surname}</p>
                                                            <p className="text-sm text-gray-400">{student.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-wrap gap-2">
                                                        {student.technologies?.map((tech) => tech && (
                                                            <span key={tech} className="px-3 py-1 bg-purple-500/30 rounded-full text-xs font-medium">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(student.status)}`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    {student.status === 'Pending' ? (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => approveStudent(student.id)} className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 text-sm font-bold transition">
                                                                Onayla
                                                            </button>
                                                            <button onClick={() => rejectStudent(student.id)} className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 text-sm font-bold transition">
                                                                Reddet
                                                            </button>
                                                        </div>
                                                    ) : student.status === 'Approved' ? (
                                                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                                            Onaylandı
                                                        </span>
                                                    ) : student.status === 'Rejected' ? (
                                                        <span className="text-red-400 font-semibold flex items-center gap-1">
                                                            Reddedildi
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* PROJE YÖNETİMİ */}
                {view === 'projects' && (
                    <div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Proje Yönetimi</h2>
                                <button onClick={() => openProjectModal(null)} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                    <PlusIcon /> Yeni Proje
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input
                                    type="text"
                                    placeholder="Proje ara..."
                                    value={projectFilters.search}
                                    onChange={(e) => setProjectFilters({ ...projectFilters, search: e.target.value })}
                                    className="px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-purple-500 placeholder-gray-400"
                                />
                                <input
                                    type="date"
                                    value={projectFilters.date}
                                    onChange={(e) => setProjectFilters({ ...projectFilters, date: e.target.value })}
                                    className="px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-purple-500"
                                />
                            </div>
                            <button
                                onClick={loadProjects}
                                className="mt-6 px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Filtrele
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                                <p className="text-xl text-gray-300">Proje bulunamadı.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold">{project.name}</h3>
                                                <p className="text-gray-300 mt-1">{project.description}</p>
                                                <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                                                    <CalendarIcon /> {formatDate(project.deadline)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => openApplicantsModal(project.id, project.name)} className="p-3 bg-blue-500/20 rounded-xl hover:bg-blue-500/40 transition"><UsersIcon /></button>
                                                <button onClick={() => openProjectModal(project)} className="p-3 bg-yellow-500/20 rounded-xl hover:bg-yellow-500/40 transition"><EditIcon /></button>
                                                <button onClick={() => handleDeleteProject(project.id)} className="p-3 bg-red-500/20 rounded-xl hover:bg-red-500/40 transition"><DeleteIcon /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODALLER */}
            {isProjectModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6">{editingProject ? 'Projeyi Güncelle' : 'Yeni Proje'}</h3>
                        <form onSubmit={handleSubmitProject} className="space-y-5">
                            <input name="name" value={projectFormData.name} onChange={handleProjectFormChange} placeholder="Proje Adı" required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-purple-500 placeholder-gray-400" />
                            <textarea name="description" value={projectFormData.description} onChange={handleProjectFormChange} rows="4" placeholder="Açıklama" required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-purple-500 placeholder-gray-400" />
                            <input name="deadline" type="date" value={projectFormData.deadline} onChange={handleProjectFormChange} required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-purple-500" />
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeProjectModal} className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition">İptal</button>
                                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold hover:shadow-xl transition">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isApplicantsModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-3xl p-8 max-w-lg w-full border border-white/20 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold truncate pr-4">"{currentProjectName}" Başvuranları</h3>
                            <button onClick={closeApplicantsModal} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto">
                            {applicantsLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : applicants.length > 0 ? (
                                <ul className="space-y-4">
                                    {applicants.map(student => (
                                        <li key={student.id} className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                                                {getInitials(student.name, student.surname)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{student.name} {student.surname}</p>
                                                <p className="text-sm text-gray-400">{student.email}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-400 py-10">Henüz başvuran yok.</p>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={closeApplicantsModal} className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition">Kapat</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;