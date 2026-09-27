import RoleGuard from '@/app/components/RoleGuard'

const PageDestinations = () => {
  return (
    <RoleGuard allowedRoles={['Admin']}>
      <div>PageDestinations</div>
    </RoleGuard>
  )
}

export default PageDestinations