import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth.js'
import { useToast } from '@/components/feedback/useToast.js'
import { DEFAULT_CURRENCY } from '@/utils/constants.js'
import PageHeader from '@/components/layout/PageHeader.jsx'
import Button from '@/components/ui/Button.jsx'
import { Card } from '@/components/ui/Card.jsx'
import AlertBanner from '@/components/feedback/AlertBanner.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import { Receipt } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions.js'
import { getCategoryId } from '@/utils/categoryHelpers.js'
import {
  emptyForm,
  formFromTransaction,
} from '../utils/transactionHelpers.js'
import {
  TransactionTable,
  TransactionCard,
  TransactionFormModal,
  TransactionFilters,
  TransactionSearchBar,
  DeleteConfirmationModal,
} from '../components/index.js'

export default function TransactionsPage() {
  const { user } = useAuth()
  const toast = useToast()
  const currency = user?.currency ?? DEFAULT_CURRENCY

  const {
    transactions,
    categories,
    categoriesLoading,
    filters,
    setFilter,
    resetFilters,
    loading,
    saving,
    error,
    refresh,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions()

  const [modal, setModal] = useState({ open: false, mode: 'create' })
  const [formInitial, setFormInitial] = useState(emptyForm())
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  function openCreate() {
    setFormInitial(emptyForm(filters.type || 'expense'))
    setEditingId(null)
    setModal({ open: true, mode: 'create' })
  }

  function openEdit(tx) {
    setFormInitial(formFromTransaction(tx))
    setEditingId(tx.id)
    setModal({ open: true, mode: 'edit' })
  }

  function closeModal() {
    setModal({ open: false, mode: 'create' })
    setEditingId(null)
  }

  async function handleSave(payload) {
    try {
      if (modal.mode === 'edit' && editingId) {
        await updateTransaction(editingId, payload)
        toast.success('Transaction updated')
      } else {
        await createTransaction(payload)
        toast.success('Transaction created')
      }
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Could not save transaction')
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteTransaction(deleteTarget.id)
      toast.success('Transaction deleted')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err?.message || 'Could not delete transaction')
    } finally {
      setDeleting(false)
    }
  }

  function handleTypeFilterChange(value) {
    setFilter('type', value)
    const cat = categories.find(
      (c) => getCategoryId(c) === filters.categoryId,
    )
    if (cat && value && cat.type !== value) {
      setFilter('categoryId', '')
    }
  }

  const addButton = (
    <Button
      leftIcon={<Plus className="h-4 w-4" />}
      onClick={openCreate}
    >
      Add transaction
    </Button>
  )

  return (
    <div className="page-stack">
      <PageHeader
        title="Transactions"
        description="Track income and expenses, filter activity, and manage entries."
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
          title="Could not load all data"
          message={error}
        />
      )}

      <Card padding className="space-y-4">
        <TransactionSearchBar
          value={filters.search}
          onChange={(value) => setFilter('search', value)}
          onClear={() => setFilter('search', '')}
        />
        <TransactionFilters
          type={filters.type}
          categoryId={filters.categoryId}
          sort={filters.sort}
          categories={categories}
          onTypeChange={handleTypeFilterChange}
          onCategoryChange={(value) => setFilter('categoryId', value)}
          onSortChange={(value) => setFilter('sort', value)}
          onReset={resetFilters}
        />
        <p className="text-xs text-muted">
          {loading
            ? 'Loading…'
            : `${transactions.length} transaction${transactions.length === 1 ? '' : 's'}`}
        </p>
      </Card>

      <TransactionTable
        transactions={transactions}
        currency={currency}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onAdd={addButton}
      />

      <div className="space-y-3 md:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding>
              <SkeletonLoader className="mb-2 h-4 w-3/4" />
              <SkeletonLoader className="h-3 w-1/2" />
            </Card>
          ))
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={<Receipt className="h-5 w-5" />}
            title="No transactions found"
            description="Adjust filters or add your first transaction."
            action={addButton}
          />
        ) : (
          transactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              currency={currency}
              onEdit={() => openEdit(tx)}
              onDelete={() => setDeleteTarget(tx)}
            />
          ))
        )}
      </div>

      <TransactionFormModal
        open={modal.open}
        mode={modal.mode}
        initialValues={formInitial}
        categories={categories}
        categoriesLoading={categoriesLoading}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSave}
      />

      <DeleteConfirmationModal
        open={Boolean(deleteTarget)}
        transaction={deleteTarget}
        currency={currency}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
