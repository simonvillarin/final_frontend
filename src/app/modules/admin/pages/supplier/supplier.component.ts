import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
})
export class SupplierComponent {
  farmers: any[] = [];
  confirmationDialog = false;
  farmerIdToDelete: any;

  gridLayout = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getFarmers();
  }

  getFarmers(): void {
    this.userService.getAllSupplier().subscribe((data: any[]) => {
      this.farmers = data;
    });
  }

  onDelete(farmerId: any): void {
    this.farmerIdToDelete = farmerId;
    this.confirmationDialog = true;
  }

  onConfirmDelete(): void {
    this.userService
      .updateUser(this.farmerIdToDelete, { status: false })
      .subscribe(() => {
        this.getFarmers();
        this.confirmationDialog = false;
      });
  }

  onCancelDelete(): void {
    this.confirmationDialog = false;
    this.farmerIdToDelete = null;
  }
}
