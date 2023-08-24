import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.component.html',
  styleUrls: ['./farmers.component.scss'],
})
export class FarmersComponent {
  farmers: any = [];
  statusArr: any = ['Active', 'Inactive'];
  farmerToUpdateStatus: any;

  confirmationDialog = false;
  gridLayout = false;

  statusSelected: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getFarmers();
  }

  getFarmers(): void {
    this.userService.getAllFarmers().subscribe((data: any[]) => {
      this.farmers = data.sort((a: any, b: any) => b.farmerId - a.farmerId);
    });
  }

  onStatusChanges = (status: string) => {
    if (status !== '') {
      this.userService.getAllFarmers().subscribe((data: any[]) => {
        this.farmers = data.sort((a: any, b: any) => b.farmerId - a.farmerId);

        if (status === 'Active') {
          this.farmers = this.farmers.filter(
            (farmer: any) => farmer.status === true
          );
        } else {
          console.log(false);
          this.farmers = this.farmers.filter(
            (farmer: any) => farmer.status === false
          );
        }
      });
    }
  };

  onClear = () => {
    this.statusSelected = '';
    this.getFarmers();
  };

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
