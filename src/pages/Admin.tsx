import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Loader2, Users, Calendar, Mail } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  lastLogin: any;
}

export function Admin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extra safety check
  if (auth.currentUser?.email !== 'bhuvangowdan71@gmail.com') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('lastLogin', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedUsers: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push(doc.data() as UserProfile);
        });
        setUsers(fetchedUsers);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
          <Users className="text-emerald-600" size={32} />
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 mt-2">View all registered users and their last login times.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Registered Users ({users.length})</h2>
        </div>
        
        <div className="divide-y divide-zinc-100">
          {users.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No users found.</div>
          ) : (
            users.map((user) => {
              const date = user.lastLogin?.toDate ? user.lastLogin.toDate().toLocaleString() : 'Just now';
              
              return (
                <div key={user.uid} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 px-6 sm:px-8 hover:bg-zinc-50 transition-colors gap-4 sm:gap-0">
                  <div className="flex items-center gap-4">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full bg-zinc-200 object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-semibold text-zinc-900 mb-0.5">{user.displayName || 'No Name'}</h3>
                      <p className="text-sm text-zinc-500 flex items-center gap-1">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:gap-8 shrink-0 justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-1 sm:justify-end mb-1">
                        <Calendar size={12} /> Last Login
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-zinc-900">{date}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
