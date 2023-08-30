import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ComplaintsService } from 'src/app/shared/services/complaints/complaints.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
})
export class ComplaintsComponent implements OnInit {
  complaints: any = [];
  complaintTypes = ['Dispute', 'Service', 'Website Issue'];
  complaint: any = {};

  confirmationDialog = false;

  categorySelected = '';

  constructor(
    private complaintService: ComplaintsService,
    private authService: AuthService
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
            console.log(false);
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
      });
  }

  onRemove = (complaint: any) => {
    this.complaint = complaint;
    this.confirmationDialog = true;
  };

  onCloseConfirmationDialog = () => {
    this.confirmationDialog = false;
  };
}
