
export interface User {
  id: string;
  name: string;
}

export interface Partner extends User {}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  isShared: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export type View = 'dashboard' | 'tasks' | 'appointments' | 'expenses' | 'budget' | 'profile';

export enum ExpenseCategory {
    Groceries = 'Groceries',
    Utilities = 'Utilities',
    Transport = 'Transport',
    Entertainment = 'Entertainment',
    Housing = 'Housing',
    Other = 'Other',
}

export type CategoryBudgets = {
    [key in ExpenseCategory]?: number;
};