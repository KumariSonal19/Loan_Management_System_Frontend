export enum EMIStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}

export interface EMISchedule {
  id: number;
  loanApplicationId: number;
  emiNumber: number;
  dueDate: string;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
  status: EMIStatus;
}

export interface PaymentRequest {
  emiScheduleId: number;
  amountPaid: number;
  paymentMode:
    | 'UPI'
    | 'NET_BANKING';
}
