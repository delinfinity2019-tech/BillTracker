
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum BillCategory {
  UTILITIES = 'Utilities',
  RENT = 'Rent',
  SUBSCRIPTION = 'Subscription',
  LOAN = 'Loan',
  INSURANCE = 'Insurance',
  CUSTOM = 'Custom'
}

export enum BillingCycle {
  ONETIME = 'One-time',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  YEARLY = 'Yearly'
}

export enum BillStatus {
  UPCOMING = 'Upcoming',
  DUE_TODAY = 'Due Today',
  OVERDUE = 'Overdue',
  PAID = 'Paid',
  ARCHIVED = 'Archived'
}

export enum ReminderTiming {
  SAME_DAY = 'Same Day',
  ONE_DAY_BEFORE = '1 Day Before',
  THREE_DAYS_BEFORE = '3 Days Before',
  CUSTOM = 'Custom'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
  isActive: boolean;
}

export interface BillPayment {
  id: string;
  billId: string;
  amount: number;
  paidAt: string;
  notes?: string;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  category: BillCategory;
  amount: number;
  dueDate: string;
  cycle: BillingCycle;
  reminderTiming: ReminderTiming;
  status: BillStatus;
  notes?: string;
  history: BillPayment[];
  createdAt: string;
  isDeleted: boolean;
}

export interface SystemLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}
