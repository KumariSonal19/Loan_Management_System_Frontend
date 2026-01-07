export enum LoanStatus {
  APPLIED = 'APPLIED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED'
}

export interface LoanApplication {
  id?: number;
  loanTypeId: number;
  loanAmount: number;
  tenure: number;
  annualIncome: number;
  employmentScore?: number;
  status?: LoanStatus;
  approvedAmount?: number;
  approvedInterestRate?: number;
  approvalRemarks?: string;
  appliedDate?: string;
  approvalDate?: string;
  closedDate?: string;
}

export interface LoanApprovalRequest {
  loanId: number;
  status: string;
  approvedAmount?: number;
  interestRate?: number;
  remarks: string;
}
