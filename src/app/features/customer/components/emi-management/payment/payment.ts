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
  styleUrls: ['./payment.css']
})
export class PaymentComponent implements OnInit {
  form!: FormGroup;
  emiId!: number;
  loading = false;
  amountToPay = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private emiService: EMIService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.emiId = Number(this.route.snapshot.paramMap.get('id'));

    const queryAmount = this.route.snapshot.queryParamMap.get('amount');
    this.amountToPay = queryAmount ? Number(queryAmount) : 0;

    this.form = this.fb.group({
      amountPaid: [
        { value: this.amountToPay, disabled: true },
        [Validators.required, Validators.min(1)]
      ],
      paymentMode: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const formData = this.form.getRawValue();

    this.emiService.makePayment({
      emiScheduleId: this.emiId,
      amountPaid: formData.amountPaid,
      paymentMode: formData.paymentMode
    }).subscribe({
      next: () => {
        this.toastr.success('Payment successful');
        this.router.navigate(['/customer/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Payment failed. Please try again.');
      }
    });
  }
}
