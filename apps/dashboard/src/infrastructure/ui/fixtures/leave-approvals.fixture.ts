import type { LeaveApprovalsViewModel } from '../../../adapters/presenters/leave-approvals/leave-approvals.presenter';

/** Placeholder data of the leave approvals screen (mockup v3, flow 9). */
export const leaveApprovalsFixture: LeaveApprovalsViewModel = {
  summary: "4 demandes en attente · 3 salariés absents aujourd'hui",
  statusFilter: 'En attente',
  requests: [
    {
      id: 'lr-1',
      initials: 'CM',
      employee: 'Camille Martin',
      type: 'Congés payés',
      period: '29/10 – 30/10/2026',
      days: '2 j',
      balanceAfter: '16 j',
      status: { label: 'En attente', tone: 'warning' },
    },
    {
      id: 'lr-2',
      initials: 'SL',
      employee: 'Sarah Lefèvre',
      type: 'Congés payés',
      period: '02/11 – 06/11/2026',
      days: '5 j',
      balanceAfter: '9 j',
      status: { label: 'En attente', tone: 'warning' },
    },
    {
      id: 'lr-3',
      initials: 'HF',
      employee: 'Hugo Fontaine',
      type: 'RTT',
      period: '16/10/2026',
      days: '1 j',
      balanceAfter: '3 j',
      status: { label: 'En attente', tone: 'warning' },
    },
    {
      id: 'lr-4',
      initials: 'LC',
      employee: 'Léa Chevalier',
      type: 'Congés payés',
      period: '21/12 – 31/12/2026',
      days: '7 j',
      balanceAfter: '12 j',
      status: { label: 'En attente', tone: 'warning' },
    },
  ],
};
