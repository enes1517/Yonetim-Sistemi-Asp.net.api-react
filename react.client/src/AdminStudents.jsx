// GÜNCELLENDİ: 'useContext' kaldırıldı, 'useState' ve 'useEffect' kaldı
import { useState, useEffect } from 'react';

// --- BİLDİRİM VE ÇIKIŞ İKONLARI ---
const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ErrorIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);

// --- YENİ PROJE İKONLARI ---
const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
);
const EditIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);
const DeleteIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);

// --- YARDIMCI FONKSİYONLAR ---
const getInitials = (name = '', surname = '') => {
    return `${name[0] || ''}${surname[0] || ''}`.toUpperCase();
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
};

// GÜNCELLENDİ: Bileşen adı AdminDashboard oldu ve 'onLogout' prop'unu alıyor
const AdminStudents = ({ onLogout }) => {
    // YENİ: Hangi sekmede olduğumuzu tutan state
    const [view, setView] = useState('students'); // 'students' veya 'projects'

    // --- GENEL STATE'LER ---
    const [loading, setLoading] = useState(false); // Her iki sekme için genel yükleme
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // --- ÖĞRENCİ STATE'LERİ ---
    const [students, setStudents] = useState([]);
    const [studentFilters, setStudentFilters] = useState({
        search: '',
        tech: '',
        status: ''
    });

    // --- YENİ: PROJE STATE'LERİ ---
    const [projects, setProjects] = useState([]);
    const [projectFilters, setProjectFilters] = useState({
        search: '',
        date: ''
    });
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null); // null = yeni proje, obje = güncelleme
    const [projectFormData, setProjectFormData] = useState({
        name: '',
        description: '',
        deadline: ''
    });

    // --- YENİ: BAŞVURANLAR STATE'LERİ ---
    const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [applicantsLoading, setApplicantsLoading] = useState(false);
    const [currentProjectName, setCurrentProjectName] = useState('');

    // Sadece 'students' sekmesi aktifken öğrencileri yükle
    useEffect(() => {
        if (view === 'students') {
            loadStudents();
        }
    }, [view]);

    // Sadece 'projects' sekmesi aktifken projeleri yükle
    useEffect(() => {
        if (view === 'projects') {
            loadProjects();
        }
    }, [view]);

    // --- HATA/BAŞARI MESAJI TEMİZLEYİCİ ---
    const showMessage = (setter, message) => {
        setter(message);
        setTimeout(() => setter(''), 4000);
    };

    // --- ÖĞRENCİ YÖNETİMİ FONKSİYONLARI ---
    const loadStudents = async () => {
        setLoading(true);
        setError('');
        try {
            const queryParams = new URLSearchParams();
            if (studentFilters.search) queryParams.append('Search', studentFilters.search);
            if (studentFilters.tech) queryParams.append('Tech', studentFilters.tech);
            if (studentFilters.status) queryParams.append('Status', studentFilters.status);

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
                showMessage(setSuccess, 'Öğrenci başarıyla onaylandı!');
                loadStudents(); // Listeyi yenile
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            showMessage(setError, err.message || "Onaylama işlemi başarısız.");
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
                loadStudents(); // Listeyi yenile
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            showMessage(setError, err.message || "Reddetme işlemi başarısız.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // --- YENİ: PROJE YÖNETİMİ FONKSİYONLARI ---

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
            // Güncelleme modu
            setEditingProject(project);
            setProjectFormData({
                name: project.name,
                description: project.description,
                // Tarih input'u (type="date") 'YYYY-MM-DD' formatı bekler
                deadline: project.deadline ? project.deadline.split('T')[0] : ''
            });
        } else {
            // Ekleme modu
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

        const url = editingProject
            ? `/api/admin/Projects/${editingProject.id}` // Güncelleme (PATCH)
            : '/api/admin/CreateProject'; // Ekleme (POST)

        const method = editingProject ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(projectFormData)
            });
            const data = await response.json();

            if (data.success) {
                showMessage(setSuccess, editingProject ? 'Proje güncellendi!' : 'Proje oluşturuldu!');
                closeProjectModal();
                loadProjects(); // Listeyi yenile
            } else {
                // Controller'dan gelen validasyon hatalarını göster
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
                showMessage(setSuccess, 'Proje başarıyla silindi.');
                loadProjects(); // Listeyi yenile
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            showMessage(setError, err.message || "Silme işlemi başarısız.");
        }
    };

    // --- YENİ: BAŞVURANLARI GÖRÜNTÜLEME FONKSİYONLARI ---

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
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            showMessage(setError, err.message || "Başvuranlar yüklenemedi.");
            // Hata olursa modal'ı kapat
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

    // --- ANA RENDER FONKSİYONU ---
    return (
        <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
            {/* --- SAYFA BAŞLIĞI VE ÇIKIŞ BUTONU --- */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
                    <p className="text-gray-600 mt-1">Öğrenci ve Proje Yönetimi</p>
                </div>
                <div>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm flex items-center gap-2"
                    >
                        <LogoutIcon />
                        Çıkış Yap
                    </button>
                </div>
            </div>

            {/* --- HATA VE BAŞARI BİLDİRİMLERİ --- */}
            {(error || success) && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {error ? <ErrorIcon /> : <CheckIcon />}
                    <span>{error || success}</span>
                </div>
            )}

            {/* --- YENİ: SEKMELİ YAPI (TABS) --- */}
            <div className="mb-8 flex border-b border-gray-300">
                <button
                    onClick={() => setView('students')}
                    className={`py-3 px-6 text-lg font-medium ${view === 'students' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Öğrenci Yönetimi
                </button>
                <button
                    onClick={() => setView('projects')}
                    className={`py-3 px-6 text-lg font-medium ${view === 'projects' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Proje Yönetimi
                </button>
            </div>


            {/* --- BÖLÜM 1: ÖĞRENCİ YÖNETİMİ (view === 'students' ise) --- */}
            {view === 'students' && (
                <div id="student-management">
                    {/* Öğrenci Filtreleri */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-5 text-gray-800">Öğrenci Filtreleri</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <input
                                type="text"
                                placeholder="Ad, soyad veya email..."
                                value={studentFilters.search}
                                onChange={(e) => setStudentFilters({ ...studentFilters, search: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="text"
                                placeholder="Teknoloji (React, Python...)"
                                value={studentFilters.tech}
                                onChange={(e) => setStudentFilters({ ...studentFilters, tech: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                            <select
                                value={studentFilters.status}
                                onChange={(e) => setStudentFilters({ ...studentFilters, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Tüm Durumlar</option>
                                <option value="Pending">Beklemede</option>
                                <option value="Approved">Onaylandı</option>
                                <option value="Rejected">Reddedildi</option>
                            </select>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={loadStudents}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                                disabled={loading}
                            >
                                {loading ? 'Filtreleniyor...' : 'Filtrele'}
                            </button>
                        </div>
                    </div>

                    {/* Öğrenci Tablosu */}
                    {loading ? (
                        <div className="bg-white rounded-lg shadow-md p-12 flex justify-center items-center h-64">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    {/* ... Öğrenci tablosu thead ... */}
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Öğrenci Bilgileri</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Teknolojiler</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Durum</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">İşlemler</th>
                                        </tr>
                                    </thead>
                                    {/* ... Öğrenci tablosu tbody ... */}
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {students.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                                                            {getInitials(student.name, student.surname)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{student.name} {student.surname}</div>
                                                            <div className="text-sm text-gray-500">{student.email}</div>
                                                            <div className="text-sm text-gray-400 mt-1">Örn No: {student.studentNumber}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2 max-w-xs">
                                                        {student.technologies?.map((tech) => (
                                                            tech && tech.trim() && (
                                                                <span key={tech} className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-800 text-xs font-medium">
                                                                    {tech.trim()}
                                                                </span>
                                                            )
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {student.status === 'Pending' && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => approveStudent(student.id)} className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm">Onayla</button>
                                                            <button onClick={() => rejectStudent(student.id)} className="px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm">Reddet</button>
                                                        </div>
                                                    )}
                                                    {student.status === 'Approved' && (<span className="text-green-600 font-semibold flex items-center gap-1">✓ Onaylandı</span>)}
                                                    {student.status === 'Rejected' && (<span className="text-red-600 font-semibold flex items-center gap-1">✗ Reddedildi</span>)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {students.length === 0 && !loading && (
                                <div className="text-center py-20 text-gray-500">
                                    <h3 className="mt-4 text-lg font-semibold text-gray-800">Öğrenci Bulunamadı</h3>
                                    <p className="mt-1 text-sm">Filtre kriterlerinizi değiştirmeyi deneyin.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* --- BÖLÜM 2: PROJE YÖNETİMİ (view === 'projects' ise) --- */}
            {view === 'projects' && (
                <div id="project-management">
                    {/* Proje Filtreleri ve Ekleme Butonu */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-semibold text-gray-800">Proje Filtreleri</h2>
                            <button
                                onClick={() => openProjectModal(null)} // Yeni proje için null gönder
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm flex items-center gap-2"
                            >
                                <PlusIcon />
                                Yeni Proje Ekle
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <input
                                type="text"
                                placeholder="Proje adında ara..."
                                value={projectFilters.search}
                                onChange={(e) => setProjectFilters({ ...projectFilters, search: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="date"
                                value={projectFilters.date}
                                onChange={(e) => setProjectFilters({ ...projectFilters, date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-600"
                            />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={loadProjects}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                                disabled={loading}
                            >
                                {loading ? 'Filtreleniyor...' : 'Filtrele'}
                            </button>
                        </div>
                    </div>

                    {/* Proje Tablosu */}
                    {loading ? (
                        <div className="bg-white rounded-lg shadow-md p-12 flex justify-center items-center h-64">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Proje Adı</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Açıklama</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Bitiş Tarihi</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {projects.map((project) => (
                                            <tr key={project.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{project.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700 max-w-md truncate">{project.description}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-gray-800 flex items-center gap-2">
                                                        <CalendarIcon />
                                                        {formatDate(project.deadline)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openApplicantsModal(project.id, project.name)}
                                                            className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition" title="Başvuranlar">
                                                            <UsersIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => openProjectModal(project)} // Güncelleme için projeyi gönder
                                                            className="p-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition" title="Güncelle">
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProject(project.id)}
                                                            className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition" title="Sil">
                                                            <DeleteIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {projects.length === 0 && !loading && (
                                <div className="text-center py-20 text-gray-500">
                                    <h3 className="mt-4 text-lg font-semibold text-gray-800">Proje Bulunamadı</h3>
                                    <p className="mt-1 text-sm">Filtre kriterlerinizi değiştirmeyi deneyin veya yeni proje ekleyin.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* --- YENİ: PROJE EKLEME/GÜNCELLEME MODALI --- */}
            {isProjectModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-2xl font-semibold text-gray-900">
                                {editingProject ? 'Projeyi Güncelle' : 'Yeni Proje Oluştur'}
                            </h3>
                            <button onClick={closeProjectModal} className="text-gray-400 hover:text-gray-600">
                                <CloseIcon />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitProject} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Proje Adı</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={projectFormData.name}
                                    onChange={handleProjectFormChange}
                                    className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={projectFormData.description}
                                    onChange={handleProjectFormChange}
                                    className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
                                <input
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    value={projectFormData.deadline}
                                    onChange={handleProjectFormChange}
                                    className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-4 border-t mt-6">
                                <button
                                    type="button"
                                    onClick={closeProjectModal}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition mr-3"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                                >
                                    {editingProject ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- YENİ: BAŞVURANLARI GÖRÜNTÜLEME MODALI --- */}
            {isApplicantsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-900 truncate pr-4">
                                "{currentProjectName}" Başvuranları
                            </h3>
                            <button onClick={closeApplicantsModal} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {applicantsLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : applicants.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {applicants.map(student => (
                                        <li key={student.id} className="py-4 flex items-center gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                                                {getInitials(student.name, student.surname)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{student.name} {student.surname}</p>
                                                <p className="text-sm text-gray-500">{student.email}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500 py-10">Bu projeye henüz başvuran öğrenci bulunmamaktadır.</p>
                            )}
                        </div>
                        <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
                            <button
                                type="button"
                                onClick={closeApplicantsModal}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// GÜNCELLENDİ: export default AdminDashboard
export default AdminStudents;