import type { EmployeeAttendancePageComposition } from '../../../composition/employee/employee-attendance-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetEmployeeAttendance } from '../../hooks/useGetEmployeeAttendance';
import { i18n } from '../../i18n/i18n';
import { EmployeeAttendance } from './EmployeeAttendance';

interface EmployeeAttendancePageProps {
  deps: EmployeeAttendancePageComposition;
}

export function EmployeeAttendancePage({ deps }: EmployeeAttendancePageProps) {
  const employeeAttendance = useGetEmployeeAttendance(deps);

  if (employeeAttendance.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (employeeAttendance.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <EmployeeAttendance model={employeeAttendance.data} />;
}
