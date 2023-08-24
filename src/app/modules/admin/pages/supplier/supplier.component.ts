import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
})
export class SupplierComponent {
  suppliers: any[] = [];
  statusArr: any = ['Active', 'Inactive'];
  farmerIdToDelete: any;

  confirmationDialog = false;
  gridLayout = false;

  statusSelected: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.userService.getAllSupplier().subscribe((data: any[]) => {
      this.suppliers = data;
    });
  }

  onStatusChanges = (status: string) => {
    if (status !== '') {
      this.userService.getAllSupplier().subscribe((data: any[]) => {
        this.suppliers = data.sort(
          (a: any, b: any) => b.supplierId - a.supplierId
        );

        if (status === 'Active') {
          this.suppliers = this.suppliers.filter(
            (supplier: any) => supplier.status === true
          );
        } else {
          this.suppliers = this.suppliers.filter(
            (supplier: any) => supplier.status === false
          );
        }
      });
    }
  };

  onClear = () => {
    this.statusSelected = '';
    this.getSuppliers();
  };

  onDelete(farmerId: any): void {
    this.farmerIdToDelete = farmerId;
    this.confirmationDialog = true;
  }

  onConfirmDelete(): void {
    this.userService
      .updateUser(this.farmerIdToDelete, { status: false })
      .subscribe(() => {
        this.getSuppliers();
        this.confirmationDialog = false;
      });
  }

  onCancelDelete(): void {
    this.confirmationDialog = false;
    this.farmerIdToDelete = null;
  }
}
