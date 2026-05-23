import Modal from '@/components/ui/Modal.jsx'
import Button from '@/components/ui/Button.jsx'
import GoalForm, { GOAL_FORM_ID } from './GoalForm.jsx'

export default function GoalFormModal({
  open,
  mode = 'create',
  initialValues,
  saving = false,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === 'edit'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit goal' : 'New savings goal'}
      description={
        isEdit
          ? 'Update target, deadline, milestones, or status.'
          : 'Set a savings target and optional milestones along the way.'
      }
      size="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={GOAL_FORM_ID} loading={saving}>
            {isEdit ? 'Save changes' : 'Create goal'}
          </Button>
        </>
      }
    >
      <GoalForm
        key={`${isEdit ? 'edit' : 'new'}-${initialValues.title}`}
        initialValues={initialValues}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}
