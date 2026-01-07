export interface LoanType {
  id?: number;
  typeName: string;
  minAmount: number;
  maxAmount: number;
  baseInterestRate: number;
  minTenure: number;
  maxTenure: number;
  description?: string;
  isActive?: boolean;
}
