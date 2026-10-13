import type { LeaveRequestViewModel } from '../views/leaves/LeaveRequest';
import type { LeaveRequestSentViewModel } from '../views/leaves/LeaveRequestSent';
import type { LeavesViewModel } from '../views/leaves/Leaves';
import type {
  LeaveCalendarDayModel,
  LeaveCalendarDayState,
} from '../views/leaves/components/LeaveCalendarDay';

/** Placeholder data of the leaves screens (mockup v3, flow 4). */

const blank: LeaveCalendarDayModel = { label: '', state: 'outside' };

/** October 2026, day by day (the 1st is a Thursday). */
const octoberStates: LeaveCalendarDayState[] = [
  'workday', 'workday', 'weekend', 'weekend', 'workday', 'workday', 'workday',
  'workday', 'workday', 'weekend', 'weekend', 'accepted', 'workday', 'workday',
  'workday', 'workday', 'weekend', 'weekend', 'workday', 'workday', 'workday',
  'workday', 'workday', 'weekend', 'weekend', 'workday', 'workday', 'workday',
  'pending', 'pending', 'weekend',
];

export const leavesFixture: LeavesViewModel = {
  referencePeriod: '01/06/2026 – 31/05/2027',
  balance: {
    available: '18 jours',
    acquired: '25 j',
    taken: '7 j',
    pending: '2 j',
  },
  calendar: {
    month: 'Octobre 2026',
    days: [
      blank,
      blank,
      blank,
      ...octoberStates.map((state, index) => ({
        label: String(index + 1),
        state,
        today: index + 1 === 3,
      })),
    ],
  },
  requests: [
    {
      type: 'Congés payés',
      period: '29/10 – 30/10/2026',
      days: '2 j',
      status: { label: 'En attente', tone: 'warning' },
    },
    {
      type: 'RTT',
      period: '12/10/2026',
      days: '1 j',
      status: { label: 'Acceptée', tone: 'success' },
    },
    {
      type: 'Congés payés',
      period: '24/09 – 25/09/2026',
      days: '2 j',
      status: { label: 'Acceptée', tone: 'success' },
    },
    {
      type: 'Congés payés',
      period: '03/08 – 14/08/2026',
      days: '10 j',
      status: { label: 'Acceptée', tone: 'success' },
    },
    {
      type: 'Congés payés',
      period: '15/05/2026',
      days: '1 j',
      status: { label: 'Annulée', tone: 'draft' },
    },
    {
      type: 'Congés sans solde',
      period: '20/03/2026',
      days: '1 j',
      status: { label: 'Refusée', tone: 'danger' },
    },
  ],
};

export const leaveRequestFixture: LeaveRequestViewModel = {
  form: {
    typeOptions: ['Congés payés', 'RTT', 'Congés sans solde', 'Absence exceptionnelle'],
    type: 'Congés payés',
    startDate: '29/10/2026',
    endDate: '30/10/2026',
    dayCount: '2 jours ouvrés',
    comment: 'Pont de la Toussaint.',
  },
  impact: {
    available: '18 j',
    deducted: '− 2 j',
    balanceAfter: '16 j',
    remainingPercent: 64,
    deductedPercent: 8,
  },
  detail: {
    range: 'jeu. 29/10 → ven. 30/10',
    calendarDays: '2',
    weekendsExcluded: '0',
    holidaysExcluded: '0',
    countedDays: '2',
    expectedReturn: 'lundi 02/11/2026',
  },
  validator: 'Nadia Roussel, service RH',
};

export const leaveRequestSentFixture: LeaveRequestSentViewModel = {
  description:
    'Votre demande a été transmise au service RH. Vous serez notifié par e-mail de la décision.',
  type: 'Congés payés',
  period: 'Du 29/10 au 30/10/2026',
  deducted: '2 j · solde après validation 16 j',
  sentAt: '03/10/2026 à 11:02',
  status: { label: 'En attente', tone: 'warning' },
  steps: [
    { label: 'Envoyée', state: 'done' },
    { label: 'Validation RH', state: 'current' },
    { label: 'Acceptée ou refusée', state: 'upcoming' },
  ],
};
