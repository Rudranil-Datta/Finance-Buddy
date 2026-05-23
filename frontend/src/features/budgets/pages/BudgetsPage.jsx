import { useMemo, useState } from 'react'
import { Plus, RefreshCw, PieChart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth.js'
import { useToast } from '@/components/feedback/useToast.js'
import { DEFAULT_CURRENCY } from '@/utils/constants.js'
import { formatCurrency } from '@/utils/format.js'
import PageHeader from '@/components/layout/PageHeader.jsx'
import Button from '@/components/ui/Button.jsx'
import { Card } from '@/components/ui/Card.jsx'
import StatCard from '@/components/ui/StatCard.jsx'
import AlertBanner from '@/components/feedback/AlertBanner.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import { useBudgets } from '../hooks/useBudgets.js'
import { emptyBudgetForm, formFromBudget } from '../utils/budgetHelpers.js'
import {
  BudgetCard,
  BudgetFormModal,
  BudgetDeleteModal,
} from '../components/index.js'

export default function BudgetsPage() {
  const { user } = useAuth()
  const toast = useToast()
  const currency = user?.currency ?? DEFAULT_CURRENCY

  const {
    budgets,
    categories,
    loading,
    saving,
    error,
    refresh,
    createBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets()

  const [modal, setModal] = useState({ open: false, mode: 'create' })
  const [formInitial, setFormInitial] = useState(emptyBudgetForm())
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const summary = useMemo(() => {
    const over = budgets.filter((b) => b.isOver).length
    const warning = budgets.filter((b) => b.isWarning && !b.isOver).length
    const totalLimit = budgets.reduce((sum, b) => sum + (b.limitAmount || 0), 0)
    const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0)
    return { over, warning, totalLimit, totalSpent, count: budgets.length }
  }, [budgets])

  const existingCategoryIds = useMemo(
    () =>
      budgets
        .filter((b) => b.id !== editingId)
        .map((b) => b.categoryId),
    [budgets, editingId],
  )

  function openCreate() {
    setFormInitial(emptyBudgetForm())
    setEditingId(null)
    setModal({ open: true, mode: 'create' })
  }

  function openEdit(budget) {
    setFormInitial(formFromBudget(budget))
    setEditingId(budget.id)
    setModal({ open: true, mode: 'edit' })
  }

  function closeModal() {
    setModal({ open: false, mode: 'create' })
    setEditingId(null)
  }

  async function handleSave(payload) {
    try {
      if (modal.mode === 'edit' && editingId) {
        await updateBudget(editingId, payload)
        toast.success('Budget updated')
      } else {
        await createBudget(payload)
        toast.success('Budget created')
      }
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Could not save budget')
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteBudget(deleteTarget.id)
      toast.success('Budget deleted')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err?.message || 'Could not delete budget')
    } finally {
      setDeleting(false)
    }
  }

  const addButton = (
    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
      Add budget
    </Button>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Category spending limits with live progress and threshold alerts."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              loading={loading}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={refresh}
            >
              Refresh
            </Button>
            {addButton}
          </div>
        }
      />

      {error && (
        <AlertBanner
          variant="warning"
          title="Could not load budgets"
          message={error}
        />
      )}

      {(summary.over > 0 || summary.warning > 0) && !loading && (
        <AlertBanner
          variant={summary.over > 0 ? 'error' : 'warning'}
          title={
            summary.over > 0
              ? `${summary.over} budget${summary.over === 1 ? '' : 's'} exceeded`
              : `${summary.warning} budget${summary.warning === 1 ? '' : 's'} nearing limit`
          }
          message="Review categories below and adjust spending or limits."
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding>
              <SkeletonLoader className="mb-2 h-3 w-1/2" />
              <SkeletonLoader className="h-6 w-2/3" />
            </Card>
          ))
        ) : (
          <>
            <StatCard title="Active budgets" value={String(summary.count)} />
            <StatCard
              title="Total limit"
              value={formatCurrency(summary.totalLimit, currency)}
            />
            <StatCard
              title="Total spent"
              value={formatCurrency(summary.totalSpent, currency)}
            />
            <StatCard
              title="At risk"
              value={String(summary.over + summary.warning)}
              subtitle={summary.over ? `${summary.over} over` : 'Within limits'}
            />
          </>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} padding className="space-y-4">
              <SkeletonLoader className="h-4 w-2/3" />
              <SkeletonLoader className="h-2 w-full rounded-full" />
              <SkeletonLoader className="h-3 w-1/2" />
            </Card>
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={<PieChart className="h-5 w-5" />}
          title="No budgets yet"
          description="Create a budget per expense category to track spending against limits."
          action={addButton}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              currency={currency}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <BudgetFormModal
        open={modal.open}
        mode={modal.mode}
        initialValues={formInitial}
        categories={categories}
        editingId={editingId}
        existingCategoryIds={existingCategoryIds}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSave}
      />

      <BudgetDeleteModal
        open={Boolean(deleteTarget)}
        budget={deleteTarget}
        currency={currency}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
