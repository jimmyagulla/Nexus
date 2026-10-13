import {
  createEmployeesPageComposition,
  type EmployeesPageComposition,
} from './employees-page.composition';
import {
  createEmployeePageComposition,
  type EmployeePageComposition,
} from './employee-page.composition';
import {
  createEmployeeAttendancePageComposition,
  type EmployeeAttendancePageComposition,
} from './employee-attendance-page.composition';

/** Compositions of the employee pages. */
export type EmployeeComposition = {
  employees: EmployeesPageComposition;
  employee: EmployeePageComposition;
  employeeAttendance: EmployeeAttendancePageComposition;
};

export function createEmployeeComposition(): EmployeeComposition {
  return {
    employees: createEmployeesPageComposition(),
    employee: createEmployeePageComposition(),
    employeeAttendance: createEmployeeAttendancePageComposition(),
  };
}
