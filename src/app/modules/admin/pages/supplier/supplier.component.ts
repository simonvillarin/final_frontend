import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { MessageService } from 'primeng/api';

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

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
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
          this.supplier.status === 'Inactive' ? 'Activated' : 'Deactivated';
        const details =
          this.supplier.status === 'Inactive'
            ? 'Activated Successfully'
            : 'Deactivated Sucessfully';
        this.messageService.add({
          severity: 'success',
          summary: summary,
          detail: details,
        });
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
}
