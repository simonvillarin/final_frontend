import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.component.html',
  styleUrls: ['./farmers.component.scss'],
})
export class FarmersComponent {
  farmers: any[] = [];
  confirmationDialog = false;
  farmerToUpdateStatus: any;

  gridLayout = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getFarmers();
  }

  getFarmers(): void {
    this.userService.getAllFarmers().subscribe((data: any[]) => {
      this.farmers = data;
    });
  }

  onDelete(farmerId: any): void {
    this.farmerToUpdateStatus = farmerId;
    this.confirmationDialog = true;
  }

  onConfirmDelete(): void {
    this.userService
      .updateUser(this.farmerToUpdateStatus, { status: false })
      .subscribe(() => {
        this.getFarmers();
        this.confirmationDialog = false;
      });
  }

  onCancelDelete(): void {
    this.confirmationDialog = false;
    this.farmerToUpdateStatus = null;
  }

  openConfirmationDialog(farmer: any): void {
    this.farmerToUpdateStatus = farmer.farmerId;
    this.confirmationDialog = true;
  }

  onConfirmStatusChange(): void {
    this.userService
      .updateUser(this.farmerToUpdateStatus, {
        status: this.farmerToUpdateStatus.status,
      })
      .subscribe(() => {
        this.farmerToUpdateStatus = null;
        this.confirmationDialog = false;
      });
  }
}
