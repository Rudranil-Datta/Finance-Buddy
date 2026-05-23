/**
 * Demo user definitions and category templates for seeding.
 * Demo users get default + extra categories for richer sample data.
 */

const { SEED_DEMO_CATEGORY_TEMPLATES } = require('../../constants/defaultCategories');

const DEFAULT_CATEGORIES = SEED_DEMO_CATEGORY_TEMPLATES;

const DEMO_USERS = [
  {
    email: 'demo@financebuddy.local',
    password: 'Demo1234!',
    name: 'Rudranil Datta',
    currency: 'INR',
  },
  {
    email: 'jane@financebuddy.local',
    password: 'Demo1234!',
    name: 'Jane Cooper',
    currency: 'USD',
  },
];

module.exports = { DEFAULT_CATEGORIES, DEMO_USERS };
