const ApiError = require('../utils/ApiError');
const { Category } = require('../models');
const { USER_DEFAULT_CATEGORY_TEMPLATES } = require('../constants/defaultCategories');

/**
 * Create default categories when a user has none (register or first list).
 * Skips if any category already exists — avoids duplicates for seeded users.
 */
async function ensureDefaultCategories(userId) {
  const count = await Category.countDocuments({ userId });
  if (count > 0) {
    return { created: false, count };
  }

  const docs = USER_DEFAULT_CATEGORY_TEMPLATES.map((template) => ({
    ...template,
    userId,
    isDefault: true,
  }));

  try {
    await Category.insertMany(docs, { ordered: false });
    return { created: true, count: docs.length };
  } catch (err) {
    if (err.code === 11000) {
      const after = await Category.countDocuments({ userId });
      return { created: after > 0, count: after };
    }
    throw err;
  }
}

async function listByUser(userId, filters = {}) {
  await ensureDefaultCategories(userId);

  const query = { userId };
  if (filters.type) query.type = filters.type;
  return Category.find(query).sort({ name: 1 });
}

async function getById(userId, categoryId) {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
}

async function create(userId, data) {
  try {
    return await Category.create({ ...data, userId });
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, 'Category with this name already exists');
    }
    throw err;
  }
}

module.exports = {
  ensureDefaultCategories,
  listByUser,
  getById,
  create,
};
