import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ComplaintsService } from 'src/app/shared/services/complaints/complaints.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
  providers: [MessageService],
})
export class ComplaintsComponent implements OnInit {
  complaints: any = [];
  complaintTypes = ['Dispute', 'Service', 'Website Issue'];
  complaint: any = {};

  confirmationDialog = false;

  categorySelected = '';
  search = '';
  empty = true;

  totalAds: number = 0;
  page: number = 0;

  constructor(
    private complaintService: ComplaintsService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getComplaints();
  }

  getComplaints = () => {
    this.complaintService.getAllComplaints().subscribe(
      (data: any) => {
        this.complaints = data.sort(
          (a: any, b: any) => b.complaintId - a.complaintId
        );
      },
      () => {
        this.authService.logout();
      }
    );
  };

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
      this.complaintService.getAllComplaints().subscribe(
        (data: any) => {
          this.complaints = data.sort(
            (a: any, b: any) => b.complaintId - a.complaintId
          );
          this.complaints = this.complaints.filter(
            (complaint: any) => complaint.complaintType === category
          );
        },
        () => {
          this.authService.logout();
        }
      );
    }
  };

  onClear = () => {
    this.categorySelected = '';
    this.getComplaints();
  };

  onStatusChanges = (status: string) => {
    if (status !== '') {
      this.complaintService.getAllComplaints().subscribe(
        (data: any[]) => {
          this.complaints = data.sort((a: any, b: any) => b.userId - a.userId);

          if (status === 'Active') {
            this.complaints = this.complaints.filter(
              (farmer: any) => farmer.status === true
            );
          } else {
            this.complaints = this.complaints.filter(
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

  onUpdateStatus(): void {
    this.complaintService
      .updateComplaint(this.complaint.complaintId, {
        status: !this.complaint.status,
      })
      .subscribe(() => {
        this.getComplaints();
        this.confirmationDialog = false;
        const summary = !this.complaint.status ? 'Solved' : 'Unsolved';
        const details = !this.complaint.status
          ? 'Solved Successfully'
          : 'Unsolved Sucessfully';
        this.messageService.add({
          severity: 'success',
          summary: summary,
          detail: details,
        });
      });
  }

  onRemove = (complaint: any) => {
    this.complaint = complaint;
    this.confirmationDialog = true;
  };

  onCloseConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  onSearchChange = (search: string) => {
    if (search !== '') {
      this.complaints = this.complaints.filter(
        (complaint: any) =>
          complaint.farmer.firstName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          complaint.farmer.lastName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          complaint.farmer.middleName
            .toLowerCase()
            .includes(search.toLowerCase())
      );
      if (this.complaints.length > 0) {
        this.empty = false;
      } else {
        this.empty = true;
      }
    } else {
      this.getCourses();
    }
  };

  getCourses = () => {
    this.complaintService.getAllComplaints().subscribe((data: any) => {
      this.complaintService.getAllComplaints().subscribe(
        (data: any) => {
          let tempCourses = data.sort(
            (a: any, b: any) => b.courseId - a.courseId
          );
          this.totalAds = tempCourses.length;
          this.complaints = tempCourses.splice(this.page * 5, 5);

          if (this.complaints.length > 0) {
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
