import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
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
    private authService: AuthService
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

    console.log(this.supplier);

    if (this.supplier.status === 'Inactive') {
      payload.status = 'Active';
    } else {
      payload.status = 'Inactive';
    }

    console.log(payload);

    this.userService.updateUser(this.supplier.userId, payload).subscribe(
      () => {
        this.getSuppliers();
        this.confirmationDialog = false;
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
