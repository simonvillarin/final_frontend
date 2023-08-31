import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.component.html',
  styleUrls: ['./farmers.component.scss'],
})
export class FarmersComponent {
  farmers: any = [];
  farmer: any = {};
  statusArr: any = ['Active', 'Inactive', 'Pending'];

  detailsDialog = false;
  confirmationDialog = false;

  statusSelected: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getFarmers();
  }

  getFarmers(): void {
    this.userService.getAllFarmers().subscribe(
      (data: any[]) => {
        this.farmers = data.sort((a: any, b: any) => b.userId - a.userId);
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
          this.farmers = data.sort((a: any, b: any) => b.userId - a.userId);

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
        },
        () => {
          this.authService.logout();
        }
      );
    }
  };

  onClear = () => {
    this.statusSelected = '';
    this.getFarmers();
  };

  onCancelDelete(): void {
    this.confirmationDialog = false;
  }

  onDelete = (farmer: any) => {
    this.farmer = farmer;
    this.confirmationDialog = true;
  };

  onConfirmDelete(): void {
    let payload: any = {};

    if (this.farmer.status === 'Inactive') {
      payload.status = 'Active';
    } else {
      payload.status = 'Inactive';
    }

    this.userService.updateUser(this.farmer.userId, payload).subscribe(() => {
      this.getFarmers();
      this.confirmationDialog = false;
    });
  }

  openDetailsDialog = (farmer: any) => {
    this.farmer = farmer;
    this.detailsDialog = true;
  };

  closeDetailsDialog(): void {
    this.detailsDialog = false;
  }
}
