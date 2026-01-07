import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EMIService } from '../../../services/emi';
import { EMISchedule } from '../../../../../shared/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-emi-schedule',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './emi-schedule.html',
  styleUrls: ['./emi-schedule.css']
})
export class EmiScheduleComponent implements OnInit {
  emiSchedule: EMISchedule[] = [];
  isLoading = true;
  loanId!: number;

  paidCount = 0;
  pendingCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emiService: EMIService,
    private toastr: ToastrService, 
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loanId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSchedule();
  }

  loadSchedule(): void {
    this.emiService.getEMISchedule(this.loanId).subscribe({
      next: data => {
        this.emiSchedule = data;
        this.paidCount = data.filter(e => e.status === 'PAID').length;
        this.pendingCount = data.filter(e => e.status === 'PENDING').length;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to load EMI schedule');
        this.isLoading = false;
      }
    });
  }

  makePayment(emiId: number, amount: number): void {
    this.router.navigate(['/customer/emi-payment', emiId], { 
      queryParams: { amount: amount } 
    });
  }

  goBack(): void {
    this.router.navigate(['/customer/dashboard']);
  }
}
