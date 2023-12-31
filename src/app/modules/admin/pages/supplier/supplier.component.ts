import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { MessageService } from 'primeng/api';
import { EmailService } from 'src/app/shared/services/email/email.service';
import { SmsService } from 'src/app/shared/services/sms/sms.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  providers: [MessageService],
})
export class SupplierComponent {
  suppliers: any = [];
  supplier: any = {};
  statusArr: any = ['Active', 'Inactive', 'Pending'];

  detailsDialog = false;
  confirmationDialog = false;

  statusSelected: string = '';
  search = '';
  empty = true;

  totalAds: number = 0;
  page: number = 0;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private emailService: EmailService,
    private smsService: SmsService
  ) {}

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.userService.getAllSupplier().subscribe(
      (data: any[]) => {
        this.suppliers = data.sort((a: any, b: any) => b.userId - a.userId);
      },
      () => {
        this.authService.logout();
      }
    );
  }

  onStatusChanges = (status: string) => {
    if (status !== '') {
      this.userService.getAllFarmers().subscribe(
        (data: any[]) => {
          this.suppliers = data.sort((a: any, b: any) => b.userId - a.userId);
          this.suppliers = this.suppliers.filter(
            (supplier: any) => supplier.status === status
          );
        },
        () => {
          this.authService.logout();
        }
      );
    }
  };

  onClear = () => {
    this.statusSelected = '';
    this.getSuppliers();
  };

  onCancelDelete(): void {
    this.confirmationDialog = false;
  }

  onDelete = (supplier: any) => {
    this.supplier = supplier;
    this.confirmationDialog = true;
  };

  onConfirmDelete(): void {
    let payload: any = {};

    if (this.supplier.status === 'Active') {
      payload.status = 'Inactive';
    } else {
      payload.status = 'Active';
    }

    this.userService.updateUser(this.supplier.userId, payload).subscribe(
      () => {
        this.getSuppliers();
        this.confirmationDialog = false;
        const summary =
          this.supplier.status === 'Inactive' ? 'Deactivated' : 'Activated';
        const details =
          this.supplier.status === 'Inactive'
            ? 'Dectivated Successfully'
            : 'Activated Sucessfully';
        this.messageService.add({
          severity: 'success',
          summary: summary,
          detail: details,
        });

        const payload = {
          email: this.supplier.email,
          subject: `Account Activation`,
          message: `
                  Dear ${this.supplier.firstName},

                  We're thrilled to inform you that your account has been successfully activated! You can now enjoy and explore all the features of our platform.

                  Thank you!.

                  Warm regards,
                  Hacienda
                `,
        };

        this.emailService.sendEmail1(payload).subscribe();
        const payload1 = {
          message: `
                  Dear ${this.supplier.firstName},

                  We're thrilled to inform you that your account has been successfully activated! You can now enjoy and explore all the features of our platform.

                  Thank you!.

                  Warm regards,
                  Hacienda
                `,
        };
        // this.smsService.sendFarmerSMS(payload1).subscribe();
      },
      () => {
        this.authService.logout();
      }
    );
  }

  openDetailsDialog = (supplier: any) => {
    this.supplier = supplier;
    this.detailsDialog = true;
  };

  closeDetailsDialog(): void {
    this.detailsDialog = false;
  }

  onSearchChange = (search: string) => {
    if (search !== '') {
      this.suppliers = this.suppliers.filter(
        (supplier: any) =>
          supplier.firstName.toLowerCase().includes(search.toLowerCase()) ||
          supplier.lastName.toLowerCase().includes(search.toLowerCase()) ||
          supplier.middleName?.toLowerCase().includes(search.toLowerCase())
      );
      if (this.suppliers.length > 0) {
        this.empty = false;
      } else {
        this.empty = true;
      }
    } else {
      this.getSuppliers();
    }
  };
}
