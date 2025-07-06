
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Appointments from './components/Appointments';
import Expenses from './components/Expenses';
import Profile from './components/Profile';
import Budget from './components/Budget';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, Appointment, Expense, User, Partner, View, CategoryBudgets, ExpenseCategory } from './types';
import { WelcomeModal } from './components/WelcomeModal';
import { UsersIcon } from './components/icons/UsersIcon';
import { MenuIcon } from './components/icons/MenuIcon';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  
  const [user, setUser] = useLocalStorage<User>('lifeSync-user', { id: '', name: '' });
  const [partners, setPartners] = useLocalStorage<Partner[]>('lifeSync-partners', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('lifeSync-tasks', []);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('lifeSync-appointments', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('lifeSync-expenses', []);
  
  const [totalBudget, setTotalBudget] = useLocalStorage<number>('lifeSync-totalBudget', 2000);
  const [categoryBudgets, setCategoryBudgets] = useLocalStorage<CategoryBudgets>('lifeSync-categoryBudgets', {
      [ExpenseCategory.Groceries]: 400,
      [ExpenseCategory.Utilities]: 150,
      [ExpenseCategory.Transport]: 200,
      [ExpenseCategory.Entertainment]: 100,
      [ExpenseCategory.Housing]: 1000,
      [ExpenseCategory.Other]: 150,
  });

  const [isInitialised, setIsInitialised] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user has been set up
    if (user && user.id && user.name) {
      setIsInitialised(true);
    }
  }, [user]);

  const handleInitialSetup = (name: string) => {
    setUser({ id: `user-${uuidv4()}`, name });
    setIsInitialised(true);
  };
  
  const addPartner = (partnerCode: string) => {
    try {
      const newPartner = JSON.parse(partnerCode);
      if (newPartner.id && newPartner.name && !partners.some(p => p.id === newPartner.id) && newPartner.id !== user.id) {
        setPartners([...partners, newPartner]);
        alert(`Successfully linked with ${newPartner.name}!`);
      } else {
         alert('Invalid or duplicate partner code.');
      }
    } catch (e) {
      alert('Failed to parse partner code. Please ensure it is correct.');
    }
  };

  const handleSetView = (newView: View) => {
    setView(newView);
    setIsSidebarOpen(false);
  }
  
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard tasks={tasks} appointments={appointments} expenses={expenses} userName={user.name} />;
      case 'tasks':
        return <Tasks tasks={tasks} setTasks={setTasks} />;
      case 'appointments':
        return <Appointments appointments={appointments} setAppointments={setAppointments} partners={partners} />;
      case 'expenses':
        return <Expenses expenses={expenses} setExpenses={setExpenses} />;
      case 'budget':
        return <Budget 
                  expenses={expenses} 
                  totalBudget={totalBudget}
                  setTotalBudget={setTotalBudget}
                  categoryBudgets={categoryBudgets}
                  setCategoryBudgets={setCategoryBudgets}
                />;
      case 'profile':
        return <Profile user={user} setUser={setUser} partners={partners} addPartner={addPartner} />;
      default:
        return <Dashboard tasks={tasks} appointments={appointments} expenses={expenses} userName={user.name} />;
    }
  };

  if (!isInitialised) {
    return <WelcomeModal onSetup={handleInitialSetup} />;
  }

  return (
    <div className="bg-slate-900 text-gray-200 font-sans">
      <Sidebar 
        currentView={view} 
        setView={handleSetView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="lg:pl-64">
        <main className="p-4 sm:p-6 lg:p-10 min-h-screen">
          <div className="w-full max-w-7xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-300 hover:text-white">
                  <MenuIcon className="w-7 h-7" />
                </button>
                <h1 className="text-3xl font-bold text-white capitalize lg:text-3xl flex-1 text-center lg:text-left">{view}</h1>
                {partners.length > 0 && (
                  <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full text-sm shrink-0">
                    <UsersIcon className="w-5 h-5 text-indigo-400" />
                    <span className="hidden sm:inline">Linked with {partners.map(p => p.name).join(', ')}</span>
                    <span className="sm:hidden">{partners.length}</span>
                  </div>
                )}
              </div>
              {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
