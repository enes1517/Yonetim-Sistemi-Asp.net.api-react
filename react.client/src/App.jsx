import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './AdminStudents';


function App() {
    const [currentView, setCurrentView] = useState('login');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);

                if (data.role === 'Admin') {
                    setCurrentView('admin');
                } else if (data.role === 'Student') {
                    setCurrentView('student');
                }
            } else {
                setCurrentView('login');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setCurrentView('login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (userData) => {
        console.log('Login successful:', userData);
        setUser(userData);

        if (userData.role === 'Admin') {
            setCurrentView('admin');
        } else if (userData.role === 'Student') {
            setCurrentView('student');
        }
    };

    const handleRegisterSuccess = () => {
        console.log('Register successful, redirecting to login');
        setCurrentView('login');
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            setCurrentView('login');
        } catch (error) {
            console.error('Logout failed:', error);
            setUser(null);
            setCurrentView('login');
        }
    };

    const goToRegister = () => {
        console.log('Navigating to register');
        setCurrentView('register');
    };

    const goToLogin = () => {
        console.log('Navigating to login');
        setCurrentView('login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <div className="text-center">
                    <div className="inline-block w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-xl text-gray-700 font-semibold">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="App min-h-screen">
            {currentView === 'login' && (
                <div className="relative min-h-screen">
                    <Login onLogin={handleLogin} onGoToRegister={goToRegister} />
                </div>
            )}

            {currentView === 'register' && (
                <div className="relative min-h-screen">
                    <Register
                        onSuccess={handleRegisterSuccess}
                        onBackToLogin={goToLogin}
                    />
                </div>
            )}

            {currentView === 'student' && user && (
                <StudentDashboard user={user} onLogout={handleLogout} />
            )}

            {currentView === 'admin' && user && (
                <AdminDashboard user={user} onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;