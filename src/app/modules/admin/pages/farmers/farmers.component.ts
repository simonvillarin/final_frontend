import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.component.html',
  styleUrls: ['./farmers.component.scss'],
  providers: [MessageService],
})
export class FarmersComponent {
  farmers: any = [];
  farmer: any = {};
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
    private messageService: MessageService
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

    if (this.farmer.status === 'Active') {
      payload.status = 'Inactive';
    } else {
      payload.status = 'Active';
    }

    this.userService.updateUser(this.farmer.userId, payload).subscribe(() => {
      this.getFarmers();
      this.confirmationDialog = false;
      const summary =
        this.farmer.status === 'Inactive' ? 'Activated' : 'Deactivated';
      const details =
        this.farmer.status === 'Inactive'
          ? 'Activated Successfully'
          : 'Deactivated Sucessfully';
      this.messageService.add({
        severity: 'success',
        summary: summary,
        detail: details,
      });
    });
  }

  openDetailsDialog = (farmer: any) => {
    this.farmer = farmer;
    this.detailsDialog = true;
  };

  closeDetailsDialog(): void {
    this.detailsDialog = false;
  }

  onSearchChange = (search: string) => {
    if (search !== '') {
      this.farmers = this.farmers.filter(
        (farmer: any) =>
          farmer.firstName.toLowerCase().includes(search.toLowerCase()) ||
          farmer.lastName.toLowerCase().includes(search.toLowerCase()) ||
          farmer.middleName.toLowerCase().includes(search.toLowerCase())
      );
      if (this.farmers.length > 0) {
        this.empty = false;
      } else {
        this.empty = true;
      }
    } else {
      this.getCourses();
    }
  };

  getCourses = () => {
    this.userService.getAllFarmers().subscribe((data: any) => {
      this.userService.getAllFarmers().subscribe(
        (data: any) => {
          let tempCourses = data.sort(
            (a: any, b: any) => b.courseId - a.courseId
          );
          this.totalAds = tempCourses.length;
          this.farmers = tempCourses.splice(this.page * 5, 5);

          if (this.farmers.length > 0) {
            this.empty = false;
          } else {
            this.empty = true;
          }
        },
        () => {
          this.authService.logout();
        }
      );
    });
  };
}
