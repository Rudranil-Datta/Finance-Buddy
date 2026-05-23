import { useMemo, useState } from 'react'
import { Plus, RefreshCw, Target } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth.js'
import { useToast } from '@/components/feedback/useToast.js'
import { DEFAULT_CURRENCY, GOAL_STATUSES } from '@/utils/constants.js'
import { formatCurrency } from '@/utils/format.js'
import PageHeader from '@/components/layout/PageHeader.jsx'
import Button from '@/components/ui/Button.jsx'
import StatCard from '@/components/ui/StatCard.jsx'
import AlertBanner from '@/components/feedback/AlertBanner.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import { Card } from '@/components/ui/Card.jsx'
import Select from '@/components/ui/Select.jsx'
import { useGoals } from '../hooks/useGoals.js'
import { emptyGoalForm, formFromGoal } from '../utils/goalHelpers.js'
import {
  GoalCard,
  GoalFormModal,
  ContributeModal,
  GoalDeleteModal,
} from '../components/index.js'

export default function GoalsPage() {
  const { user } = useAuth()
  const toast = useToast()
  const currency = user?.currency ?? DEFAULT_CURRENCY

  const {
    goals,
    statusFilter,
    setStatusFilter,
    loading,
    saving,
    error,
    refresh,
    createGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
  } = useGoals()

  const [modal, setModal] = useState({ open: false, mode: 'create' })
  const [formInitial, setFormInitial] = useState(emptyGoalForm())
  const [editingId, setEditingId] = useState(null)
  const [contributeTarget, setContributeTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const summary = useMemo(() => {
    const active = goals.filter((g) => g.status === 'active').length
    const completed = goals.filter((g) => g.status === 'completed').length
    const totalSaved = goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0)
    const totalTarget = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0)
    return { active, completed, totalSaved, totalTarget, count: goals.length }
  }, [goals])

  function openCreate() {
    setFormInitial(emptyGoalForm())
    setEditingId(null)
    setModal({ open: true, mode: 'create' })
  }

  function openEdit(goal) {
    setFormInitial(formFromGoal(goal))
    setEditingId(goal.id)
    setModal({ open: true, mode: 'edit' })
  }

  function closeModal() {
    setModal({ open: false, mode: 'create' })
    setEditingId(null)
  }

  async function handleSave(payload) {
    try {
      if (modal.mode === 'edit' && editingId) {
        await updateGoal(editingId, payload)
        toast.success('Goal updated')
      } else {
        await createGoal(payload)
        toast.success('Goal created')
      }
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Could not save goal')
    }
  }

  async function handleContribute(amount) {
    if (!contributeTarget) return
    try {
      await contributeToGoal(contributeTarget.id, amount)
      toast.success('Contribution added')
      setContributeTarget(null)
    } catch (err) {
      toast.error(err?.message || 'Could not add contribution')
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteGoal(deleteTarget.id)
      toast.success('Goal deleted')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err?.message || 'Could not delete goal')
    } finally {
      setDeleting(false)
    }
  }

  const statusOptions = [
    { value: '', label: 'All statuses' },
    ...GOAL_STATUSES.map((s) => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1),
    })),
  ]

  const addButton = (
    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
      Add goal
    </Button>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Savings goals"
        description="Track targets, milestones, and contributions toward what matters."
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
        <AlertBanner variant="warning" title="Could not load goals" message={error} />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} padding>
                <SkeletonLoader className="mb-2 h-3 w-1/2" />
                <SkeletonLoader className="h-6 w-2/3" />
              </Card>
            ))
          ) : (
            <>
              <StatCard title="Goals" value={String(summary.count)} />
              <StatCard title="Active" value={String(summary.active)} />
              <StatCard
                title="Total saved"
                value={formatCurrency(summary.totalSaved, currency)}
              />
              <StatCard
                title="Combined target"
                value={formatCurrency(summary.totalTarget, currency)}
                subtitle={`${summary.completed} completed`}
              />
            </>
          )}
        </div>
        <div className="w-full sm:w-44">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} padding className="space-y-4">
              <SkeletonLoader className="h-4 w-2/3" />
              <SkeletonLoader className="h-2 w-full rounded-full" />
            </Card>
          ))}
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={<Target className="h-5 w-5" />}
          title="No goals yet"
          description="Create a savings goal and add contributions as you go."
          action={addButton}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currency={currency}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onContribute={setContributeTarget}
            />
          ))}
        </div>
      )}

      <GoalFormModal
        open={modal.open}
        mode={modal.mode}
        initialValues={formInitial}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSave}
      />

      <ContributeModal
        open={Boolean(contributeTarget)}
        goal={contributeTarget}
        currency={currency}
        saving={saving}
        onClose={() => setContributeTarget(null)}
        onSubmit={handleContribute}
      />

      <GoalDeleteModal
        open={Boolean(deleteTarget)}
        goal={deleteTarget}
        currency={currency}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
