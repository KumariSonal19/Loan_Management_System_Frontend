import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      const valid = phoneRegex.test(control.value);

      return valid ? null : { invalidPhone: { value: control.value } };
    };
  }

  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = parseFloat(control.value);
      return value > 0 ? null : { notPositive: { value: control.value } };
    };
  }

  static greaterThan(fieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent || !control.value) {
        return null;
      }

      const otherField = control.parent.get(fieldName);
      if (!otherField || !otherField.value) {
        return null;
      }

      const value = parseFloat(control.value);
      const otherValue = parseFloat(otherField.value);

      return value > otherValue ? null : { notGreaterThan: { value, otherValue } };
    };
  }

  static matchPassword(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField);
      const confirmPassword = formGroup.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPassword.setErrors(null);
        return null;
      }
    };
  }
}




