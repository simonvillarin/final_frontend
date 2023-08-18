import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PasswordLengthValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.value;
    if (password && password.length < 8) {
      return { passwordLength: true };
    }
    return null;
  };
};

export const hasNumberValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasNumber = /\d/.test(control.value);
    return hasNumber ? null : { hasNumber: true };
  };
};

export const hasLowercaseValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasLowercase = /[a-z]/.test(control.value);
    return hasLowercase ? null : { hasLowercase: true };
  };
};

export const hasUppercaseValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasUppercase = /[A-Z]/.test(control.value);
    return hasUppercase ? null : { hasUppercase: true };
  };
};

export const hasSymbolValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    return hasSymbol ? null : { hasSymbol: true };
  };
};

export const hasNegativeValue = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value < 1) {
      return { negative: true };
    }
    return null;
  };
};

//Validate Mobile Number (forgot password)
export const mobileNumberValidator = (): ValidatorFn => {
  const regexPattern = /^(09|\+639)\d{9}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = regexPattern.test(control.value);
    return isValid ? null : { mobileNoIsValid: true };
  };
};

// zip validator
export const zipcodeValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value.toString().length != 4) {
      return { maxLength: true };
    }
    return null;
  };
};

export const telephoneNumberValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const valueAsString = value ? value.toString() : '';

    if (
      valueAsString.length < 8 ||
      valueAsString.length > 10 ||
      valueAsString.length === 9
    ) {
      return { numberRange: true };
    }

    return null;
  };
};

// birthday
export const birthdateValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDate = control.value;
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);

    if (selectedDateObj >= today) {
      return { futureDate: true };
    }

    return null;
  };
};
// age >= 17
export const ageValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDate = control.value;
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);

    const ageDifferenceMs = today.getTime() - selectedDateObj.getTime();

    const ageDifferenceYears = ageDifferenceMs / (1000 * 60 * 60 * 24 * 365);

    if (ageDifferenceYears < 17) {
      return { underage: true };
    }

    return null;
  };
};

export function minUnitsArrayValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const unitsArray = control.value;
    if (!Array.isArray(unitsArray)) {
      return null;
    }

    for (const unit of unitsArray) {
      const parsedUnit = Number(unit);
      if (isNaN(parsedUnit) || parsedUnit < 1) {
        return { minUnitsArray: true };
      }
    }

    return null;
  };
}

export function confirmPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get('newPassword');
    const confirmPasswordControl = control.get('confirmPassword');

    if (passwordControl?.value !== confirmPasswordControl?.value) {
      confirmPasswordControl?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPasswordControl?.setErrors(null);
      return null;
    }
  };
}
