/**
 * Built-in category templates for new users (no seed required).
 * Persisted per user on register and when listing categories if none exist.
 */
const USER_DEFAULT_CATEGORY_TEMPLATES = [
  { name: 'Food', slug: 'food', type: 'expense', color: '#3b82f6', icon: 'utensils' },
  { name: 'Transport', slug: 'transport', type: 'expense', color: '#8b5cf6', icon: 'car' },
  { name: 'Shopping', slug: 'shopping', type: 'expense', color: '#14b8a6', icon: 'bag' },
  { name: 'Bills', slug: 'bills', type: 'expense', color: '#64748b', icon: 'zap' },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    type: 'expense',
    color: '#ec4899',
    icon: 'film',
  },
  { name: 'Salary', slug: 'salary', type: 'income', color: '#22c55e', icon: 'banknote' },
  { name: 'Health', slug: 'health', type: 'expense', color: '#06b6d4', icon: 'heart' },
  {
    name: 'Education',
    slug: 'education',
    type: 'expense',
    color: '#0ea5e9',
    icon: 'graduation-cap',
  },
  {
    name: 'Investment',
    slug: 'investment',
    type: 'income',
    color: '#10b981',
    icon: 'trending-up',
  },
  { name: 'Other', slug: 'other', type: 'expense', color: '#94a3b8', icon: 'wallet' },
];

/**
 * Extra categories for demo seed only (richer dashboards / generators).
 * Not auto-created for real users.
 */
const SEED_EXTRA_CATEGORY_TEMPLATES = [
  {
    name: 'Groceries',
    slug: 'groceries',
    type: 'expense',
    color: '#2563eb',
    icon: 'shopping-cart',
  },
  {
    name: 'Dining',
    slug: 'dining',
    type: 'discretionary',
    color: '#f59e0b',
    icon: 'coffee',
  },
  {
    name: 'Utilities',
    slug: 'utilities',
    type: 'expense',
    color: '#475569',
    icon: 'zap',
  },
  { name: 'Rent', slug: 'rent', type: 'expense', color: '#ef4444', icon: 'home' },
];

const SEED_DEMO_CATEGORY_TEMPLATES = [
  ...USER_DEFAULT_CATEGORY_TEMPLATES,
  ...SEED_EXTRA_CATEGORY_TEMPLATES,
];

module.exports = {
  USER_DEFAULT_CATEGORY_TEMPLATES,
  SEED_EXTRA_CATEGORY_TEMPLATES,
  SEED_DEMO_CATEGORY_TEMPLATES,
};
