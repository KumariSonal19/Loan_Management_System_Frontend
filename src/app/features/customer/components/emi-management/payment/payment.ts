import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EMIService } from '../../../services/emi';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.scss']
})
export class PaymentComponent implements OnInit {
  form!: FormGroup;
  emiId!: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private emiService: EMIService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.emiId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      amountPaid: ['', [Validators.required, Validators.min(1)]],
      paymentMode: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    this.emiService.makePayment({
      emiScheduleId: this.emiId,
      ...this.form.value
    }).subscribe({
      next: () => {
        this.toastr.success('Payment successful');
        this.router.navigate(['/customer/dashboard']);
      },
      error: () => this.loading = false
    });
  }
}
