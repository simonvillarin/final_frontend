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
  farmerIdToDelete: any;

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
